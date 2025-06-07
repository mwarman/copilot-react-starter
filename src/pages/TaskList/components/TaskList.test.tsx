import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskList } from './TaskList';
import { type Task } from '@/common/models/Task';

// Mock the TaskItem component
vi.mock('./TaskItem', () => ({
  TaskItem: ({ task }: { task: Task }) => <div data-testid={`task-item-${task.id}`}>{task.title}</div>,
}));

describe('TaskList', () => {
  it('renders a list of tasks', () => {
    // Arrange
    const tasks: Task[] = [
      { id: '1', title: 'Task 1', isComplete: false },
      { id: '2', title: 'Task 2', isComplete: true },
    ];

    // Act
    render(<TaskList tasks={tasks} />);

    // Assert
    expect(screen.getByTestId('task-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('task-item-2')).toBeInTheDocument();
  });

  it('sorts tasks by due date (earliest first)', () => {
    // Arrange
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const tasks: Task[] = [
      { id: '1', title: 'No due date', isComplete: false },
      { id: '2', title: 'Tomorrow', isComplete: false, dueAt: tomorrow.toISOString() },
      { id: '3', title: 'Yesterday', isComplete: false, dueAt: yesterday.toISOString() },
    ];

    // Act
    const { container } = render(<TaskList tasks={tasks} />);
    const renderedTasks = container.querySelectorAll('[data-testid^="task-item-"]');

    // Assert
    // Tasks should be ordered: Yesterday, Tomorrow, No due date
    expect(renderedTasks[0]).toHaveTextContent('Yesterday');
    expect(renderedTasks[1]).toHaveTextContent('Tomorrow');
    expect(renderedTasks[2]).toHaveTextContent('No due date');
  });

  it('handles empty tasks array', () => {
    // Arrange & Act
    const { container } = render(<TaskList tasks={[]} />);

    // Assert
    expect(container.querySelectorAll('[data-testid^="task-item-"]').length).toBe(0);
  });

  it('handles invalid dates correctly', () => {
    // Arrange
    const tasks: Task[] = [
      { id: '1', title: 'Valid date', isComplete: false, dueAt: new Date().toISOString() },
      { id: '2', title: 'Invalid date', isComplete: false, dueAt: 'not-a-date' },
    ];

    // Act
    render(<TaskList tasks={tasks} />);

    // Assert - the component should not crash with invalid dates
    expect(screen.getByTestId('task-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('task-item-2')).toBeInTheDocument();
  });
});
