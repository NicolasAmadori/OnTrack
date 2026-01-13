import { ref } from 'vue';

export function checkResponseSuccess(response, data) {
    if (!response.ok || !data.success) {
        errorMessages.value = data.errors.map(error => error.message) || ['Unknown error'];
    }
    if (response.ok && data.success && data.message) {
        successMessage.value = data.message;
    }
}

export const successMessage = ref('');
export const errorMessages = ref([]);