import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true},
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    is_admin: { type: Boolean, required: true, default: false },
    registration_date: { type: Date, required: true, default: Date.now },
    reservations: { type: [Schema.Types.ObjectId], ref: 'Reservation', default: [] }
});

export default mongoose.model('User', UserSchema);