import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/common/utils/api';
import type { Task } from '@/common/models/Task';

interface UpdateTaskParams {
  taskId: string;
  data: Omit<Task, 'id'>;
}

/**
 * Custom hook for updating a task using React Query
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, data }: UpdateTaskParams) => {
      const { data: responseData } = await api.put<Task>(`/tasks/${taskId}`, data);
      return responseData;
    },
    onMutate: async ({ taskId, data }) => {
      // Cancel any outgoing refetches to prevent them from overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ['tasks'], exact: true });
      await queryClient.cancelQueries({ queryKey: ['tasks', taskId] });

      // Snapshot the previous values
      const previousTask = queryClient.getQueryData<Task>(['tasks', taskId]);
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      // Optimistically update the individual task
      queryClient.setQueryData<Task>(['tasks', taskId], (old) => {
        if (!old) return { id: taskId, ...data };
        return { ...old, ...data };
      });

      // Optimistically update the task list
      queryClient.setQueryData<Task[]>(['tasks'], (old) => {
        if (!old) return old;
        return old.map((task) => (task.id === taskId ? { ...task, ...data } : task));
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
