import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var TrainSchema = new Schema({
    acronym: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    denomination: { type: String, required: true },
    delay: { type: Number, default: 0 },
    bathrooms: [{
        isOccupied: { type: Boolean, default: false },
        queue: { type: [String], default: [] }
    }],
    reservedSeats: { type: [String], default: [] }
});

export default mongoose.model('Train', TrainSchema);