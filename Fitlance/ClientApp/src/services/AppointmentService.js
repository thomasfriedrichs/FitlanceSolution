import Cookies from "js-cookie";

import apiClient from "./AxiosAPIClient";

export const postAppointment = async (reqObj) => {
    try {
        const response = await apiClient.post('/api/Appointments', reqObj);
        return response;
    } catch (err) {
        console.log(err);
    };
};

export const putAppointment = async (id, reqObj) => {
    try {
        const response = await apiClient.put(`/api/Appointments/${id}`, reqObj);
        return response;
    } catch (err) {
        console.log(err);
    };
};

export const getUserAppointments = async () => {
    const id = Cookies.get("Id");
    try {
        const response = await apiClient.get(`/api/Appointments/GetUserAppointments/${id}`);
        return response.data;
    } catch (err) {
        console.log(err);
    };
};

export const getTrainerAppointments = async () => {
    const id = Cookies.get("Id");
    try {
        const response = await apiClient.get(`/api/Appointments/GetTrainerAppointments/${id}`);
        return response.data;
    } catch (err) {
        console.log(err);
    };
};