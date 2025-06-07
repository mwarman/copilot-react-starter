import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleApiError } from './api';

// Define a mock AxiosError type for our tests
interface MockAxiosError {
  response?: {
    status: number;
    data?: {
      message?: string;
    };
  };
  message: string;
}

// Mock axios module
vi.mock('axios', async () => {
  return {
    default: {
      create: vi.fn().mockReturnValue({
        baseURL: 'http://localhost:3000',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      isAxiosError: vi.fn(),
    },
    isAxiosError: vi.fn(),
  };
});

// Import axios after mocking
import axios from 'axios';

// Import the module that uses axios after mocking
import * as apiModule from './api';

describe('API utilities', () => {
  describe('api instance', () => {
    it('should have an api instance with expected properties', () => {
      expect(apiModule.api).toBeDefined();
      // We can't easily test the initialization parameters since they're applied
      // during module loading, but we can test that the API exists
    });
  });

  describe('handleApiError', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should handle Axios errors with response', () => {
      // Mock Axios error
      const mockAxiosError: MockAxiosError = {
        response: {
          status: 404,
          data: {
            message: 'Resource not found',
          },
        },
        message: 'Request failed with status code 404',
      };

      // Setup the mock
      vi.mocked(axios.isAxiosError).mockReturnValue(true);

      const result = handleApiError(mockAxiosError);

      expect(axios.isAxiosError).toHaveBeenCalledWith(mockAxiosError);
      expect(result).toEqual({
        status: 404,
        message: 'Resource not found',
      });
    });

    it('should handle Axios errors without response data', () => {
      // Mock Axios error without response data
      const mockAxiosError: MockAxiosError = {
        response: {
          status: 500,
        },
        message: 'Network Error',
      };

      // Setup the mock
      vi.mocked(axios.isAxiosError).mockReturnValue(true);

      const result = handleApiError(mockAxiosError);

      expect(axios.isAxiosError).toHaveBeenCalledWith(mockAxiosError);
      expect(result).toEqual({
        status: 500,
        message: 'Network Error',
      });
    });

    it('should handle Axios errors without response', () => {
      // Mock Axios error without response
      const mockAxiosError: MockAxiosError = {
        message: 'Network Error',
      };

      // Setup the mock
      vi.mocked(axios.isAxiosError).mockReturnValue(true);

      const result = handleApiError(mockAxiosError);

      expect(axios.isAxiosError).toHaveBeenCalledWith(mockAxiosError);
      expect(result).toEqual({
        status: 500,
        message: 'Network Error',
      });
    });

    it('should handle regular Error objects', () => {
      // Create a regular Error
      const regularError = new Error('Something went wrong');

      // Setup the mock
      vi.mocked(axios.isAxiosError).mockReturnValue(false);

      const result = handleApiError(regularError);

      expect(axios.isAxiosError).toHaveBeenCalledWith(regularError);
      expect(result).toEqual({
        status: 500,
        message: 'Something went wrong',
      });
    });

    it('should handle unknown error types', () => {
      // Create an unknown error type
      const unknownError = { foo: 'bar' };

      // Setup the mock
      vi.mocked(axios.isAxiosError).mockReturnValue(false);

      const result = handleApiError(unknownError);

      expect(axios.isAxiosError).toHaveBeenCalledWith(unknownError);
      expect(result).toEqual({
        status: 500,
        message: 'An unknown error occurred',
      });
    });
  });
});
