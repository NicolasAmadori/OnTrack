import { ref } from 'vue';

let nextId = 0;
const createError = (message) => ({ id: nextId++, text: message });

export function checkResponseSuccess(response, data) {
    if (!response.ok || !data.success) {
        const msgs = data.errors ? data.errors.map(error => error.message) : ['Unknown error'];
        createErrors(msgs);
    }
    if (response.ok && data.success && data.message) {
        successMessage.value = data.message;
    }
}

export const successMessage = ref('');
export const errorMessages = ref([]);
export const createErrors = (msgs) => {
    errorMessages.value = msgs.map(createError);
};