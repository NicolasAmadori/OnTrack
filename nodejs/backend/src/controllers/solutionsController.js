import { addTrainsToDB } from "#src/services/trainServices.js";
import { addSolutionsToDB } from "#src/services/solutionServices.js";

export const get_solutions = async function(req, res) {
    const { fromStationID, toStationID, departureDatetime, passengersNumber } = req.query;

    const payload = {
        "departureLocationId": fromStationID,
        "arrivalLocationId": toStationID,
        "departureTime": departureDatetime,
        "adults": passengersNumber,
    };

    try {
        const response = await fetch("https://www.lefrecce.it/Channels.Website.BFF.WEB/website/ticket/solutions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!data.solutions) {
            return res.status(200).json({ success: true, solutions: [] });
        }
        const validSolutions = data.solutions.filter(
            sol => sol.solution.status === "SALEABLE" && sol.solution.price !== null && sol.solution.price.amount !== null && sol.solution.price.amount > 0
        );

        await addTrainsToDB(validSolutions);
        await addSolutionsToDB(validSolutions);
        return res.status(200).json({ success: true, solutions: validSolutions});
    } catch (err) {
        return res.status(500).json({
            success: false,
            errors: [{
                message: err.message
            }]
        });
    }
};