import axios from "axios";

/**
 * API client for making requests to the backend server. It is configured with a base URL and includes an interceptor to attach the JWT token from localStorage to the Authorization header of each request.
 */
export const apiClient = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
    }
});

/**
 * Interceptor to attach the JWT token from localStorage to the Authorization header of each request. This ensures that authenticated requests include the necessary token for server-side validation.
 */
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

