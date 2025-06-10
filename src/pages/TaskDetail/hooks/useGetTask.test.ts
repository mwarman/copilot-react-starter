import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGetTask } from './useGetTask';
import { api } from '@/common/utils/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type Task } from '@/common/models/Task';
import React from 'react';

// Mock the API module
vi.mock('@/common/utils/api', () => ({
  api: {
    get: vi.fn(),
  },
  handleApiError: vi.fn((error) => {
    if (error.response) {
      return { status: error.response.status, message: error.message };
    }
    return { status: 500, message: 'An unknown error occurred' };
  }),
}));

describe('useGetTask', () => {
  let queryClient: QueryClient;

  // Create a wrapper function for the QueryClientProvider
  function wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  }

  // Global test setup
  beforeEach(() => {
    // Arrange - Setup QueryClient for each test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  it('should fetch a task successfully', async () => {
    // Arrange
    const mockTask: Task = {
      id: '123',
      title: 'Test Task',
      detail: 'This is a test task',
      isComplete: false,
      dueAt: '2023-12-31T23:59:59Z',
    };
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockTask });

    // Act
    const { result } = renderHook(() => useGetTask('123'), { wrapper });

    // Assert
    // Initially, the query should be loading
    expect(result.current.isLoading).toBe(true);

    // Wait for the query to complete
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Verify the API was called correctly
    expect(api.get).toHaveBeenCalledWith('/tasks/123');

    // Verify the data is returned correctly
    expect(result.current.data).toEqual(mockTask);
  });

  it('should handle API errors', async () => {
    // Arrange
    const mockError = new Error('Not found') as Error & {
      response: { status: number; data: { message: string } };
    };
    mockError.response = { status: 404, data: { message: 'Task not found' } };
    vi.mocked(api.get).mockRejectedValueOnce(mockError);

    // Act
    const { result } = renderHook(() => useGetTask('456'), { wrapper });

    // Assert
    // Wait for the query to fail
    await waitFor(() => expect(result.current.isError).toBe(true));

    // Verify the API was called correctly
    expect(api.get).toHaveBeenCalledWith('/tasks/456');

    // Verify the error is handled
    expect(result.current.error).toBeDefined();
  });

  it('should not run the query if taskId is not provided', async () => {
    // Arrange
    // No specific setup needed besides the QueryClient in beforeEach

    // Act
    const { result } = renderHook(() => useGetTask(''), { wrapper });

    // Assert
    // The query should not be enabled
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);

    // Verify the API was not called
    expect(api.get).not.toHaveBeenCalled();
  });
});
