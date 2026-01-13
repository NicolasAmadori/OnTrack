export const formatTime = (dateStr) => {
    if (!dateStr) return '';
    try {
        const d = new Date(dateStr);
        return d.toLocaleTimeString('en-UK', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        return dateStr;
    }
};