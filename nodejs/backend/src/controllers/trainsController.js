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