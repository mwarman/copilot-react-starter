import { useState, useMemo } from 'react';
import { type Task } from '@/common/models/Task';
import { useDebounce } from '@/common/hooks/useDebounce';

/**
 * Custom hook for filtering tasks based on a search term.
 * Uses debouncing to prevent excessive filtering during rapid typing.
 *
 * @param tasks The array of tasks to filter
 * @param debounceDelay Optional delay for debouncing in milliseconds (default: 300ms)
 * @returns An object containing the filtered tasks, filter text, setFilterText function,
 *          and counts for filtered and total items
 */
export const useFilterTasks = (tasks: Task[], debounceDelay = 300) => {
  const [filterText, setFilterText] = useState('');
  const debouncedFilterText = useDebounce(filterText, debounceDelay);

  // Calculate filtered tasks based on the debounced filter text
  const filteredTasks = useMemo(() => {
    if (!debouncedFilterText.trim()) {
      return tasks;
    }

    const searchTerm = debouncedFilterText.trim().toLowerCase();
    return tasks.filter((task) => {
      // Check if the search term appears in the task title or detail
      const matchesTitle = task.title.toLowerCase().includes(searchTerm);
      const matchesDetail = task.detail?.toLowerCase().includes(searchTerm) || false;

      return matchesTitle || matchesDetail;
    });
  }, [tasks, debouncedFilterText]);

  // Return all necessary state and counts
  return {
    filteredTasks,
    filterText,
    setFilterText,
    filteredCount: filteredTasks.length,
    totalCount: tasks.length,
  };
};

export default useFilterTasks;
