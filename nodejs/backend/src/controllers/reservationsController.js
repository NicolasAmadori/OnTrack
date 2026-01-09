import User from '#src/models/userModel.js';
import Reservation from '#src/models/reservationModel.js';
import Solution from '#src/models/solutionModel.js';

export const get_user_reservations = async function(req, res) {
     try {
        const userId = req.params.userId;
        const user = await User.findOne({ _id: userId }, "-password").exec();
        if (!user) {
            return res.status(404).json({ success: false, errors: [{ message: "User not found" + user }] });
        }

        const reservationsId = user.reservations;
        const reservations = await Reservation.find()
            .where('_id')
            .in(reservationsId)
            .exec();

        const resSol = await Promise.all(reservations.map(async(r) => {
            const s = await Solution.findOne({ solution_id: r.solution_id }).lean().exec();
            const rObj = r.toObject ? r.toObject() : r;
            const combined =  { ...rObj, ...s };
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