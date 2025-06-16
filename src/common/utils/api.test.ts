import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';

// Mock axios for testing
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        response: {
          use: vi.fn(),
        },
      },
    })),
  },
}));

// Mock import.meta.env
const originalEnv = { ...import.meta.env };

describe('API Utility', () => {
  beforeEach(() => {
    // Mock environment variables
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.com');

    // Clear mocks between tests
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original environment
    Object.keys(originalEnv).forEach((key) => {
      import.meta.env[key] = originalEnv[key];
    });
  });

  it('creates an axios instance with correct configuration', async () => {
    // Arrange
    vi.resetModules();

    // Act
    await import('./api');

    // Assert
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://api.example.com',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('registers response interceptors', async () => {
    // Arrange
    const useSpy = vi.fn();
    const mockCreate = axios.create as unknown as {
      mockReturnValueOnce: (value: unknown) => void;
    };
    mockCreate.mockReturnValueOnce({
      interceptors: {
        response: {
          use: useSpy,
        },
      },
    });
    vi.resetModules();

    // Act
    await import('./api');

    // Assert
    expect(useSpy).toHaveBeenCalledTimes(1);
    const [successHandler, errorHandler] = useSpy.mock.calls[0];
    expect(typeof successHandler).toBe('function');
    expect(typeof errorHandler).toBe('function');
  });

  it('passes through successful responses', async () => {
    // Arrange
    let successHandler: (response: AxiosResponse) => AxiosResponse;
    const mockCreate = axios.create as unknown as {
      mockReturnValueOnce: (value: unknown) => void;
    };
    mockCreate.mockReturnValueOnce({
      interceptors: {
        response: {
          use: vi.fn((onSuccess, _onError) => {
            successHandler = onSuccess;
          }),
        },
      },
    });
    vi.resetModules();
    await import('./api');
    const mockResponse = { data: { id: 1, name: 'Test Task' } } as AxiosResponse;

    // Act
    const result = successHandler!(mockResponse);

    // Assert
    expect(result).toBe(mockResponse);
  });

  it('rejects with the error in the error handler', async () => {
    // Arrange
    let errorHandler: (error: AxiosError) => Promise<never>;
    const mockCreate = axios.create as unknown as {
      mockReturnValueOnce: (value: unknown) => void;
    };
    mockCreate.mockReturnValueOnce({
      interceptors: {
        response: {
          use: vi.fn((_onSuccess, onError) => {
            errorHandler = onError;
          }),
        },
      },
    });
    vi.resetModules();
    await import('./api');
    const mockError = new Error('API Error') as AxiosError;

    // Act & Assert (combined for Promise rejection testing)
    await expect(errorHandler!(mockError)).rejects.toBe(mockError);
  });
});
