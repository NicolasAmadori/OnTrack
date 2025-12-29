import { API_BASE_URL } from '@/util/constants.js';
import { checkResponseSuccess } from './util';

export async function isTokenValid(authToken) {
    const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }
    });
    return response.ok;
}

export async function login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    checkResponseSuccess(response, data);

    localStorage.setItem('authToken', data.token);
    localStorage.setItem('id', data.id);
    localStorage.setItem('is_admin', data.is_admin);
}

export async function register(email, first_name, last_name, password, confirm_password) {
    const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, first_name, last_name, password, confirm_password }),
    });

    const data = await response.json();
    checkResponseSuccess(response, data);
}