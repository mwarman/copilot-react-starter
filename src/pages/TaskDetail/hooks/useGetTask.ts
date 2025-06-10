import { useQuery } from '@tanstack/react-query';
import { api, handleApiError } from '@/common/utils/api';
import { type Task } from '@/common/models/Task';

/**
 * Custom hook to fetch a single task by ID.
 * Uses React Query for data fetching and caching.
 *
 * @param taskId - The ID of the task to fetch
 * @returns React Query result with the task data and status indicators
 */
export const useGetTask = (taskId: string) => {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: async (): Promise<Task> => {
      try {
        const response = await api.get<Task>(`/tasks/${taskId}`);
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    enabled: !!taskId, // Only run the query if we have a taskId
  });
};

export default useGetTask;
