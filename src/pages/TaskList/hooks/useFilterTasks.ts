import { useMemo } from 'react';
import type { Task } from '@/common/models/Task';

/**
 * Hook to filter tasks based on search text
 * @param tasks - The array of tasks to filter
 * @param filterText - The text to filter by
 * @returns An object containing filtered tasks and counts
 */
export const useFilterTasks = (tasks: Task[], filterText: string) => {
  const filteredTasks = useMemo(() => {
    if (!filterText.trim()) {
      return tasks;
    }

    const normalizedFilter = filterText.toLowerCase().trim();

    return tasks.filter((task) => {
      const titleMatch = task.title.toLowerCase().includes(normalizedFilter);
      const detailMatch = task.detail?.toLowerCase().includes(normalizedFilter);

      return titleMatch || detailMatch;
    });
  }, [tasks, filterText]);

  return {
    filteredTasks,
    filteredCount: filteredTasks.length,
    totalCount: tasks.length,
  };
};
