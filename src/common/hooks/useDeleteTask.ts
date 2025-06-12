import { api, handleApiError } from '@/common/utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type Task } from '@/common/models/Task';

/**
 * Custom hook for deleting a task.
 * Uses React Query's useMutation for optimistic updates and API calls.
 *
 * Features:
 * - Optimistically removes task from cache before API call completes
 * - Rolls back changes if the API call fails
 * - Provides isPending status for loading indicators
 * - Handles API errors with proper formatting
 * - Invalidates tasks query cache after successful deletion
 *
 * @returns A mutation object with methods like mutate() and mutateAsync()
 *
 * @example
 * const deleteTask = useDeleteTask();
 *
 * // Using mutate (fire and forget)
 * deleteTask.mutate('task-123');
 *
 * // Using mutateAsync (with await)
 * try {
 *   await deleteTask.mutateAsync('task-123');
 *   // Handle success
 * } catch (error) {
 *   // Handle error
 * }
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string): Promise<void> => {
      try {
        await api.delete(`/tasks/${taskId}`);
      } catch (error) {
        const formattedError = handleApiError(error);
        throw new Error(formattedError.message);
      }
    },
    // Optimistically update the UI before the actual API call completes
    onMutate: async (taskId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      await queryClient.cancelQueries({ queryKey: ['task', taskId] });

      // Snapshot the previous values
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      const previousTask = queryClient.getQueryData<Task>(['task', taskId]);

      // Optimistically update the task list if it exists in the cache
      if (previousTasks) {
        queryClient.setQueryData(
          ['tasks'],
          previousTasks.filter((task) => task.id !== taskId),
        );
      }

      // Return a context object with the previous values
      return { previousTasks, previousTask };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (error, taskId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      if (context?.previousTask) {
        queryClient.setQueryData(['task', taskId], context.previousTask);
      }
      console.error('Error deleting task:', error);
    },
    // After success or error, invalidate relevant queries to refetch fresh data
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export default useDeleteTask;
