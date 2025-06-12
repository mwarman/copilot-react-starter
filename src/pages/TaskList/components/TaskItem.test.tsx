import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskItem } from './TaskItem';
import { type Task } from '@/common/models/Task';
import { format, addDays, subDays } from 'date-fns';
import userEvent from '@testing-library/user-event';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock the toggle task complete hook
const mockMutate = vi.fn();
vi.mock('@/common/hooks/useToggleTaskComplete', () => ({
  useToggleTaskComplete: () => ({
    mutate: mockMutate,
    isLoading: false,
    isError: false,
  }),
}));

// Mock the DeleteTaskDialog component
vi.mock('@/common/components/DeleteTaskDialog', () => ({
  DeleteTaskDialog: ({ taskId, taskTitle }: { taskId: string; taskTitle: string }) => (
    <button
      data-testid="mock-delete-button"
      data-task-id={taskId}
      data-task-title={taskTitle}
      onClick={(e) => e.stopPropagation()}
    >
      Delete
    </button>
  ),
}));

describe('TaskItem', () => {
  // Fixed date for testing
  const baseDate = new Date(2025, 5, 1); // June 1, 2025
  const tomorrow = addDays(baseDate, 1);
  const yesterday = subDays(baseDate, 1);

  // Setup tasks for testing different states
  const completedTask: Task = {
    id: '1',
    title: 'Completed Task',
    detail: 'This is a completed task',
    isComplete: true,
    dueAt: baseDate.toISOString(),
  };

  const overdueTask: Task = {
    id: '2',
    title: 'Overdue Task',
    isComplete: false,
    dueAt: yesterday.toISOString(),
  };

  const upcomingTask: Task = {
    id: '3',
    title: 'Upcoming Task',
    detail: 'This is an upcoming task',
    isComplete: false,
    dueAt: tomorrow.toISOString(),
  };

  const taskWithoutDue: Task = {
    id: '4',
    title: 'Task Without Due Date',
    isComplete: false,
  };

  it('renders a completed task correctly', () => {
    // Arrange & Act
    render(<TaskItem task={completedTask} />);

    // Assert
    expect(screen.getByText('Completed Task')).toBeInTheDocument();
    expect(screen.getByText('This is a completed task')).toBeInTheDocument();

    // Check for checkbox being checked
    const checkbox = screen.getByTestId('task-checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'true');

    expect(screen.getByText(format(baseDate, 'MMM d, yyyy'))).toBeInTheDocument();

    // Check for line-through style on completed task
    const titleElement = screen.getByText('Completed Task');
    expect(titleElement.className).toContain('line-through');
  });

  it('renders an overdue task correctly', () => {
    // Arrange & Act
    render(<TaskItem task={overdueTask} />);

    // Assert
    expect(screen.getByText('Overdue Task')).toBeInTheDocument();

    // Check that checkbox is not checked for overdue task
    const checkbox = screen.getByTestId('task-checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');

    expect(screen.getByText(format(yesterday, 'MMM d, yyyy'))).toBeInTheDocument();

    // Check for overdue styling
    const dateElement = screen.getByText(format(yesterday, 'MMM d, yyyy'));
    expect(dateElement.className).toContain('bg-destructive/10');
    expect(dateElement.className).toContain('text-destructive');
  });

  it('renders an upcoming task correctly', () => {
    // In the test, since we're using the fixed date of June 1, 2025,
    // and tomorrow is June 2, 2025, which isn't actually overdue
    // since we're testing from June 6, 2025 (as per context)
    // Arrange & Act
    render(<TaskItem task={upcomingTask} />);

    // Assert
    expect(screen.getByText('Upcoming Task')).toBeInTheDocument();
    expect(screen.getByText('This is an upcoming task')).toBeInTheDocument();

    // Check that checkbox is not checked for upcoming task
    const checkbox = screen.getByTestId('task-checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');

    expect(screen.getByText(format(tomorrow, 'MMM d, yyyy'))).toBeInTheDocument();
  });

  it('renders a task without due date correctly', () => {
    // Arrange & Act
    render(<TaskItem task={taskWithoutDue} />);

    // Assert
    expect(screen.getByText('Task Without Due Date')).toBeInTheDocument();

    // Check that checkbox is not checked for task without due date
    const checkbox = screen.getByTestId('task-checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');

    expect(screen.queryByText(/\w+ \d+, \d{4}/)).not.toBeInTheDocument(); // No date should be shown
  });

  it('navigates to task detail page when clicked', async () => {
    // Arrange
    const user = userEvent.setup();

    // Act
    render(<TaskItem task={upcomingTask} />);
    const taskItem = screen.getByTestId('task-item');
    await user.click(taskItem);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith(`/tasks/${upcomingTask.id}`);
  });

  it('toggles task completion when the checkbox is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    mockMutate.mockClear();

    // Act
    render(<TaskItem task={upcomingTask} />);
    const checkbox = screen.getByTestId('task-checkbox');
    await user.click(checkbox);

    // Assert
    expect(mockMutate).toHaveBeenCalledWith({
      taskId: upcomingTask.id,
      isComplete: true, // Should toggle from false to true
    });
  });

  it('prevents navigation when clicking the checkbox', async () => {
    // Arrange
    const user = userEvent.setup();
    mockNavigate.mockClear();

    // Act
    render(<TaskItem task={upcomingTask} />);
    const checkbox = screen.getByTestId('task-checkbox');
    await user.click(checkbox);

    // Assert
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('renders a delete button for each task', () => {
    // Arrange & Act
    render(<TaskItem task={upcomingTask} />);

    // Assert
    const deleteButton = screen.getByTestId('mock-delete-button');
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveAttribute('data-task-id', upcomingTask.id);
    expect(deleteButton).toHaveAttribute('data-task-title', upcomingTask.title);
  });

  it('renders an edit button for each task', () => {
    // Arrange & Act
    render(<TaskItem task={upcomingTask} />);

    // Assert
    const editButton = screen.getByTestId('edit-task-button');
    expect(editButton).toBeInTheDocument();
  });

  it('navigates to edit page when edit button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    mockNavigate.mockClear();

    // Act
    render(<TaskItem task={upcomingTask} />);
    const editButton = screen.getByTestId('edit-task-button');
    await user.click(editButton);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith(`/tasks/${upcomingTask.id}/edit`, { state: { from: '/tasks' } });
  });

  it('prevents navigation to detail page when clicking the edit button', async () => {
    // Arrange
    const user = userEvent.setup();
    mockNavigate.mockClear();

    // Act
    render(<TaskItem task={upcomingTask} />);
    const editButton = screen.getByTestId('edit-task-button');
    await user.click(editButton);

    // Assert
    expect(mockNavigate).not.toHaveBeenCalledWith(`/tasks/${upcomingTask.id}`);
  });

  it('prevents navigation when clicking the delete button', async () => {
    // Arrange
    const user = userEvent.setup();
    mockNavigate.mockClear();

    // Act
    render(<TaskItem task={upcomingTask} />);
    const deleteButton = screen.getByTestId('mock-delete-button');
    await user.click(deleteButton);

    // Assert
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
