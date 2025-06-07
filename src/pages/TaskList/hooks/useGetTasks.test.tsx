import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { useGetTasks } from './useGetTasks';
import React from 'react';

// Mock the API module
vi.mock('@/common/utils/api', () => ({
  api: {
    get: vi.fn(),
  },
  handleApiError: (error: unknown) => ({
    status: 500,
    message: error instanceof Error ? error.message : 'An unknown error occurred',
  }),
}));

// Mock for axios
vi.mock('axios', () => ({
  default: {
    isAxiosError: vi.fn(),
  },
}));

describe('useGetTasks', () => {
  let queryClient: QueryClient;

  // Create a wrapper component for testing React Query hooks
  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks();

    // Create a new QueryClient for each test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  it('fetches tasks successfully', async () => {
    // Arrange
    const mockTasks = [
      { id: '1', title: 'Task 1', isComplete: false },
      { id: '2', title: 'Task 2', isComplete: true },
    ];

    const { api } = await import('@/common/utils/api');
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockTasks });

    // Act
    const { result } = renderHook(() => useGetTasks(), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockTasks);
    expect(api.get).toHaveBeenCalledWith('/tasks');
  });

  it('handles errors correctly', async () => {
    // Arrange
    const error = new Error('Failed to fetch tasks');

    const { api } = await import('@/common/utils/api');
    vi.mocked(api.get).mockRejectedValueOnce(error);
    vi.mocked(axios.isAxiosError).mockReturnValueOnce(false);

    // Act
    const { result } = renderHook(() => useGetTasks(), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Failed to fetch tasks');
  });
});
