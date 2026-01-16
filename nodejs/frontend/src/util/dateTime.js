export const formatTime = (dateStr) => {
    if (!dateStr) return '';
    try {
        const d = new Date(dateStr);
        return d.toLocaleTimeString('en-UK', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        return dateStr;
    }
};

export const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-UK', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (e) {
        return dateStr;
    }
}

export const getDelayClass = (delay) => {
  if (!delay || delay <= 5) return 'text-green';
  if (delay < 30) return 'text-yellow';
  if (delay <= 60) return 'text-orange';
  return 'text-red';
};

export const getTimeDifference = (arrivalTime) => {
  if (!arrivalTime) return 0;
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'CET' }));
  const arrival = new Date(arrivalTime.toLocaleString('en-US', { timeZone: 'CET' }));
  return arrival - now;
};

export const formatDuration = (ms) => {
  if (ms <= 0) return '-';
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours > 0) return `${hours}h ${remainingMinutes}m`;
  return `${minutes}m`;
};

export const formatDateTimeCompact = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = date.toLocaleDateString('en-UK', { day: 'numeric', month: 'short' });
    const time = formatTime(dateStr);
    return `${day} ${time}`;
};