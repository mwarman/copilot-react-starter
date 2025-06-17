import { useMemo } from 'react';
import type { Task } from '@/common/models/Task';
import type { FilterOptions } from '../components/TaskFilterBar/TaskFilterBar';

/**
 * Hook to filter tasks based on search text and filter options
 * @param tasks - The array of tasks to filter
 * @param filterText - The text to filter by
 * @param filterOptions - Options to filter by completion status and due date
 * @returns An object containing filtered tasks and counts
 */
export const useFilterTasks = (tasks: Task[], filterText: string, filterOptions: FilterOptions) => {
  const filteredTasks = useMemo(() => {
    // First, apply text filtering
    let result = tasks;

    if (filterText.trim()) {
      const normalizedFilter = filterText.toLowerCase().trim();
      result = result.filter((task) => {
        const titleMatch = task.title.toLowerCase().includes(normalizedFilter);
        const detailMatch = task.detail?.toLowerCase().includes(normalizedFilter);
        return titleMatch || detailMatch;
      });
    }

    // Then apply status filters
    const { showComplete, showIncomplete, showOverdue } = filterOptions;

    // If no filters are active, show all tasks
    if (!showComplete && !showIncomplete && !showOverdue) {
      return result;
    }

    // Apply the active filters
    return result.filter((task) => {
      const isOverdue = task.dueAt ? new Date(task.dueAt) < new Date() && !task.isComplete : false;

      if (showComplete && task.isComplete) return true;
      if (showIncomplete && !task.isComplete) return true;
      if (showOverdue && isOverdue) return true;

      return false;
    });
  }, [tasks, filterText, filterOptions]);

  return {
    filteredTasks,
    filteredCount: filteredTasks.length,
    totalCount: tasks.length,
  };
};
