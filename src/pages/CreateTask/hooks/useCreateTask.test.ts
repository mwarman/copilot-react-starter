import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCreateTask } from './useCreateTask';
import { api } from '@/common/utils/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';

// Mock the API module
vi.mock('@/common/utils/api', () => ({
  api: {
    post: vi.fn(),
  },
  handleApiError: vi.fn((error) => ({
    status: error.response?.status || 500,
    message: error.message || 'An error occurred',
  })),
}));

// Test wrapper with React Query provider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
};

describe('useCreateTask', () => {
  const mockTask = {
    id: '123',
    title: 'Test Task',
    detail: 'Task details',
    isComplete: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('successfully creates a task', async () => {
    // Arrange
    vi.mocked(api.post).mockResolvedValueOnce({ data: mockTask });
    const wrapper = createWrapper();
    const { result } = renderHook(() => useCreateTask(), { wrapper });
    const taskData = {
      title: 'Test Task',
      detail: 'Task details',
    };

    // Act
    result.current.mutate(taskData);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Assert
    expect(api.post).toHaveBeenCalledWith('/tasks', taskData);
    expect(result.current.data).toEqual(mockTask);
  });

  it('handles API errors', async () => {
    // Arrange
    const errorResponse = new Error('API Error');
    (errorResponse as { response?: { status: number } }).response = { status: 400 };
    vi.mocked(api.post).mockRejectedValueOnce(errorResponse);
    const wrapper = createWrapper();
    const { result } = renderHook(() => useCreateTask(), { wrapper });
    const taskData = { title: 'Test Task' };

    // Act
    result.current.mutate(taskData);
    await waitFor(() => expect(result.current.isError).toBe(true));

    // Assert
    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toBe('API Error');
  });
});
