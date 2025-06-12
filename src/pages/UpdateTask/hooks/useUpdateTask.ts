import { api, handleApiError } from '@/common/utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type UpdateTaskRequest, type UpdateTaskResponse } from '../schema';
import { type Task } from '@/common/models/Task';

/**
 * Custom hook for updating an existing task.
 * Uses React Query's useMutation for API calls and optimistic updates.
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, taskData }: { taskId: string; taskData: UpdateTaskRequest }): Promise<Task> => {
      try {
        // Filter out empty string values for detail and dueAt
        const filteredTaskData: UpdateTaskRequest = {
          title: taskData.title,
          isComplete: taskData.isComplete,
          ...(taskData.detail && taskData.detail !== '' && { detail: taskData.detail }),
          ...(taskData.dueAt && taskData.dueAt !== '' && { dueAt: taskData.dueAt }),
        };

        const { data } = await api.put<UpdateTaskResponse>(`/tasks/${taskId}`, filteredTaskData);
        return data;
      } catch (error) {
        const formattedError = handleApiError(error);
        throw new Error(formattedError.message);
      }
    },
    // Optimistically update the UI before the actual API call completes
    onMutate: async ({ taskId, taskData }: { taskId: string; taskData: UpdateTaskRequest }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      await queryClient.cancelQueries({ queryKey: ['task', taskId] });

      // Snapshot the previous values
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      const previousTask = queryClient.getQueryData<Task>(['task', taskId]);

      // Filter out empty string values for detail and dueAt
      const filteredTaskData = {
        title: taskData.title,
        isComplete: taskData.isComplete,
        ...(taskData.detail && taskData.detail !== '' && { detail: taskData.detail }),
        ...(taskData.dueAt && taskData.dueAt !== '' && { dueAt: taskData.dueAt }),
      };

      // Optimistically update the task list if it exists in the cache
      if (previousTasks) {
        queryClient.setQueryData(
          ['tasks'],
          previousTasks.map((task) => (task.id === taskId ? { ...task, ...filteredTaskData } : task)),
        );
      }

      // Optimistically update the individual task if it exists in the cache
      if (previousTask) {
        queryClient.setQueryData(['task', taskId], {
          ...previousTask,
          ...filteredTaskData,
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
      console.error('Error updating task:', error);
    },
    // After success or error, invalidate relevant queries to refetch fresh data
    onSettled: (_, __, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
    },
  });
};

export default useUpdateTask;
