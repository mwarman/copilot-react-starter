import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFilterTasks } from './useFilterTasks';
import type { Task } from '@/common/models/Task';

describe('useFilterTasks', () => {
  const mockTasks: Task[] = [
    { id: '1', title: 'Complete project', detail: 'Finish the React project by Friday', isComplete: false },
    { id: '2', title: 'Buy groceries', detail: 'Get milk, eggs, and bread', isComplete: true },
    { id: '3', title: 'Call doctor', isComplete: false },
  ];

  it('should return all tasks when filter text is empty', () => {
    // Arrange
    const filterText = '';

    // Act
    const { result } = renderHook(() => useFilterTasks(mockTasks, filterText));

    // Assert
    expect(result.current.filteredTasks).toEqual(mockTasks);
    expect(result.current.filteredCount).toBe(3);
    expect(result.current.totalCount).toBe(3);
  });

  it('should filter tasks by title match', () => {
    // Arrange
    const filterText = 'project';

    // Act
    const { result } = renderHook(() => useFilterTasks(mockTasks, filterText));

    // Assert
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].id).toBe('1');
    expect(result.current.filteredCount).toBe(1);
    expect(result.current.totalCount).toBe(3);
  });

  it('should filter tasks by detail match', () => {
    // Arrange
    const filterText = 'milk';

    // Act
    const { result } = renderHook(() => useFilterTasks(mockTasks, filterText));

    // Assert
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].id).toBe('2');
    expect(result.current.filteredCount).toBe(1);
    expect(result.current.totalCount).toBe(3);
  });

  it('should be case-insensitive when filtering', () => {
    // Arrange
    const filterText = 'PROJECT';

    // Act
    const { result } = renderHook(() => useFilterTasks(mockTasks, filterText));

    // Assert
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].id).toBe('1');
  });

  it('should handle tasks with null detail field', () => {
    // Arrange
    const filterText = 'doctor';

    // Act
    const { result } = renderHook(() => useFilterTasks(mockTasks, filterText));

    // Assert
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].id).toBe('3');
  });

  it('should handle whitespace in filter text', () => {
    // Arrange
    const filterText = '  project  ';

    // Act
    const { result } = renderHook(() => useFilterTasks(mockTasks, filterText));

    // Assert
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].id).toBe('1');
  });

  it('should return no tasks when there are no matches', () => {
    // Arrange
    const filterText = 'nonexistent';

    // Act
    const { result } = renderHook(() => useFilterTasks(mockTasks, filterText));

    // Assert
    expect(result.current.filteredTasks).toHaveLength(0);
    expect(result.current.filteredCount).toBe(0);
    expect(result.current.totalCount).toBe(3);
  });
});
