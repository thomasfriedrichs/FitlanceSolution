import Cookies from "js-cookie";
import apiClient from "./AxiosAPIClient";


export const login = async (email, password) => {
    try {
        const response = await apiClient.post('/api/Auth/login', {
            email,
            password
        });
        Cookies.set("Id", response.data.Id)
        Cookies.set("Role", response.data.userRole[0])
        window.location.href = '/';   
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const logout = async (userId) => {
    try {
        await apiClient.post('/api/Auth/logout', userId);
        Cookies.remove("Id");
        Cookies.remove("Role");
        window.location.href = '/';   
    } catch (error) {
        Cookies.remove("Id");
        Cookies.remove("Role");
        window.location.href = '/';   
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
        Cookies.set("Id", response.data.Id)
        Cookies.set("Role", response.data.userRole[0])
        window.location.href = '/';   
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};