import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/common/utils/api';
import type { Task } from '@/common/models/Task';

export interface DeleteTaskParams {
  taskId: string;
}

/**
 * Custom hook for deleting a task using React Query mutations
 * Handles optimistic updates and cache invalidation
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId }: DeleteTaskParams) => {
      await api.delete(`/tasks/${taskId}`);
    },
    onSuccess: (_, { taskId }) => {
      // Remove task from the tasks list cache
      queryClient.setQueryData(['tasks'], (oldData: Task[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.filter((task: Task) => task.id !== taskId);
      });

      // Invalidate and refetch tasks to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ['tasks'], exact: true });

      // Remove the individual task from cache
      queryClient.removeQueries({ queryKey: ['tasks', taskId] });
    },
    onError: (error) => {
      // Error handling is managed by the consuming components
      console.error('Failed to delete task:', error);
    },
  });
};
