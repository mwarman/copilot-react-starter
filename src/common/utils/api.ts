import axios from 'axios';

/**
 * Base API instance configured with the API base URL from environment variables.
 * Default timeout is set to 10 seconds.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Error handler that can be used in catch blocks for API requests.
 * @param error - The error object caught in the catch block
 * @returns A formatted error object with status and message
 */
export const handleApiError = (error: unknown): { status: number; message: string } => {
  // Handle Axios errors
  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return { status, message };
  }

  // Handle other errors
  return {
    status: 500,
    message: error instanceof Error ? error.message : 'An unknown error occurred',
  };
};
