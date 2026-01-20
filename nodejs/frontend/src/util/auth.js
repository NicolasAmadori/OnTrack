import { useStorage } from '@vueuse/core';

import router from '@/router';

export function localLogin(token, id, is_admin) {
    localAuthToken.value = token;
    localId.value = id;
    localIsAdmin.value = is_admin;
}

export async function logout() {
    localAuthToken.value = null;
    localId.value = null;
    localIsAdmin.value = null;

    router.push('/login');
}

export const localAuthToken = useStorage('authToken', null);
export const localId = useStorage('id', null);
export const localIsAdmin = useStorage('is_admin', null);