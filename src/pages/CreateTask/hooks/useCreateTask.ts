import { api, handleApiError } from '@/common/utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type CreateTaskRequest, type CreateTaskResponse } from '../schema';
import { type Task } from '@/common/models/Task';

/**
 * Custom hook for creating a new task.
 * Uses React Query's useMutation for API calls and cache updates.
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskData: CreateTaskRequest): Promise<Task> => {
      try {
        // Filter out empty string values for detail and dueAt
        const filteredTaskData: CreateTaskRequest = {
          title: taskData.title,
          ...(taskData.detail && taskData.detail !== '' && { detail: taskData.detail }),
          ...(taskData.dueAt && taskData.dueAt !== '' && { dueAt: taskData.dueAt }),
        };

        const { data } = await api.post<CreateTaskResponse>('/tasks', filteredTaskData);
        return data;
      } catch (error) {
        const formattedError = handleApiError(error);
        throw new Error(formattedError.message);
      }
    },
    onSuccess: () => {
      // Invalidate the tasks query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export default useCreateTask;
