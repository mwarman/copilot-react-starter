import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { sortTasks, formatDate, isTaskOverdue } from './taskUtils';
import type { Task } from '../../../common/models/Task';

describe('taskUtils', () => {
  // Mock current date for consistent testing (June 16, 2025)
  const mockDate = new Date(2025, 5, 16);

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('sortTasks', () => {
    it('should sort incomplete tasks with due dates first (earliest first)', () => {
      // Arrange
      const tasks: Task[] = [
        {
          id: '1',
          title: 'Task 1',
          isComplete: false,
          dueAt: '2025-06-20T12:00:00Z', // Later date
        },
        {
          id: '2',
          title: 'Task 2',
          isComplete: false,
          dueAt: '2025-06-15T12:00:00Z', // Earlier date
        },
      ];

      // Act
      const sortedTasks = sortTasks(tasks);

      // Assert
      expect(sortedTasks[0].id).toBe('2'); // Earlier due date should be first
      expect(sortedTasks[1].id).toBe('1');
    });

    it('should place incomplete tasks with due dates before incomplete tasks without due dates', () => {
      // Arrange
      const tasks: Task[] = [
        {
          id: '1',
          title: 'Task without due date',
          isComplete: false,
        },
        {
          id: '2',
          title: 'Task with due date',
          isComplete: false,
          dueAt: '2025-06-15T12:00:00Z',
        },
      ];

      // Act
      const sortedTasks = sortTasks(tasks);

      // Assert
      expect(sortedTasks[0].id).toBe('2'); // Task with due date should be first
      expect(sortedTasks[1].id).toBe('1');
    });

    it('should place all incomplete tasks before complete tasks', () => {
      // Arrange
      const tasks: Task[] = [
        {
          id: '1',
          title: 'Complete task',
          isComplete: true,
        },
        {
          id: '2',
          title: 'Incomplete task',
          isComplete: false,
        },
      ];

      // Act
      const sortedTasks = sortTasks(tasks);

      // Assert
      expect(sortedTasks[0].id).toBe('2'); // Incomplete task should be first
      expect(sortedTasks[1].id).toBe('1');
    });

    it('should handle mixed task states correctly', () => {
      // Arrange
      const tasks: Task[] = [
        {
          id: '1',
          title: 'Complete task',
          isComplete: true,
        },
        {
          id: '2',
          title: 'Incomplete task with later due date',
          isComplete: false,
          dueAt: '2025-06-20T12:00:00Z',
        },
        {
          id: '3',
          title: 'Incomplete task without due date',
          isComplete: false,
        },
        {
          id: '4',
          title: 'Incomplete task with earlier due date',
          isComplete: false,
          dueAt: '2025-06-15T12:00:00Z',
        },
      ];

      // Act
      const sortedTasks = sortTasks(tasks);

      // Assert
      expect(sortedTasks[0].id).toBe('4'); // Incomplete with earliest due date
      expect(sortedTasks[1].id).toBe('2'); // Incomplete with later due date
      expect(sortedTasks[2].id).toBe('3'); // Incomplete without due date
      expect(sortedTasks[3].id).toBe('1'); // Complete task
    });
  });

  describe('formatDate', () => {
    it('should format ISO date string to human-readable format', () => {
      // Arrange
      const dateString = '2025-06-15T12:00:00Z';

      // Act
      const result = formatDate(dateString);

      // Assert
      expect(result).toBe('Jun 15, 2025');
    });

    it('should return default message when date is undefined', () => {
      // Arrange
      const dateString = undefined;

      // Act
      const result = formatDate(dateString);

      // Assert
      expect(result).toBe('No due date');
    });
  });

  describe('isTaskOverdue', () => {
    it('should identify overdue tasks', () => {
      // Arrange
      const task: Task = {
        id: '1',
        title: 'Overdue task',
        isComplete: false,
        dueAt: '2025-06-15T12:00:00Z', // yesterday (since mock date is June 16)
      };

      // Act
      const result = isTaskOverdue(task);

      // Assert
      expect(result).toBe(true);
    });

    it('should not mark future tasks as overdue', () => {
      // Arrange
      const task: Task = {
        id: '1',
        title: 'Future task',
        isComplete: false,
        dueAt: '2025-06-17T12:00:00Z', // tomorrow (since mock date is June 16)
      };

      // Act
      const result = isTaskOverdue(task);

      // Assert
      expect(result).toBe(false);
    });

    it('should not mark completed tasks as overdue even if due date is in past', () => {
      // Arrange
      // Create a date in the past
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1); // yesterday

      const task: Task = {
        id: '1',
        title: 'Completed task',
        isComplete: true,
        dueAt: pastDate.toISOString(),
      };

      // Act
      const result = isTaskOverdue(task);

      // Assert
      expect(result).toBe(false);
    });

    it('should not mark tasks without due dates as overdue', () => {
      // Arrange
      const task: Task = {
        id: '1',
        title: 'Task without due date',
        isComplete: false,
      };

      // Act
      const result = isTaskOverdue(task);

      // Assert
      expect(result).toBe(false);
    });
  });
});
