import { addTrainsToDB } from "#src/services/trainServices.js";
import { addSolutionsToDB, getSolutionByID} from "#src/services/solutionServices.js";
import { joinReservationsWithSolutions } from "#src/controllers/reservationsController.js";
import Reservation from "#src/models/reservationModel.js";

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

export const get_solution = async function(req, res) {
    const solutionId = req.params.solutionId;

    try {
        const solution = await getSolutionByID(solutionId);
        if (!solution) {
            return res.status(404).json({ success: false, errors:[{ message: "Solution not found" }]});
        }
        return res.status(200).json({ success: true, solution: solution });
    } catch (error) {
        return res.status(500).json({ success: false, errors:[{ message: error.message }]});
    }
};

export const get_solution_occupied_seats = async function(req, res) {
    try {
        const solutionId = req.params.solutionId;

        const solution = await getSolutionByID(solutionId);
        if (!solution) {
            return res.status(404).json({ success: false, errors: [{ message: "Solution not found" }] });
        }

        const trainsToOccupiedSeats = {};

        const allReservations = await Reservation.find().exec();
        const reservations = await joinReservationsWithSolutions(allReservations);

        for (const solNode of solution.nodes) {
            const solTrainCode = solNode.train.code;
            const solDepTime = new Date(solNode.departure_time).getTime();
            const solArrTime = new Date(solNode.arrival_time).getTime();

            const occupiedSeatsSet = new Set();
            for (const reservation of reservations) {
                if (!reservation.passengers || !Array.isArray(reservation.passengers)) continue;

                for (const passenger of reservation.passengers) {
                    if (!passenger.seats || !Array.isArray(passenger.seats)) continue;

                    for (const seatInfo of passenger.seats) {
                        const resNode = reservation.nodes.find(n => n._id.toString() === seatInfo.node.toString());

                        if (resNode) {
                            const resTrainCode = resNode.train.code;

                            if (solTrainCode === resTrainCode) {
                                const resDepTime = new Date(resNode.departure_time).getTime();
                                const resArrTime = new Date(resNode.arrival_time).getTime();
                                if (resDepTime < solArrTime && resArrTime > solDepTime) {
                                    occupiedSeatsSet.add(seatInfo.seat);
                                }
                            }
                        }
                    }
                }
            }

            trainsToOccupiedSeats[solTrainCode] = Array.from(occupiedSeatsSet);
        }

        return res.status(200).json({ success: true, occupied_seats: trainsToOccupiedSeats });

    } catch (err) {
        return res.status(500).json({ success: false, errors: [{ message: err.message }] });
    }
};