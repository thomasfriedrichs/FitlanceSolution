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
    console.log("Calling getUserAppointments")
    try {
        console.log("UerAppointments Try Block")
        const response = await apiClient.get(`/api/Appointments/GetUserAppointments/${id}`);
        console.log("UserAppointments Response", response)
        console.log("Response Data from getUserAppointments", response.data)
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