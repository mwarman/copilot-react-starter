import { useState, useMemo } from 'react';
import { type Task } from '@/common/models/Task';
import { useDebounce } from '@/common/hooks/useDebounce';

/**
 * Filter states for task completion and due date
 */
export interface TaskFilters {
  showComplete: boolean;
  showIncomplete: boolean;
  showOverdue: boolean;
}

/**
 * Custom hook for filtering tasks based on a search term and filter buttons.
 * Uses debouncing to prevent excessive filtering during rapid typing.
 *
 * @param tasks The array of tasks to filter
 * @param debounceDelay Optional delay for debouncing in milliseconds (default: 300ms)
 * @returns An object containing the filtered tasks, filter states, and setter functions
 */
export const useFilterTasks = (tasks: Task[], debounceDelay = 300) => {
  const [filterText, setFilterText] = useState('');
  const [filters, setFilters] = useState<TaskFilters>({
    showComplete: false,
    showIncomplete: false,
    showOverdue: false,
  });
  const debouncedFilterText = useDebounce(filterText, debounceDelay);

  // Toggle a specific filter
  const toggleFilter = (filterName: keyof TaskFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: !prevFilters[filterName],
    }));
  };

  // Calculate filtered tasks based on the debounced filter text and active filters
  const filteredTasks = useMemo(() => {
    // First, apply text search filter
    let filtered = tasks;

    if (debouncedFilterText.trim()) {
      const searchTerm = debouncedFilterText.trim().toLowerCase();
      filtered = filtered.filter((task) => {
        const matchesTitle = task.title.toLowerCase().includes(searchTerm);
        const matchesDetail = task.detail?.toLowerCase().includes(searchTerm) || false;
        return matchesTitle || matchesDetail;
      });
    }

    // No additional filtering if no filter buttons are active
    const { showComplete, showIncomplete, showOverdue } = filters;
    if (!showComplete && !showIncomplete && !showOverdue) {
      return filtered;
    }

    // Apply active filters
    return filtered.filter((task) => {
      const isTaskComplete = task.isComplete;
      const isTaskOverdue = !isTaskComplete && task.dueAt && new Date(task.dueAt) < new Date();

      if (showComplete && isTaskComplete) return true;
      if (showIncomplete && !isTaskComplete) return true;
      if (showOverdue && isTaskOverdue) return true;

      return false;
    });
  }, [tasks, debouncedFilterText, filters]);

  // Return all necessary state and counts
  return {
    filteredTasks,
    filterText,
    setFilterText,
    filters,
    toggleFilter,
    filteredCount: filteredTasks.length,
    totalCount: tasks.length,
  };
};

export default useFilterTasks;
