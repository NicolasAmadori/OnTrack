export const get_all_stations = async (req, res) => {
    const name = req.query.station_name || "\\";
    try {
        const LIMIT = 100000;
        const response = await fetch(`https://www.lefrecce.it/Channels.Website.BFF.WEB/website/locations/search?name=${encodeURIComponent(name)}&limit=${LIMIT}`);
        const data = await response.json();
        return res.status(200).json({
            success: true,
            stations: data
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            errors: [{
                message: err
            }]
        });
    }
};