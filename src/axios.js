import axios from 'axios';

export const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`, // e.g., http://localhost:3001/api
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    function (error) {
        throw error;
    }
);

export default api;
