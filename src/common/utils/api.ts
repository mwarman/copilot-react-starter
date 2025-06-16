import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';

/**
 * Axios instance with base configuration for API requests
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Error handling interceptor for API responses
 */
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // You can add custom error handling logic here
    // For example, handling authentication errors, etc.
    return Promise.reject(error);
  },
);
