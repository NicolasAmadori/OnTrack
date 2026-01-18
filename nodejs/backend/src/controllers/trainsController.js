import Train from '#src/models/trainModel.js';

export const get_trains = async function(req, res) {
    try {
        const dateParam = req.query.date || new Date().toISOString();
        const searchQuery = req.query.search || '';
        
        const dateObj = new Date(dateParam);
        dateObj.setUTCHours(0, 0, 0, 0);

        const trains = await Train.find({
            date: { $eq: dateObj },
            code: { $regex: searchQuery, $options: 'i' }
        }).exec();

        return res.status(200).json({
            success: true,
            count: trains.length,
            trains: trains
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

export const get_train = async function(req, res) {
    try {
        const trainCode = req.params.trainCode;
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const train = await Train.findOne({ code: trainCode, date: today }).exec();
        if (!train) {
            return res.status(404).json({ success: false, errors: [{ message: "Train not found for today" }] });
        }
        return res.status(200).json({ success: true, train: train });
    } catch (err) {
        return res.status(500).json({
            success: false,
            errors: [{
                message: err.message
            }]
        });
    }
}

export const cancel_restore_train = async function(req, res) {
    try {
        const trainId = req.params.trainId;
        const train = await Train.findById(trainId);
        if (!train) {
            return res.status(404).json({ success: false, errors: [{ message: "Train not found" }] });
        }

        train.cancelled = !train.cancelled;
        await train.save();
        
        return res.status(200).json({
            success: true,
            message: `Train ${train.cancelled ? 'cancelled' : 'restored'} successfully`
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

export const update_train = async function(req, res) {
    try {
        const id = req.params.trainId;
        const train = req.body;
        const updatedTrain = {};

        if (train.delay) {
            updatedTrain.delay = train.delay;
        }
        if (train.cancelled) {
            updatedTrain.cancelled = train.cancelled;
        }
        if (train.bathrooms) {
            updatedTrain.bathrooms = train.bathrooms;
        }

        if (Object.keys(updatedTrain).length !== 0) {

            const result = await Train.updateOne({ _id: id }, updatedTrain);
            if (!result || result.matchedCount === 0) {
                return res.status(404).json({ success: false, errors: [{
                    message: "Train not found"
                }] });
            }

            if (result.modifiedCount === 0) {
                return res.status(200).json({ success: true, message: "No changes were made" });
            }

            return res.status(200).json({ success: true, message: "Train updated successfully" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, errors: [{
            message: error.message
        }] });
    }
}
