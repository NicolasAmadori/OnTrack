import { API_BASE_URL } from '@/util/constants.js';
import { checkResponseSuccess } from "./util";

export async function get_stations(authToken, name) {
    var endpoint = `${API_BASE_URL}/stations/search`;
    if (name) {
        endpoint += `?station_name=${name}`
    }

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
    });

    const data = await response.json();
    checkResponseSuccess(response, data);
    return data.stations;
}