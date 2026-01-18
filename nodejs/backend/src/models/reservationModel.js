import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var ReservationSchema = new Schema({
    solution_id: { type: String, required: true, },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    passengers: [{
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        seats: [{
            seat: { type: String, required: true },
            node: { type: Schema.Types.ObjectId, required: true },
        }],
    }],
    reservation_date: { type: Date, default: Date.now },
});

export default mongoose.model('Reservation', ReservationSchema);