import {API_BASE_URL} from "@/util/constants.js";
import { checkResponseSuccess } from "@/api/util.js";

export async function lockOrRenewSeats(authToken, bookingGroups) {
    if (!authToken) {
        throw new Error("User not authenticated");
    }

    const response = await fetch(`${API_BASE_URL}/solutions/select`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ bookingGroups })
    });

    const data = await response.json();
    checkResponseSuccess(response, data);
    return data.results;
}