import api from '../api/axiosConfig';

export const login = async (username, password) => {
    try {
        const response = await api.post('/auth/login', { username, password });
        if (response.data.token) {
            // Save the digital badge to the browser's storage
            localStorage.setItem('jwtToken', response.data.token);
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const register = async (user) => {
    return api.post('/auth/signup', user);
};

export const logout = () => {
    localStorage.removeItem('jwtToken');
};