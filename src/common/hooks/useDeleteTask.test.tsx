import { type ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDeleteTask } from './useDeleteTask';
import { api } from '@/common/utils/api';
import type { Task } from '@/common/models/Task';

// Mock the API module
vi.mock('@/common/utils/api', () => ({
  api: {
    delete: vi.fn(),
  },
}));

// Type the mocked API - cast to access mock methods
const mockApi = api as unknown as {
  delete: ReturnType<typeof vi.fn>;
};

describe('useDeleteTask', () => {
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const Wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    return { Wrapper, queryClient };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete task successfully', async () => {
    // Arrange
    const taskId = 'task-1';
    const mockTasks: Task[] = [
      { id: 'task-1', title: 'Task 1', isComplete: false },
      { id: 'task-2', title: 'Task 2', isComplete: false },
    ];

    mockApi.delete.mockResolvedValue({});

    const { Wrapper, queryClient } = createWrapper();
    const { result } = renderHook(() => useDeleteTask(), {
      wrapper: Wrapper,
    });

    // Pre-populate cache with tasks
    queryClient.setQueryData(['tasks'], mockTasks);

    // Act
    result.current.mutate({ taskId });

    // Assert - Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApi.delete).toHaveBeenCalledWith('/tasks/task-1');

    // Verify task was removed from cache
    const cachedTasks = queryClient.getQueryData(['tasks']);
    expect(cachedTasks).toEqual([{ id: 'task-2', title: 'Task 2', isComplete: false }]);
  });

  it('should handle delete error', async () => {
    // Arrange
    const taskId = 'task-1';
    const deleteError = new Error('Delete failed');

    mockApi.delete.mockRejectedValue(deleteError);

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useDeleteTask(), {
      wrapper: Wrapper,
    });

    // Act
    result.current.mutate({ taskId });

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(deleteError);
    expect(mockApi.delete).toHaveBeenCalledWith('/tasks/task-1');
  });

  it('should invalidate queries on successful delete', async () => {
    // Arrange
    const taskId = 'task-1';
    mockApi.delete.mockResolvedValue({});

    const { Wrapper, queryClient } = createWrapper();
    const { result } = renderHook(() => useDeleteTask(), {
      wrapper: Wrapper,
    });

    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const removeQueriesSpy = vi.spyOn(queryClient, 'removeQueries');

    // Act
    result.current.mutate({ taskId });

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['tasks'], exact: true });
    expect(removeQueriesSpy).toHaveBeenCalledWith({ queryKey: ['tasks', taskId] });
  });

  it('should handle empty cache gracefully', async () => {
    // Arrange
    const taskId = 'task-1';
    mockApi.delete.mockResolvedValue({});

    const { Wrapper, queryClient } = createWrapper();
    const { result } = renderHook(() => useDeleteTask(), {
      wrapper: Wrapper,
    });

    // Don't pre-populate cache - leave it undefined

    // Act
    result.current.mutate({ taskId });

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApi.delete).toHaveBeenCalledWith('/tasks/task-1');
    // Cache should remain undefined
    expect(queryClient.getQueryData(['tasks'])).toBeUndefined();
  });
});
