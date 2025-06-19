import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../common/utils/api';
import type { Task } from '../../../common/models/Task';

interface ToggleTaskCompleteParams {
  taskId: string;
  isComplete: boolean;
}

/**
 * Custom hook for toggling task completion status using React Query
 * Provides optimistic updates for immediate UI feedback
 * @returns Mutation object with methods and state for toggling task completion
 */
export const useToggleTaskComplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, isComplete }: ToggleTaskCompleteParams) => {
      // Try to get the current task data from the cache (individual task first, then from task list)
      let currentTask = queryClient.getQueryData<Task>(['tasks', taskId]);

      if (!currentTask) {
        // If individual task is not cached, try to find it in the task list
        const taskList = queryClient.getQueryData<Task[]>(['tasks']);
        currentTask = taskList?.find((task) => task.id === taskId);
      }

      if (!currentTask) {
        throw new Error(`Task with ID ${taskId} not found in cache`);
      }

      // Send all task attributes with the updated isComplete status
      const updatedTaskData = {
        ...currentTask,
        isComplete,
      };

      const { data } = await api.put<Task>(`/tasks/${taskId}`, updatedTaskData);
      return data;
    },
    onMutate: async ({ taskId, isComplete }) => {
      // Cancel any outgoing refetches to prevent them from overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ['tasks'], exact: true });
      await queryClient.cancelQueries({ queryKey: ['tasks', taskId] });

      // Snapshot the previous values
      const previousTask = queryClient.getQueryData<Task>(['tasks', taskId]);
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      // Optimistically update the individual task
      queryClient.setQueryData<Task>(['tasks', taskId], (old) => {
        if (!old) return old;
        return {
          ...old,
          isComplete,
        };
      });

      // Optimistically update the task list
      queryClient.setQueryData<Task[]>(['tasks'], (old) => {
        if (!old) return old;
        return old.map((task) => (task.id === taskId ? { ...task, isComplete } : task));
      });

      // Return context with previous values for potential rollback
      return { previousTask, previousTasks };
    },
    onError: (_err, variables, context) => {
      // Rollback optimistic updates on error
      if (context?.previousTask) {
        queryClient.setQueryData(['tasks', variables.taskId], context.previousTask);
      }
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: (_data, _error, variables) => {
      // Always refetch after success or error to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ['tasks'], exact: true });
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.taskId] });
    },
  });
};
