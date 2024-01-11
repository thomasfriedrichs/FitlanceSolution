import apiClient from "./AxiosAPIClient";

export const login = async (email, password) => {
    try {
        const response = await apiClient.post('/api/Auth/login', {
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const logout = async (userId) => {
    try {
        await apiClient.post('/api/Auth/logout', { userId });
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const register = async (username, email, password, role) => {
    try {
        const response = await apiClient.post('/api/Auth/register', {
            username,
            email,
            password,
            role
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};