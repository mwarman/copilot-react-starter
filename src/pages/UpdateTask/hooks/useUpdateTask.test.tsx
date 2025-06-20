import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest';
import { useUpdateTask } from './useUpdateTask';
import { api } from '../../../common/utils/api';
import type { Task } from '../../../common/models/Task';
import { type ReactNode } from 'react';

// Mock the API
vi.mock('../../../common/utils/api', () => ({
  api: {
    put: vi.fn(),
  },
}));

const mockApi = {
  put: api.put as MockedFunction<typeof api.put>,
};

// Mock data
const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  detail: 'Test details',
  isComplete: false,
  dueAt: '2023-12-31T23:59:59.999Z',
};

const updatedTaskData = {
  title: 'Updated Task',
  detail: 'Updated details',
  isComplete: true,
  dueAt: '2024-01-01T23:59:59.999Z',
};

describe('useUpdateTask', () => {
  let queryClient: QueryClient;

  // Helper function to create wrapper with QueryClient
  const createWrapper = (client: QueryClient) => {
    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  it('should update task successfully', async () => {
    // Arrange
    const updatedTask = { ...mockTask, ...updatedTaskData };
    mockApi.put.mockResolvedValueOnce({ data: updatedTask });

    // Set initial data in the query client
    queryClient.setQueryData(['tasks', '1'], mockTask);
    queryClient.setQueryData(['tasks'], [mockTask]);

    const { result } = renderHook(() => useUpdateTask(), {
      wrapper: createWrapper(queryClient),
    });

    // Act
    result.current.mutate({
      taskId: '1',
      data: updatedTaskData,
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApi.put).toHaveBeenCalledWith('/tasks/1', updatedTaskData);
  });

  it('should optimistically update task', async () => {
    // Arrange
    const updatedTask = { ...mockTask, ...updatedTaskData };
    mockApi.put.mockResolvedValueOnce({ data: updatedTask });

    // Set initial data in the query client
    queryClient.setQueryData(['tasks', '1'], mockTask);
    queryClient.setQueryData(['tasks'], [mockTask]);

    const { result } = renderHook(() => useUpdateTask(), {
      wrapper: createWrapper(queryClient),
    });

    // Act
    result.current.mutate({
      taskId: '1',
      data: updatedTaskData,
    });

    // Wait for the optimistic update to complete
    await waitFor(() => {
      const individualTask = queryClient.getQueryData<Task>(['tasks', '1']);
      expect(individualTask?.title).toBe('Updated Task');
    });

    // Assert - Check optimistic update happened
    const taskList = queryClient.getQueryData<Task[]>(['tasks']);
    expect(taskList?.[0]?.title).toBe('Updated Task');
  });

  it('should rollback optimistic updates on error', async () => {
    // Arrange
    mockApi.put.mockRejectedValueOnce(new Error('API Error'));

    // Set initial data in the query client
    queryClient.setQueryData(['tasks', '1'], mockTask);
    queryClient.setQueryData(['tasks'], [mockTask]);

    const { result } = renderHook(() => useUpdateTask(), {
      wrapper: createWrapper(queryClient),
    });

    // Act
    result.current.mutate({
      taskId: '1',
      data: updatedTaskData,
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Check that data was rolled back
    const individualTask = queryClient.getQueryData<Task>(['tasks', '1']);
    expect(individualTask?.title).toBe('Test Task');

    const taskList = queryClient.getQueryData<Task[]>(['tasks']);
    expect(taskList?.[0]?.title).toBe('Test Task');
  });

  it('should handle missing task in cache', async () => {
    // Arrange
    const updatedTask = { id: '1', ...updatedTaskData };
    mockApi.put.mockResolvedValueOnce({ data: updatedTask });

    // Don't set initial data in the query client
    const { result } = renderHook(() => useUpdateTask(), {
      wrapper: createWrapper(queryClient),
    });

    // Act
    result.current.mutate({
      taskId: '1',
      data: updatedTaskData,
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApi.put).toHaveBeenCalledWith('/tasks/1', updatedTaskData);
  });

  it('should invalidate queries after update', async () => {
    // Arrange
    const updatedTask = { ...mockTask, ...updatedTaskData };
    mockApi.put.mockResolvedValueOnce({ data: updatedTask });

    // Set initial data in the query client
    queryClient.setQueryData(['tasks', '1'], mockTask);
    queryClient.setQueryData(['tasks'], [mockTask]);

    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useUpdateTask(), {
      wrapper: createWrapper(queryClient),
    });

    // Act
    result.current.mutate({
      taskId: '1',
      data: updatedTaskData,
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['tasks'], exact: true });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['tasks', '1'] });
  });
});
