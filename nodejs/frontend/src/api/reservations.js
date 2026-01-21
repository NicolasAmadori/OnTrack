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

export async function getActiveReservations(authToken, id) {
    if (authToken === null) {
        throw new Error("User not authenticated");
    }
    if (id === null) {
        throw new Error("Id not found");
    }

    const response = await fetch(`${API_BASE_URL}/reservations/active/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
    });

    const data = await response.json();
    checkResponseSuccess(response, data);

    return data;
}

export async function deleteReservation(authToken, reservationId) {
    if (authToken === null) {
        throw new Error("User not authenticated");
    }
    if (reservationId === null) {
        throw new Error("Reservation ID not found");
    }
    const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
    });
    const data = await response.json();
    checkResponseSuccess(response, data);
}

export async function createReservation(authToken, userId, reservationBody) {
    if (authToken === null) {
        throw new Error("User not authenticated");
    }
    if (userId === null) {
        throw new Error("Id not found");
    }
    const response = await fetch(`${API_BASE_URL}/reservations/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(reservationBody),
    });

    const data = await response.json();
    checkResponseSuccess(response, data);
}