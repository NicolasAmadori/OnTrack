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