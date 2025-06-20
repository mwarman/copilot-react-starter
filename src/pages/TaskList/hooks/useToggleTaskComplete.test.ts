import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest';
import { useToggleTaskComplete } from './useToggleTaskComplete';
import { api } from '../../../common/utils/api';
import type { Task } from '../../../common/models/Task';
import { createElement, type ReactNode } from 'react';

// Mock the API
vi.mock('../../../common/utils/api', () => ({
  api: {
    put: vi.fn(),
  },
}));

// Mock Sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { toast } from 'sonner';
const mockToast = vi.mocked(toast);

const mockApi = {
  put: api.put as MockedFunction<typeof api.put>,
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

const createWrapper = (queryClient: QueryClient) => {
  return ({ children }: { children: ReactNode }) => {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
};

describe('useToggleTaskComplete', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    detail: 'Test task detail',
    isComplete: false,
    dueAt: '2024-12-31T23:59:59Z',
  };

  it('should toggle task completion status successfully', async () => {
    // Arrange
    const updatedTask = { ...mockTask, isComplete: true };
    mockApi.put.mockResolvedValueOnce({ data: updatedTask });

    // Set initial data in the query client
    queryClient.setQueryData(['tasks', '1'], mockTask);
    queryClient.setQueryData(['tasks'], [mockTask]);

    const { result } = renderHook(() => useToggleTaskComplete(), {
      wrapper: createWrapper(queryClient),
    });

    // Act
    result.current.mutate({
      taskId: '1',
      isComplete: true,
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApi.put).toHaveBeenCalledWith('/tasks/1', {
      ...mockTask,
      isComplete: true,
    });
    expect(mockToast.success).toHaveBeenCalledWith('Task marked as complete!');
  });

  it('should show correct toast message when marking task as incomplete', async () => {
    // Arrange
    const completedTask = { ...mockTask, isComplete: true };
    const updatedTask = { ...completedTask, isComplete: false };
    mockApi.put.mockResolvedValueOnce({ data: updatedTask });

    // Set initial data in the query client with a completed task
    queryClient.setQueryData(['tasks', '1'], completedTask);
    queryClient.setQueryData(['tasks'], [completedTask]);

    const { result } = renderHook(() => useToggleTaskComplete(), {
      wrapper: createWrapper(queryClient),
    });

    // Act
    result.current.mutate({
      taskId: '1',
      isComplete: false,
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApi.put).toHaveBeenCalledWith('/tasks/1', {
      ...completedTask,
      isComplete: false,
    });
    expect(mockToast.success).toHaveBeenCalledWith('Task marked as incomplete!');
  });

  it('should optimistically update task completion status', async () => {
    // Arrange
    const updatedTask = { ...mockTask, isComplete: true };
    mockApi.put.mockResolvedValueOnce({ data: updatedTask });

    // Set initial data in the query client
    queryClient.setQueryData(['tasks', '1'], mockTask);
    queryClient.setQueryData(['tasks'], [mockTask]);

    const { result } = renderHook(() => useToggleTaskComplete(), {
      wrapper: createWrapper(queryClient),
    });

    // Act
    result.current.mutate({
      taskId: '1',
      isComplete: true,
    });

    // Wait for the optimistic update to complete
    await waitFor(() => {
      const individualTask = queryClient.getQueryData<Task>(['tasks', '1']);
      expect(individualTask?.isComplete).toBe(true);
    });

    // Assert - Check optimistic update happened
    const taskList = queryClient.getQueryData<Task[]>(['tasks']);
    expect(taskList?.[0]?.isComplete).toBe(true);
  });

  it('should rollback optimistic updates on error', async () => {
    // Arrange
    mockApi.put.mockRejectedValueOnce(new Error('API Error'));

    // Set initial data in the query client
    queryClient.setQueryData(['tasks', '1'], mockTask);
    queryClient.setQueryData(['tasks'], [mockTask]);

    const { result } = renderHook(() => useToggleTaskComplete(), {
      wrapper: createWrapper(queryClient),
    });

    // Act
    result.current.mutate({
      taskId: '1',
      isComplete: true,
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Check that data was rolled back
    const individualTask = queryClient.getQueryData<Task>(['tasks', '1']);
    const taskList = queryClient.getQueryData<Task[]>(['tasks']);

    expect(individualTask?.isComplete).toBe(false);
    expect(taskList?.[0]?.isComplete).toBe(false);
    expect(mockToast.error).toHaveBeenCalledWith('Failed to update task. Please try again.');
  });

  it('should handle error when task data is not in cache', async () => {
    // Arrange - Don't set any data in cache
    const { result } = renderHook(() => useToggleTaskComplete(), {
      wrapper: createWrapper(queryClient),
    });

    // Act
    result.current.mutate({
      taskId: '1',
      isComplete: true,
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(new Error('Task with ID 1 not found in cache'));
    expect(mockApi.put).not.toHaveBeenCalled();
  });

  it('should find task in task list when not in individual cache', async () => {
    // Arrange
    const updatedTask = { ...mockTask, isComplete: true };
    mockApi.put.mockResolvedValueOnce({ data: updatedTask });

    // Only set data in the task list, not in individual task cache
    queryClient.setQueryData(['tasks'], [mockTask]);

    const { result } = renderHook(() => useToggleTaskComplete(), {
      wrapper: createWrapper(queryClient),
    });

    // Act
    result.current.mutate({
      taskId: '1',
      isComplete: true,
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApi.put).toHaveBeenCalledWith('/tasks/1', {
      ...mockTask,
      isComplete: true,
    });
  });

  it('should show correct toast message when marking task as incomplete', async () => {
    // Arrange
    const completedTask = { ...mockTask, isComplete: true };
    const updatedTask = { ...completedTask, isComplete: false };
    mockApi.put.mockResolvedValueOnce({ data: updatedTask });

    // Set initial data in the query client with a completed task
    queryClient.setQueryData(['tasks', '1'], completedTask);
    queryClient.setQueryData(['tasks'], [completedTask]);

    const { result } = renderHook(() => useToggleTaskComplete(), {
      wrapper: createWrapper(queryClient),
    });

    // Act
    result.current.mutate({
      taskId: '1',
      isComplete: false,
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApi.put).toHaveBeenCalledWith('/tasks/1', {
      ...completedTask,
      isComplete: false,
    });
    expect(mockToast.success).toHaveBeenCalledWith('Task marked as incomplete!');
  });
});
