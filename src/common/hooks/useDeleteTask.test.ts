import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDeleteTask } from './useDeleteTask';
import { api } from '@/common/utils/api';

// Mock API
vi.mock('@/common/utils/api', () => ({
  api: {
    delete: vi.fn().mockResolvedValue({}),
  },
  handleApiError: (error: unknown) => ({
    status: 500,
    message: error instanceof Error ? error.message : 'An unknown error occurred',
  }),
}));

// Mock React Query
vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn().mockImplementation((options) => {
    return {
      mutate: (taskId: string) => options.mutationFn(taskId),
      mutateAsync: (taskId: string) => options.mutationFn(taskId),
      isPending: false,
      isError: false,
      isSuccess: true,
    };
  }),
  useQueryClient: vi.fn().mockReturnValue({
    invalidateQueries: vi.fn(),
    cancelQueries: vi.fn(),
    getQueryData: vi.fn(),
    setQueryData: vi.fn(),
  }),
}));

describe('useDeleteTask', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call the delete endpoint with the correct task id', async () => {
    // Arrange
    const mockDelete = api.delete as unknown as ReturnType<typeof vi.fn>;
    mockDelete.mockResolvedValueOnce({ status: 204 });
    const taskId = 'task-123';
    const { mutate } = useDeleteTask();

    // Act
    await mutate(taskId);

    // Assert
    expect(api.delete).toHaveBeenCalledWith('/tasks/task-123');
  });

  it('should handle API errors appropriately', async () => {
    // Arrange
    const mockDelete = api.delete as unknown as ReturnType<typeof vi.fn>;
    const errorMessage = 'Network error';
    mockDelete.mockRejectedValueOnce(new Error(errorMessage));
    const taskId = 'task-456';
    const { mutateAsync } = useDeleteTask();

    // Act & Assert
    await expect(mutateAsync(taskId)).rejects.toThrow();
    expect(api.delete).toHaveBeenCalledWith('/tasks/task-456');
  });
});
