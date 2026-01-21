import { API_BASE_URL } from '@/util/constants.js';
import { checkResponseSuccess } from "@/api/util.js";

export async function searchSolution(authToken, fromStationID, toStationID, departureDatetime, passengersNumber) {
    const params = new URLSearchParams({
        fromStationID: fromStationID,
        toStationID: toStationID,
        departureDatetime: departureDatetime,
        passengersNumber: passengersNumber
    }).toString();

    const response = await fetch(`${API_BASE_URL}/solutions?${params}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
    });

    const data = await response.json();
    checkResponseSuccess(response, data);
    return data.solutions;
}

export async function getSolution(authToken, solutionId) {
    if (authToken === null) {
        throw new Error("Authentication token missing");
    }

    const response = await fetch(`${API_BASE_URL}/solutions/${solutionId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
    });

    const data = await response.json();
    checkResponseSuccess(response, data);
    return data.solution;
}

export async function getSolutionOccupiedSeats(authToken, solutionId) {
    if (authToken === null) {
        throw new Error("User not authenticated");
    }

    const response = await fetch(`${API_BASE_URL}/solutions/${solutionId}/occupiedSeats`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
    });

    const data = await response.json();
    checkResponseSuccess(response, data);
    return data.occupied_seats;
}