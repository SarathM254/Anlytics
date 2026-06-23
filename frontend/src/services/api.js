import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api/analytics',
});

export const getSummaries = () => api.get('/summary').then(res => res.data);
export const getSalesmenSnapshots = (date) => api.get(`/salesmen?date=${date}`).then(res => res.data);
export const triggerSync = () => api.post('/sync').then(res => res.data);

export default api;
