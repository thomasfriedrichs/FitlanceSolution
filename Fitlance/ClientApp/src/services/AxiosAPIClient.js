import axios from 'axios';

const apiClient = axios.create({
    withCredentials: true,
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

apiClient.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                console.log("refresh attempt")
                // Trigger a refresh token call.
                await apiClient.post('api/Auth/refresh', {});
                // Retry the original request. 
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Handle token refresh error
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
