import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFilterTasks } from './useFilterTasks';
import type { Task } from '@/common/models/Task';
import type { FilterOptions } from '../components/TaskFilterBar/TaskFilterBar';

describe('useFilterTasks', () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const mockTasks: Task[] = [
    { id: '1', title: 'Complete project', detail: 'Finish the React project by Friday', isComplete: false },
    { id: '2', title: 'Buy groceries', detail: 'Get milk, eggs, and bread', isComplete: true },
    { id: '3', title: 'Call doctor', isComplete: false, dueAt: yesterday.toISOString() },
    {
      id: '4',
      title: 'Plan vacation',
      detail: 'Research destinations',
      isComplete: false,
      dueAt: tomorrow.toISOString(),
    },
  ];

  const defaultFilterOptions: FilterOptions = {
    showComplete: false,
    showIncomplete: false,
    showOverdue: false,
  };

  it('should return all tasks when filter text is empty and no filter options are active', () => {
    // Arrange
    const filterText = '';

    // Act
    const { result } = renderHook(() => useFilterTasks(mockTasks, filterText, defaultFilterOptions));

    // Assert
    expect(result.current.filteredTasks).toEqual(mockTasks);
    expect(result.current.filteredCount).toBe(4);
    expect(result.current.totalCount).toBe(4);
  });

  it('should filter tasks by title match', () => {
    // Arrange
    const filterText = 'project';

    // Act
    const { result } = renderHook(() => useFilterTasks(mockTasks, filterText, defaultFilterOptions));

    // Assert
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].id).toBe('1');
    expect(result.current.filteredCount).toBe(1);
    expect(result.current.totalCount).toBe(4);
  });

  it('should filter tasks by detail match', () => {
    // Arrange
    const filterText = 'milk';

    // Act
    const { result } = renderHook(() => useFilterTasks(mockTasks, filterText, defaultFilterOptions));

    // Assert
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].id).toBe('2');
    expect(result.current.filteredCount).toBe(1);
    expect(result.current.totalCount).toBe(4);
  });

  it('should be case-insensitive when filtering', () => {
    // Arrange
    const filterText = 'PROJECT';

    // Act
    const { result } = renderHook(() => useFilterTasks(mockTasks, filterText, defaultFilterOptions));

    // Assert
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].id).toBe('1');
  });

  it('should handle tasks with null detail field', () => {
    // Arrange
    const filterText = 'doctor';

    // Act
    const { result } = renderHook(() => useFilterTasks(mockTasks, filterText, defaultFilterOptions));

    // Assert
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].id).toBe('3');
  });

  it('should handle whitespace in filter text', () => {
    // Arrange
    const filterText = '  project  ';

    // Act
    const { result } = renderHook(() => useFilterTasks(mockTasks, filterText, defaultFilterOptions));

    // Assert
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].id).toBe('1');
  });

  it('should return no tasks when there are no matches', () => {
    // Arrange
    const filterText = 'nonexistent';

    // Act
    const { result } = renderHook(() => useFilterTasks(mockTasks, filterText, defaultFilterOptions));

    // Assert
    expect(result.current.filteredTasks).toHaveLength(0);
    expect(result.current.filteredCount).toBe(0);
    expect(result.current.totalCount).toBe(4);
  });

  it('should filter by completion status - complete', () => {
    // Arrange
    const filterText = '';
    const filterOptions = { ...defaultFilterOptions, showComplete: true };

    // Act
    const { result } = renderHook(() => useFilterTasks(mockTasks, filterText, filterOptions));

    // Assert
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].id).toBe('2');
  });

  it('should filter by completion status - incomplete', () => {
    // Arrange
    const filterText = '';
    const filterOptions = { ...defaultFilterOptions, showIncomplete: true };

    // Act
    const { result } = renderHook(() => useFilterTasks(mockTasks, filterText, filterOptions));

    // Assert
    expect(result.current.filteredTasks).toHaveLength(3);
    expect(result.current.filteredTasks.every((task) => !task.isComplete)).toBe(true);
  });

  it('should filter by overdue status', () => {
    // Arrange
    const filterText = '';
    const filterOptions = { ...defaultFilterOptions, showOverdue: true };

    // Act
    const { result } = renderHook(() => useFilterTasks(mockTasks, filterText, filterOptions));

    // Assert
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].id).toBe('3');
  });

  it('should combine multiple filters correctly', () => {
    // Arrange
    const filterText = '';
    const filterOptions = {
      showComplete: true,
      showOverdue: true,
      showIncomplete: false,
    };

    // Act
    const { result } = renderHook(() => useFilterTasks(mockTasks, filterText, filterOptions));

    // Assert
    expect(result.current.filteredTasks).toHaveLength(2);
    expect(result.current.filteredTasks.some((task) => task.id === '2')).toBe(true);
    expect(result.current.filteredTasks.some((task) => task.id === '3')).toBe(true);
  });

  it('should apply text filtering and status filtering together', () => {
    // Arrange
    const filterText = 'project';
    const filterOptions = { ...defaultFilterOptions, showIncomplete: true };

    // Act
    const { result } = renderHook(() => useFilterTasks(mockTasks, filterText, filterOptions));

    // Assert
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].id).toBe('1');
  });
});
