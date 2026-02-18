import axios from 'axios';
import config from './config'; // Ensure this is the correct path to your config file

const apiClient = axios.create({
    baseURL: `${config.apiUrl}`, // Use your API base URL
    headers: {
        'Content-Type': 'application/json'
    }
});

export const setupAxiosInterceptors = (navigate) => {
    apiClient.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('jwtToken'); // Fetch the token from localStorage
            if (token) {
                config.headers.Authorization = `Bearer ${token}`; // Add Authorization header
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    apiClient.interceptors.response.use(
        (response) => response,
        (error) => {
            console.error('Axios DUPA:', error.response);
            if (error.response && error.response.status === 401) {
                console.error('Unauthorized! Redirecting to login...');
                localStorage.removeItem('jwtToken'); // Clear the invalid token
                navigate('/login'); // Redirect to the login page
            }
            return Promise.reject(error);
        }
    );
};

export default apiClient;
