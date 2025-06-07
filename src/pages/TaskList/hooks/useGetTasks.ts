import { type Task } from '@/common/models/Task';
import { api, handleApiError } from '@/common/utils/api';
import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook for fetching tasks from the API.
 * Uses React Query for data fetching and caching.
 */
export const useGetTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async (): Promise<Task[]> => {
      try {
        const { data } = await api.get<Task[]>('/tasks');
        return data;
      } catch (error) {
        const formattedError = handleApiError(error);
        throw new Error(formattedError.message);
      }
    },
  });
};

export default useGetTasks;
