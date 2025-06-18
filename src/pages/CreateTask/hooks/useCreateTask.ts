import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '@/common/utils/api';
import type { Task } from '@/common/models/Task';

/**
 * Custom hook for creating a new task using React Query
 * @returns Mutation object for creating a task
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (taskData: Omit<Task, 'id'>) => {
      const { data } = await api.post<Task>('/tasks', taskData);
      return data;
    },
    onSuccess: () => {
      // Invalidate the tasks list to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      // Redirect back to task list
      navigate('/tasks');
    },
  });
};
