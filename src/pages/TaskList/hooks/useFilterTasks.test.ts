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
    { id: '1', title: 'Learn React', detail: 'Study hooks and context', isComplete: false },
    { id: '2', title: 'Build a website', detail: 'Create a portfolio site', isComplete: false },
    { id: '3', title: 'Master TypeScript', detail: 'Learn advanced types', isComplete: true },
    { id: '4', title: 'Fix bugs', detail: 'React component issues', isComplete: false },
  ];

  it('should return all tasks when filter text is empty', () => {
    // Arrange & Act
    const { result } = renderHook(() => useFilterTasks(mockTasks));

    // Assert
    expect(result.current.filteredTasks).toEqual(mockTasks);
    expect(result.current.filteredCount).toBe(4);
    expect(result.current.totalCount).toBe(4);
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
    expect(result.current.totalCount).toBe(4);
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
    expect(result.current.totalCount).toBe(4);
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
});
