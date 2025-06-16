import { useQuery } from '@tanstack/react-query';
import { api } from '../../../common/utils/api';
import type { Task } from '../../../common/models/Task';

/**
 * Custom hook for fetching tasks using React Query
 * @returns Query result containing tasks data, loading state, and error state
 */
export const useGetTasks = () => {
  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data } = await api.get<Task[]>('/tasks');
      return data;
    },
  });
};
