export function checkResponseSuccess(response, data) {
    if (!response.ok || !data.success) {
        let errorMessage = ""
        data.errors.forEach(({ message }) => {
            errorMessage = errorMessage + `Error received: ${message}\n`
        });
        throw new Error(errorMessage || 'Unknown error');
    }
}