import Train from '#src/models/trainModel.js';

export const get_trains = async function(req, res) {
    try {
        const dateParam = req.query.date || new Date().toISOString();
        const searchQuery = req.query.search || '';
        const date = new Date(dateParam).setHours(0, 0, 0, 0);

        const trains = await Train.find({
            date: { $eq: new Date(date) },
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
