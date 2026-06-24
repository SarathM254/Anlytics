import axios from 'axios';

let rawBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/analytics';

// Normalize the URL: ensure it ends with /api/analytics
if (rawBaseURL && !rawBaseURL.includes('/api/analytics')) {
    if (rawBaseURL.endsWith('/api')) {
        rawBaseURL = `${rawBaseURL}/analytics`;
    } else {
        const cleanBase = rawBaseURL.replace(/\/$/, '');
        rawBaseURL = `${cleanBase}/api/analytics`;
    }
}

const api = axios.create({
    baseURL: rawBaseURL,
});

export const getSummaries = () => api.get('/summary').then(res => res.data);
export const getSalesmenSnapshots = (date) => api.get(`/salesmen?date=${date}`).then(res => res.data);
export const triggerSync = () => api.post('/sync').then(res => res.data);

export default api;
