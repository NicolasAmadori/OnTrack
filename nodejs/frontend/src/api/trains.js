import { API_BASE_URL } from '@/util/constants.js';
import { checkResponseSuccess } from "./util";

export async function get_trains(authToken, date = new Date(), searchQuery = '') {
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
