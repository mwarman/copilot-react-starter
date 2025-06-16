import { describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useGetTasks } from './useGetTasks';
import { api } from '../../../common/utils/api';

// Mock the API module
vi.mock('../../../common/utils/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('useGetTasks', () => {
  // Create a new QueryClient for each test
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  it('should fetch tasks successfully', async () => {
    // Mock API response
    const mockTasks = [
      {
        id: '1',
        title: 'Task 1',
        detail: 'Detail 1',
        isComplete: false,
        dueAt: '2025-06-20T12:00:00Z',
      },
      {
        id: '2',
        title: 'Task 2',
        isComplete: true,
      },
    ];

    // Set up the mock to return the expected data
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockTasks });

    // Render the hook with the wrapper
    const { result } = renderHook(() => useGetTasks(), {
      wrapper: createWrapper(),
    });

    // Initial state should be loading
    expect(result.current.isLoading).toBe(true);

    // Wait for the query to complete
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Verify the data is correct
    expect(result.current.data).toEqual(mockTasks);
    expect(api.get).toHaveBeenCalledWith('/tasks');
  });

  it('should handle error states', async () => {
    // Mock API error response
    const error = new Error('Failed to fetch tasks');
    vi.mocked(api.get).mockRejectedValueOnce(error);

    // Render the hook with the wrapper
    const { result } = renderHook(() => useGetTasks(), {
      wrapper: createWrapper(),
    });

    // Wait for the query to fail
    await waitFor(() => expect(result.current.isError).toBe(true));

    // Verify the error state
    expect(result.current.error).toBeDefined();
  });
});
