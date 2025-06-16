import type { Task } from '../../../common/models/Task';
import { format, isBefore, parseISO, startOfDay } from 'date-fns';

/**
 * Sorts tasks according to the application requirements:
 * 1. Incomplete tasks with due dates (earliest first)
 * 2. Incomplete tasks without due dates
 * 3. Completed tasks
 *
 * @param tasks Array of tasks to sort
 * @returns Sorted array of tasks
 */
export const sortTasks = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    // First, sort by completion status
    if (a.isComplete !== b.isComplete) {
      return a.isComplete ? 1 : -1;
    }

    // If both are incomplete, sort by due date
    if (!a.isComplete && !b.isComplete) {
      // If only one has a due date, the one with due date comes first
      if (a.dueAt && !b.dueAt) return -1;
      if (!a.dueAt && b.dueAt) return 1;

      // If both have due dates, sort by earliest first
      if (a.dueAt && b.dueAt) {
        return parseISO(a.dueAt).getTime() - parseISO(b.dueAt).getTime();
      }
    }

    // Default case: maintain original order
    return 0;
  });
};

/**
 * Formats a date string to a human-readable format (e.g., "Jun 01, 2025")
 *
 * @param dateString ISO 8601 date string
 * @returns Formatted date string
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'No due date';

  return format(parseISO(dateString), 'MMM dd, yyyy');
};

/**
 * Checks if a task is overdue (due date is in the past)
 *
 * @param task The task to check
 * @returns True if the task is overdue, false otherwise
 */
export const isTaskOverdue = (task: Task): boolean => {
  if (!task.dueAt || task.isComplete) return false;

  const dueDate = startOfDay(parseISO(task.dueAt));
  const today = startOfDay(new Date());

  return isBefore(dueDate, today);
};
