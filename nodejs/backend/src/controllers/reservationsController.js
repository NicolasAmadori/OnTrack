import User from '#src/models/userModel.js';
import Reservation from '#src/models/reservationModel.js';
import Solution from '#src/models/solutionModel.js';

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
            .exec();

        const resSol = await Promise.all(reservations.map(async(r) => {
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