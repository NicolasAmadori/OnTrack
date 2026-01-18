import { API_BASE_URL } from '@/util/constants.js';
import { checkResponseSuccess } from "./util";

export async function get_trains(authToken, date = new Date(new Date().toLocaleString('en-US', { timeZone: 'CET' })), searchQuery = '') {
    if (authToken == null) {
        throw new Error('Authentication token is required');
    }

    const response = await fetch(`${API_BASE_URL}/trains?date=${date.toISOString()}&search=${encodeURIComponent(searchQuery)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
    });

    const data = await response.json();
    checkResponseSuccess(response, data);

    return data.trains;
}

export async function get_train(trainCode) {
    if (trainCode == null) {
        throw new Error('Train code is required');
    }
    const response = await fetch(`${API_BASE_URL}/trains/${trainCode}`, { method: 'GET' });
    const data = await response.json();
    checkResponseSuccess(response, data);

    return data.train;
}

export async function delete_train(authToken, trainId) {
    if (authToken == null) {
        throw new Error('Authentication token is required');
    }
    if (trainId == null) {
        throw new Error('Train ID is required');
    }

    const response = await fetch(`${API_BASE_URL}/trains/${trainId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
    });

    const data = await response.json();
    checkResponseSuccess(response, data);
}

export async function update_train(authToken, trainId, updateData) {
    if (authToken == null) {
        throw new Error('Authentication token is required');
    }
    if (trainId == null) {
        throw new Error('Train ID is required');
    }
    if (updateData == null) {
        throw new Error('Update data is required');
    }

    const response = await fetch(`${API_BASE_URL}/trains/${trainId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(updateData)
    });

    const data = await response.json();
    checkResponseSuccess(response, data);
}
