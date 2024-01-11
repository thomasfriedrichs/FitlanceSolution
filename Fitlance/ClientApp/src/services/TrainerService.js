import apiClient from "./AxiosAPIClient";

export const fetchTrainers = async () => {
    try {
        const response = await apiClient
            .get('/api/Users/FindTrainers');
        return response.data;
    } catch (err) {
        console.log(err);
    };
};