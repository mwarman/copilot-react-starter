import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUpdateTask } from './useUpdateTask';
import { api } from '@/common/utils/api';
import { type Task } from '@/common/models/Task';
import * as reactQuery from '@tanstack/react-query';
import { type UpdateTaskRequest } from '../schema';

// Mock dependencies
vi.mock('@/common/utils/api', () => ({
  api: {
    put: vi.fn(),
  },
  handleApiError: (error: unknown) => ({
    status: 500,
    message: error instanceof Error ? error.message : 'An unknown error occurred',
  }),
}));

// Mock React Query's useMutation and useQueryClient
vi.mock('@tanstack/react-query', () => {
  const mockTask: Task = {
    id: '123',
    title: 'Test Task',
    detail: 'This is a test task',
    isComplete: false,
    dueAt: '2025-01-01T00:00:00Z',
  };

  const mockTasksList: Task[] = [
    mockTask,
    {
      id: '456',
      title: 'Another Task',
      detail: 'This is another test task',
      isComplete: true,
    },
  ];

  const mockQueryClient = {
    cancelQueries: vi.fn(),
    getQueryData: vi.fn((queryKey: Array<string>) => {
      if (queryKey[0] === 'tasks') {
        return mockTasksList;
      }
      if (queryKey[0] === 'task' && queryKey[1] === '123') {
        return mockTask;
      }
      return null;
    }),
    setQueryData: vi.fn(),
    invalidateQueries: vi.fn(),
  };

  return {
    useMutation: ({
      mutationFn,
      onMutate,
      onError,
      onSettled,
    }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any) => {
      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mutate: async (variables: any) => {
          let context;
          if (onMutate) {
            context = await onMutate(variables);
          }
          try {
            const result = await mutationFn(variables);
            if (onSettled) {
              onSettled(result, null, variables, context);
            }
            return result;
          } catch (error) {
            if (onError) {
              onError(error, variables, context);
            }
            if (onSettled) {
              onSettled(null, error, variables, context);
            }
            throw error;
          }
        },
        isPending: false,
      };
    },
    useQueryClient: vi.fn().mockReturnValue(mockQueryClient),
  };
});

describe('useUpdateTask', () => {
  // Define mock tasks for testing
  const mockTask: Task = {
    id: '123',
    title: 'Test Task',
    detail: 'This is a test task',
    isComplete: false,
    dueAt: '2025-01-01T00:00:00Z',
  };

  const updatedTaskData: UpdateTaskRequest = {
    title: 'Updated Task',
    detail: 'This is an updated task',
    isComplete: true,
    dueAt: '2025-12-31T23:59:59Z',
  };

  const mockUpdatedTask: Task = {
    ...mockTask,
    ...updatedTaskData,
  };

  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls API with correctly filtered parameters', async () => {
    // Arrange
    vi.mocked(api.put).mockResolvedValueOnce({ data: mockUpdatedTask });

    // Act
    const updateTask = useUpdateTask();
    await updateTask.mutate({
      taskId: '123',
      taskData: updatedTaskData,
    });

    // Assert
    expect(api.put).toHaveBeenCalledWith('/tasks/123', {
      title: 'Updated Task',
      detail: 'This is an updated task',
      isComplete: true,
      dueAt: '2025-12-31T23:59:59Z',
    });
  });

  it('filters out empty string values', async () => {
    // Arrange
    const taskWithEmptyStrings: UpdateTaskRequest = {
      title: 'Updated Task',
      detail: '', // Empty string should be filtered out
      isComplete: true,
      dueAt: '', // Empty string should be filtered out
    };

    const expectedFilteredTask = {
      title: 'Updated Task',
      isComplete: true,
    };

    const responseTask: Task = {
      id: '123',
      ...expectedFilteredTask,
    };

    vi.mocked(api.put).mockResolvedValueOnce({ data: responseTask });

    // Act
    const updateTask = useUpdateTask();
    await updateTask.mutate({
      taskId: '123',
      taskData: taskWithEmptyStrings,
    });

    // Assert
    expect(api.put).toHaveBeenCalledWith('/tasks/123', expectedFilteredTask);
  });

  it('should update task in the task list cache optimistically', async () => {
    // Arrange
    vi.mocked(api.put).mockResolvedValueOnce({ data: mockUpdatedTask });
    const mockTasksList: Task[] = [
      { ...mockTask },
      {
        id: '456',
        title: 'Another Task',
        detail: 'This is another task',
        isComplete: true,
      },
    ];

    // Mock queryClient to return tasks list
    const queryClient = vi.mocked(reactQuery).useQueryClient();
    vi.mocked(queryClient.getQueryData).mockImplementation((queryKey: readonly unknown[]) => {
      if (queryKey[0] === 'tasks') {
        return mockTasksList;
      }
      return null;
    });

    // Act
    const updateTask = useUpdateTask();
    await updateTask.mutate({
      taskId: '123',
      taskData: updatedTaskData,
    });

    // Assert
    expect(queryClient.setQueryData).toHaveBeenCalledWith(
      ['tasks'],
      expect.arrayContaining([
        expect.objectContaining({
          id: '123',
          title: 'Updated Task',
          detail: 'This is an updated task',
          isComplete: true,
          dueAt: '2025-12-31T23:59:59Z',
        }),
        expect.objectContaining({ id: '456' }),
      ]),
    );
  });

  it('optimistically updates the individual task in the cache', async () => {
    // Arrange
    vi.mocked(api.put).mockResolvedValueOnce({ data: mockUpdatedTask });
    const queryClient = vi.mocked(reactQuery).useQueryClient();

    // Mock the task being in the individual cache
    vi.mocked(queryClient.getQueryData).mockImplementation((queryKey: readonly unknown[]) => {
      if (queryKey[0] === 'task' && queryKey[1] === '123') {
        return mockTask;
      }
      return null;
    });

    // Act
    const updateTask = useUpdateTask();
    await updateTask.mutate({
      taskId: '123',
      taskData: updatedTaskData,
    });

    // Assert
    expect(queryClient.setQueryData).toHaveBeenCalledWith(
      ['task', '123'],
      expect.objectContaining({
        id: '123',
        title: 'Updated Task',
        detail: 'This is an updated task',
        isComplete: true,
        dueAt: '2025-12-31T23:59:59Z',
      }),
    );
  });

  it('cancels outgoing queries before optimistic update', async () => {
    // Arrange
    vi.mocked(api.put).mockResolvedValueOnce({ data: mockUpdatedTask });
    const queryClient = vi.mocked(reactQuery).useQueryClient();

    // Act
    const updateTask = useUpdateTask();
    await updateTask.mutate({
      taskId: '123',
      taskData: updatedTaskData,
    });

    // Assert
    expect(queryClient.cancelQueries).toHaveBeenCalledWith({ queryKey: ['tasks'] });
    expect(queryClient.cancelQueries).toHaveBeenCalledWith({ queryKey: ['task', '123'] });
  });

  it('rolls back optimistic updates when API call fails', async () => {
    // Arrange
    const error = new Error('API Error');
    vi.mocked(api.put).mockRejectedValueOnce(error);
    const queryClient = vi.mocked(reactQuery).useQueryClient();

    const previousTasks: Task[] = [mockTask];
    const previousTask: Task = mockTask;

    // Setup mock data that would be returned from getQueryData
    vi.mocked(queryClient.getQueryData).mockImplementation((queryKey: readonly unknown[]) => {
      if (queryKey[0] === 'tasks') {
        return previousTasks;
      }
      if (queryKey[0] === 'task' && queryKey[1] === '123') {
        return previousTask;
      }
      return null;
    });

    // Mock console.error to avoid polluting test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Act
    const updateTask = useUpdateTask();
    try {
      await updateTask.mutate({
        taskId: '123',
        taskData: updatedTaskData,
      });
    } catch {
      // Expected error, continue with test
    }

    // Assert
    // Should roll back to previous state
    expect(queryClient.setQueryData).toHaveBeenCalledWith(['tasks'], previousTasks);
    expect(queryClient.setQueryData).toHaveBeenCalledWith(['task', '123'], previousTask);
    expect(consoleSpy).toHaveBeenCalled();

    // Cleanup
    consoleSpy.mockRestore();
  });

  it('throws error when API call fails', async () => {
    // Arrange
    const error = new Error('API Error');
    vi.mocked(api.put).mockRejectedValueOnce(error);

    // Act & Assert
    const updateTask = useUpdateTask();
    await expect(
      updateTask.mutate({
        taskId: '123',
        taskData: updatedTaskData,
      }),
    ).rejects.toThrow();
  });

  it('invalidates queries after API call settles', async () => {
    // Arrange
    vi.mocked(api.put).mockResolvedValueOnce({ data: mockUpdatedTask });
    const queryClient = vi.mocked(reactQuery).useQueryClient();

    // Act
    const updateTask = useUpdateTask();
    await updateTask.mutate({
      taskId: '123',
      taskData: updatedTaskData,
    });

    // Assert
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['tasks'] });
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['task', '123'] });
  });

  it('logs error message when API call fails', async () => {
    // Arrange
    const error = new Error('API Error');
    vi.mocked(api.put).mockRejectedValueOnce(error);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Act
    const updateTask = useUpdateTask();
    try {
      await updateTask.mutate({
        taskId: '123',
        taskData: updatedTaskData,
      });
    } catch {
      // Expected error, continue with test
    }

    // Assert
    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Error updating task:', expect.any(Error));

    // Cleanup
    consoleSpy.mockRestore();
  });
});
