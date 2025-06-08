import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useFilterTasks } from './useFilterTasks';
import { type Task } from '@/common/models/Task';

// Mock the useDebounce hook
vi.mock('@/common/hooks/useDebounce', () => ({
  useDebounce: (value: string) => value, // Return immediately without debouncing for tests
}));

describe('useFilterTasks', () => {
  // Sample tasks for testing
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Learn React',
      detail: 'Study hooks and context',
      isComplete: false,
    },
    {
      id: '2',
      title: 'Build a website',
      detail: 'Create a portfolio site',
      isComplete: false,
      dueAt: '2025-06-01T00:00:00Z', // Past due date (current date is June 8, 2025)
    },
    {
      id: '3',
      title: 'Master TypeScript',
      detail: 'Learn advanced types',
      isComplete: true,
    },
    {
      id: '4',
      title: 'Fix bugs',
      detail: 'React component issues',
      isComplete: false,
    },
    {
      id: '5',
      title: 'Deploy app',
      detail: 'Deploy to production',
      isComplete: false,
      dueAt: '2025-07-01T00:00:00Z', // Future due date
    },
  ];

  it('should return all tasks when filter text is empty', () => {
    // Arrange & Act
    const { result } = renderHook(() => useFilterTasks(mockTasks));

    // Assert
    expect(result.current.filteredTasks).toEqual(mockTasks);
    expect(result.current.filteredCount).toBe(5);
    expect(result.current.totalCount).toBe(5);
  });

  it('should filter tasks by title', () => {
    // Arrange
    const { result } = renderHook(() => useFilterTasks(mockTasks));

    // Act
    act(() => {
      result.current.setFilterText('react');
    });

    // Assert
    expect(result.current.filteredTasks).toHaveLength(2);
    expect(result.current.filteredTasks[0].id).toBe('1'); // "Learn React"
    expect(result.current.filteredTasks[1].id).toBe('4'); // "Fix bugs" (has "React" in detail)
    expect(result.current.filteredCount).toBe(2);
    expect(result.current.totalCount).toBe(5);
  });

  it('should filter tasks by detail', () => {
    // Arrange
    const { result } = renderHook(() => useFilterTasks(mockTasks));

    // Act
    act(() => {
      result.current.setFilterText('portfolio');
    });

    // Assert
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].id).toBe('2'); // Has "portfolio" in detail
  });

  it('should perform case-insensitive filtering', () => {
    // Arrange
    const { result } = renderHook(() => useFilterTasks(mockTasks));

    // Act
    act(() => {
      result.current.setFilterText('TYPESCRIPT');
    });

    // Assert
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].id).toBe('3'); // "Master TypeScript"
  });

  it('should return empty array when no matches found', () => {
    // Arrange
    const { result } = renderHook(() => useFilterTasks(mockTasks));

    // Act
    act(() => {
      result.current.setFilterText('nonexistent');
    });

    // Assert
    expect(result.current.filteredTasks).toHaveLength(0);
    expect(result.current.filteredCount).toBe(0);
    expect(result.current.totalCount).toBe(5);
  });

  it('should trim whitespace from filter text', () => {
    // Arrange
    const { result } = renderHook(() => useFilterTasks(mockTasks));

    // Act
    act(() => {
      result.current.setFilterText('  react  ');
    });

    // Assert
    expect(result.current.filteredTasks).toHaveLength(2);
  });

  it('should filter completed tasks when showComplete filter is active', () => {
    // Arrange
    const { result } = renderHook(() => useFilterTasks(mockTasks));

    // Act
    act(() => {
      result.current.toggleFilter('showComplete');
    });

    // Assert
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].id).toBe('3'); // "Master TypeScript" (isComplete: true)
    expect(result.current.filters.showComplete).toBe(true);
  });

  it('should filter incomplete tasks when showIncomplete filter is active', () => {
    // Arrange
    const { result } = renderHook(() => useFilterTasks(mockTasks));

    // Act
    act(() => {
      result.current.toggleFilter('showIncomplete');
    });

    // Assert
    expect(result.current.filteredTasks).toHaveLength(4);
    expect(result.current.filteredTasks.every((task) => !task.isComplete)).toBe(true);
    expect(result.current.filters.showIncomplete).toBe(true);
  });

  it('should filter overdue tasks when showOverdue filter is active', () => {
    // Arrange
    const { result } = renderHook(() => useFilterTasks(mockTasks));

    // Act
    act(() => {
      result.current.toggleFilter('showOverdue');
    });

    // Assert
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].id).toBe('2'); // Past due date & not complete
    expect(result.current.filters.showOverdue).toBe(true);
  });

  it('should combine multiple active filters with OR logic', () => {
    // Arrange
    const { result } = renderHook(() => useFilterTasks(mockTasks));

    // Act - filter for completed OR overdue tasks
    act(() => {
      result.current.toggleFilter('showComplete');
      result.current.toggleFilter('showOverdue');
    });

    // Assert
    expect(result.current.filteredTasks).toHaveLength(2);
    expect(result.current.filteredTasks.some((task) => task.id === '2')).toBe(true); // overdue
    expect(result.current.filteredTasks.some((task) => task.id === '3')).toBe(true); // completed
  });

  it('should combine text search with filter buttons', () => {
    // Arrange
    const { result } = renderHook(() => useFilterTasks(mockTasks));

    // Act - search for "build" and filter for overdue tasks
    act(() => {
      result.current.setFilterText('build');
      result.current.toggleFilter('showOverdue');
    });

    // Assert
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].id).toBe('2'); // "Build a website" and overdue
  });

  it('should reset a filter when toggled twice', () => {
    // Arrange
    const { result } = renderHook(() => useFilterTasks(mockTasks));

    // Act - toggle on then off
    act(() => {
      result.current.toggleFilter('showComplete');
      result.current.toggleFilter('showComplete');
    });

    // Assert
    expect(result.current.filters.showComplete).toBe(false);
    expect(result.current.filteredTasks).toHaveLength(5); // All tasks
  });
});
