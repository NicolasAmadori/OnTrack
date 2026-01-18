import User from '#src/models/userModel.js';
import Reservation from '#src/models/reservationModel.js';
import Solution from '#src/models/solutionModel.js';

const joinReservationsWithSolutions = async (reservations) => {
    return await Promise.all(reservations.map(async(r) => {
        const solTrain = await Solution.findOne({ solution_id: r.solution_id })
            .populate('nodes.train')
            .lean()
            .exec();

        const rObj = r.toObject ? r.toObject() : r;

        const { _id: solutionDbId, ...solutionData } = solTrain || {};

        const combined = { 
            ...rObj, 
            ...solutionData,
            solution_id: solutionDbId
        };
        return combined;
    }));
};

export const get_user_reservations = async function(req, res) {
     try {
        const userId = req.params.userId;
        const user = await User.findOne({ _id: userId }, "-password").exec();
        if (!user) {
            return res.status(404).json({ success: false, errors: [{ message: "User with id " + userId + " not found" }] });
        }

        const reservationsId = user.reservations;
        const reservations = await Reservation.find()
            .where('_id')
            .in(reservationsId)
            .populate('passengers.seats.node')
            .populate('passengers.seats.node.train')
            .exec();

        const resSol = await joinReservationsWithSolutions(reservations);
        const allNodes = resSol.flatMap(r => r.nodes);
        resSol.forEach(r => {
            r.passengers.forEach(p => p.seats.forEach(s => s.node = allNodes.find(n => n._id.toString() === s.node._id.toString())));
        });

        return res.status(200).json({
            success: true,
            count: reservations.length,
            reservations: resSol
        });
    } catch (err) {
         return res.status(500).json({
            success: false,
            errors: [{
                message: err.message
            }]
        });
    }
}

export const get_active_reservations_nodes = async function(req, res) {
    try {
        const userId = req.params.userId;
        const user = await User.findOne({ _id: userId }, "-password").exec();
        if (!user) {
            return res.status(404).json({ success: false, errors: [{ message: "User with id " + userId + " not found" }] });
        }
        const reservationsId = user.reservations;
        const reservations = await Reservation.find()
            .where('_id')
            .in(reservationsId)
            .exec();
        
        const allReservations = await joinReservationsWithSolutions(reservations);
        const cetNow = new Date().getTime();

        const activeNodes = allReservations
            .flatMap(r => r.nodes)
            .filter(n => !n.train.cancelled && 
                new Date(n.departure_time).getTime() < cetNow &&
                new Date(n.arrival_time).getTime() > cetNow);

        const activeNodeIds = activeNodes.map(n => n._id.toString());
        const passengers = allReservations
            .flatMap(r => r.passengers)
            .filter(p => p.seats.some(s =>  activeNodeIds.includes(s.node._id.toString())));
        passengers.forEach(p => p.seats = p.seats.filter(s => activeNodeIds.includes(s.node._id.toString())));
        passengers.forEach(p => p.seats.forEach(s => s.node = activeNodes.find(n => n._id.toString() === s.node._id.toString())));

        return res.status(200).json({
            success: true,
            count: activeNodes.length,
            nodes: activeNodes,
            passengers: passengers
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            errors: [{
                message: err.message
            }]
        });
    }
}


export const delete_reservation = async function(req, res) {
    try {
        const id = req.params.reservationId;
        const reservation = await Reservation.findOneAndDelete({ _id: id }, null);

        if (!reservation) {
            return res.status(404).json({ success: false, errors: [{ message: "Reservation not found" }] });
        }

        await User.updateOne({ reservations: id }, { $pull: { reservations: id } });

        return res.status(200).json({ success: true, message: 'Reservation deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, errors: [{ message: error.message }] });
    }
}

export const create_reservation = async function(req, res) {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId).exec();
        if (!user) {
            return res.status(404).json({ success: false, errors: [{ message: "User not found." }]});
        }

        const reservationData = req.body;
        const solution = await Solution.findOne({ solution_id: reservationData.solution_id }).exec();
        if (!solution) {
            return res.status(404).json({ success: false, errors: [{ message: "Solution with solution_id: " + reservationData.solution_id + " was not found."}]});
        }
        const createdReservation = await Reservation.create(reservationData);

        user.reservations.push(createdReservation._id);
        await user.save();

        return res.status(201).json({ success: true, reservation: createdReservation });
    } catch (error) {
        return res.status(500).json({ success: false, errors: [{ message: error.message }]});
    }
};