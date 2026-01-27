import axios from 'axios';

const api = axios.create({
    // baseURL: 'http://localhost:8080', // Pointing to your Local Spring Boot Backend
    // baseURL: 'http://cloudnote-alb-1484943500.ap-south-1.elb.amazonaws.com', // Pointing to your Cloud Spring Boot Backend
    baseURL: '', // For deploying on Versal
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