import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var ReservationSchema = new Schema({
    solution_id: { type: String, required: true, },
    email: { type: String, required: true },
    passengers: [{
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        seats: [{
            seat: { type: String, required: true },
            train: { type: Schema.Types.ObjectId, ref: 'Train', required: true },
            departure_time: { type: Date, required: true },
            arrival_time: { type: Date, required: true },
        }],
    }],
    reservation_date: { type: Date, default: Date.now },
});

export default mongoose.model('Reservation', ReservationSchema);