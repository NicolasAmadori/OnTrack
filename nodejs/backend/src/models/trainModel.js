import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var TrainSchema = new Schema({
    code: { type: String, required: true },
    logo_id: { type: String, required: true },
    name: { type: String, required: true },
    acronym: { type: String, required: true },
    denomination: { type: String, required: true },
    date: { type: Date, required: true },
    delay: { type: Number, default: 0 },
    cancelled: { type: Boolean, default: false },
    bathrooms: {
        type: [{
            isOccupied: { type: Boolean, default: false },
            queue: { type: [String], default: [] }
        }],
        default: [{ isOccupied: false, queue: [] }, { isOccupied: false, queue: [] }]
    }
});

export default mongoose.model('Train', TrainSchema);