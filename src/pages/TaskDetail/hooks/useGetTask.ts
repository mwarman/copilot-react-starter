import { useQuery } from '@tanstack/react-query';
import { api } from '../../../common/utils/api';
import type { Task } from '../../../common/models/Task';

/**
 * Custom hook for fetching a single task by ID using React Query
 * @param taskId - The ID of the task to fetch
 * @returns Query result containing task data, loading state, and error state
 */
export const useGetTask = (taskId: string) => {
  return useQuery<Task>({
    queryKey: ['tasks', taskId],
    queryFn: async () => {
      const { data } = await api.get<Task>(`/tasks/${taskId}`);
      return data;
    },
    enabled: !!taskId, // Only run query if taskId is provided
  });
};
