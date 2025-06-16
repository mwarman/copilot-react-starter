import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TaskItem } from './TaskItem';
import type { Task } from '../../../common/models/Task';

describe('TaskItem', () => {
  // Arrange - Mock data setup for all tests
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    detail: 'This is a test task',
    isComplete: false,
    dueAt: '2025-06-20T12:00:00Z',
  };

  const mockOverdueTask: Task = {
    id: '2',
    title: 'Overdue Task',
    detail: 'This task is overdue',
    isComplete: false,
    dueAt: '2024-01-01T12:00:00Z', // Date in the past
  };

  const mockCompletedTask: Task = {
    id: '3',
    title: 'Completed Task',
    detail: 'This task is completed',
    isComplete: true,
    dueAt: '2025-06-20T12:00:00Z',
  };

  it('renders task details correctly', () => {
    // Arrange
    const task = mockTask;

    // Act
    render(<TaskItem task={task} />);

    // Assert
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('This is a test task')).toBeInTheDocument();

    // Check for both mobile and desktop date displays
    const dateElements = screen.getAllByText('Jun 20, 2025');
    expect(dateElements.length).toBe(2); // One for mobile, one for desktop
  });

  it('applies completed styling when task is complete', () => {
    // Arrange
    const task = mockCompletedTask;

    // Act
    render(<TaskItem task={task} />);

    // Assert
    const title = screen.getByText('Completed Task');
    const detail = screen.getByText('This task is completed');

    expect(title).toHaveClass('line-through');
    expect(detail).toHaveClass('line-through');
  });

  it('applies overdue styling when task is overdue', () => {
    // Arrange
    const task = mockOverdueTask;

    // Act
    render(<TaskItem task={task} />);

    // Assert
    const container = screen.getByText('Overdue Task').closest('div[class*="border"]');
    expect(container).toHaveClass('border-amber-500');

    // Check that both mobile and desktop date displays have amber text
    const dateElements = screen.getAllByText('Jan 01, 2024');
    dateElements.forEach((element) => {
      expect(element.closest('[class*="text-amber"]')).not.toBeNull();
    });
  });
});
