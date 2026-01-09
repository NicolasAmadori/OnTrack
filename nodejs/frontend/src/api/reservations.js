import { API_BASE_URL } from '@/util/constants.js';
import { checkResponseSuccess } from './util';

export async function getUserReservations(authToken, id) {
    if (authToken === null) {
        throw new Error("User not authenticated");
    }
    if (id === null) {
        throw new Error("Id not found");
    }

    const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
    });
    const data = await response.json();
    checkResponseSuccess(response, data);

    return data.reservations;
}