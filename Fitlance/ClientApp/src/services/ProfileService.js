import Cookies from "js-cookie";

import apiClient from "./AxiosAPIClient";

export const fetchProfile = async () => {
    const id = Cookies.get("Id");
    try {
        const response = await apiClient
            .get(`/api/Users/${id}`);
        return response.data;
    } catch (err) {
        console.log(err);
    };
};

export const putProfile = async (reqObj) => {
    const id = Cookies.get("Id");
    try {
        const response = await apiClient.put(`}/api/Users/${id}`, reqObj)
        return response.data;
    } catch (err) {
        console.log(err)
    };
};