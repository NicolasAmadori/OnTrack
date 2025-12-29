import { API_BASE_URL } from '@/util/constants.js';
import { checkResponseSuccess } from './util';

export async function getUser(authToken, id) {
    if (authToken === null) {
        throw new Error("User not authenticated");
    }
    if (id === null) {
        throw new Error("Id not found");
    }

    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
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

export async function updateUser(authToken, id, data) {
    if (authToken === null) {
        throw new Error("User not authenticated");
    }
    if (id === null) {
        throw new Error("Id not found");
    }

    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(data)
    });
    const responseData = await response.json();
    checkResponseSuccess(response, responseData);

}