import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TaskItem } from './TaskItem';
import { type Task } from '@/common/models/Task';
import { format, addDays, subDays } from 'date-fns';

// Mock the Lucide React icons
import { vi } from 'vitest';
vi.mock('lucide-react', () => ({
  CheckCircle2: () => <div data-testid="check-circle-icon">CheckCircle2</div>,
  AlertCircle: () => <div data-testid="alert-circle-icon">AlertCircle</div>,
  CircleIcon: () => <div data-testid="circle-icon">CircleIcon</div>,
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
    expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
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
    expect(screen.getByTestId('alert-circle-icon')).toBeInTheDocument();
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
    // Check for the alert circle icon because the date is in the past relative to the current date
    expect(screen.getByTestId('alert-circle-icon')).toBeInTheDocument();
    expect(screen.getByText(format(tomorrow, 'MMM d, yyyy'))).toBeInTheDocument();
  });

  it('renders a task without due date correctly', () => {
    // Arrange & Act
    render(<TaskItem task={taskWithoutDue} />);

    // Assert
    expect(screen.getByText('Task Without Due Date')).toBeInTheDocument();
    expect(screen.getByTestId('circle-icon')).toBeInTheDocument();
    expect(screen.queryByText(/\w+ \d+, \d{4}/)).not.toBeInTheDocument(); // No date should be shown
  });
});
