import { type Task } from '@/common/models/Task';
import { api, handleApiError } from '@/common/utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Custom hook for toggling the completion status of a task.
 * Uses React Query's useMutation for optimistic updates and API calls.
 */
export const useToggleTaskComplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, isComplete }: { taskId: string; isComplete: boolean }): Promise<Task> => {
      try {
        // Get the current task data from the cache
        const currentTask =
          queryClient.getQueryData<Task[]>(['tasks'])?.find((task) => task.id === taskId) ||
          queryClient.getQueryData<Task>(['task', taskId]);

        // If we have the task in cache, update with all attributes
        // Otherwise, only send the isComplete attribute
        const updateData = currentTask ? { ...currentTask, isComplete } : { isComplete };

        const { data } = await api.put<Task>(`/tasks/${taskId}`, updateData);
        return data;
      } catch (error) {
        const formattedError = handleApiError(error);
        throw new Error(formattedError.message);
      }
    },
    // Optimistically update the UI before the actual API call completes
    onMutate: async ({ taskId, isComplete }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      await queryClient.cancelQueries({ queryKey: ['task', taskId] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      const previousTask = queryClient.getQueryData<Task>(['task', taskId]);

      // Optimistically update the task list if it exists in the cache
      if (previousTasks) {
        queryClient.setQueryData(
          ['tasks'],
          previousTasks.map((task) => (task.id === taskId ? { ...task, isComplete } : task)),
        );
      }

      // Optimistically update the individual task if it exists in the cache
      if (previousTask) {
        queryClient.setQueryData(['task', taskId], {
          ...previousTask,
          isComplete,
        });
      }

      // Return a context object with the previous values
      return { previousTasks, previousTask };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (error, { taskId }, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      if (context?.previousTask) {
        queryClient.setQueryData(['task', taskId], context.previousTask);
      }
      console.error('Error toggling task completion:', error);
    },
    // After success or error, invalidate relevant queries to refetch fresh data
    onSettled: (_, __, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
    },
  });
};

export default useToggleTaskComplete;
