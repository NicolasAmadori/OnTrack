import { API_BASE_URL } from '@/util/constants.js';
import { checkResponseSuccess } from './util';

export async function getAllUsers(authToken) {
    if (authToken === null) {
        throw new Error("User not authenticated");
    }

    const response = await fetch(`${API_BASE_URL}/users/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
    });

    const data = await response.json();
    checkResponseSuccess(response, data);
    return data.users;
}

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

    return data.user;
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

export async function deleteUser(authToken, userId) {
    if (authToken === null) {
        throw new Error("User not authenticated");
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Unknown error');
    }
}