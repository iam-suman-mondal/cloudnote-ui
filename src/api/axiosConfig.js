import axios from 'axios';

const api = axios.create({
    // baseURL: 'http://localhost:8080', // Pointing to Local Spring Boot Backend
    baseURL: '', // to use Versal reverse proxy
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: This runs before EVERY request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            // If we have a token, attach it to the header
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;