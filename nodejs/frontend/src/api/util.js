export function checkResponseSuccess(response, data) {
    if (!response.ok || !data.success) {
        let errorMessage = ""
        data.errors.forEach(({ field, message }) => {
            errorMessage = errorMessage + `Error in ${field}: ${message}\n`
        });
        throw new Error(errorMessage || 'Unknown error');
    }
}