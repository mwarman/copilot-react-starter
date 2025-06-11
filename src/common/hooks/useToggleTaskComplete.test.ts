import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useToggleTaskComplete } from './useToggleTaskComplete';
import { api } from '@/common/utils/api';
import { type Task } from '@/common/models/Task';
import * as reactQuery from '@tanstack/react-query';

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

describe('useToggleTaskComplete', () => {
  // Define mock tasks for testing
  const mockTask: Task = {
    id: '123',
    title: 'Test Task',
    detail: 'This is a test task',
    isComplete: false,
  };

  const mockUpdatedTask: Task = {
    ...mockTask,
    isComplete: true,
  };

  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls API with correct parameters when task is in individual cache', async () => {
    // Arrange
    vi.mocked(api.put).mockResolvedValueOnce({ data: mockUpdatedTask });

    // Act
    const toggleComplete = useToggleTaskComplete();
    await toggleComplete.mutate({ taskId: '123', isComplete: true });

    // Assert
    expect(api.put).toHaveBeenCalledWith('/tasks/123', {
      id: '123',
      title: 'Test Task',
      detail: 'This is a test task',
      isComplete: true,
    });
  });

  it('should update task in the task list cache', async () => {
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
    const toggleComplete = useToggleTaskComplete();
    await toggleComplete.mutate({ taskId: '123', isComplete: true });

    // Assert
    expect(queryClient.setQueryData).toHaveBeenCalledWith(
      ['tasks'],
      expect.arrayContaining([
        expect.objectContaining({ id: '123', isComplete: true }),
        expect.objectContaining({ id: '456' }),
      ]),
    );
  });

  it('should send only isComplete when task is not in cache', async () => {
    // Arrange
    vi.mocked(api.put).mockResolvedValueOnce({ data: mockUpdatedTask });
    const queryClient = vi.mocked(reactQuery).useQueryClient();
    vi.mocked(queryClient.getQueryData).mockReturnValue(null);

    // Act
    const toggleComplete = useToggleTaskComplete();
    await toggleComplete.mutate({ taskId: '123', isComplete: true });

    // Assert
    expect(api.put).toHaveBeenCalledWith('/tasks/123', {
      isComplete: true,
    });
  });

  it('optimistically updates the UI before API call completes', async () => {
    // Arrange
    vi.mocked(api.put).mockResolvedValueOnce({ data: mockUpdatedTask });
    const queryClient = vi.mocked(reactQuery).useQueryClient();

    // Mock the task being in both caches to ensure setQueryData is called
    const mockTasksList: Task[] = [mockTask];
    vi.mocked(queryClient.getQueryData).mockImplementation((queryKey: readonly unknown[]) => {
      if (queryKey[0] === 'tasks') {
        return mockTasksList;
      }
      if (queryKey[0] === 'task' && queryKey[1] === '123') {
        return mockTask;
      }
      return null;
    });

    // Act
    const toggleComplete = useToggleTaskComplete();
    await toggleComplete.mutate({ taskId: '123', isComplete: true });

    // Assert
    expect(queryClient.cancelQueries).toHaveBeenCalledWith({ queryKey: ['tasks'] });
    expect(queryClient.cancelQueries).toHaveBeenCalledWith({ queryKey: ['task', '123'] });
    expect(queryClient.setQueryData).toHaveBeenCalled();
  });

  it('rolls back optimistic updates when API call fails', async () => {
    // Arrange
    const error = new Error('API Error');
    vi.mocked(api.put).mockRejectedValueOnce(error);
    const queryClient = vi.mocked(reactQuery).useQueryClient();
    const previousTasks: Task[] = [mockTask];
    const previousTask: Task = mockTask;

    // Setup context that would be returned from onMutate
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
    const toggleComplete = useToggleTaskComplete();
    try {
      await toggleComplete.mutate({ taskId: '123', isComplete: true });
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
    const toggleComplete = useToggleTaskComplete();
    await expect(toggleComplete.mutate({ taskId: '123', isComplete: true })).rejects.toThrow();
  });

  it('invalidates queries after API call settles', async () => {
    // Arrange
    vi.mocked(api.put).mockResolvedValueOnce({ data: mockUpdatedTask });
    const queryClient = vi.mocked(reactQuery).useQueryClient();

    // Act
    const toggleComplete = useToggleTaskComplete();
    await toggleComplete.mutate({ taskId: '123', isComplete: true });

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
    const toggleComplete = useToggleTaskComplete();
    try {
      await toggleComplete.mutate({ taskId: '123', isComplete: true });
    } catch {
      // Expected error, continue with test
    }

    // Assert
    expect(consoleSpy).toHaveBeenCalled();

    // Cleanup
    consoleSpy.mockRestore();
  });
});
