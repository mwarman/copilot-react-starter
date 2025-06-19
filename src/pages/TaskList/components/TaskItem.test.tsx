import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { TaskItem } from './TaskItem';
import type { Task } from '../../../common/models/Task';

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock TaskCompleteToggle component
vi.mock('./TaskCompleteToggle', () => ({
  TaskCompleteToggle: ({ task, className }: { task: Task; className?: string }) => (
    <input type="checkbox" role="checkbox" checked={task.isComplete} className={className} readOnly />
  ),
}));

// Test wrapper with Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('TaskItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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
    renderWithRouter(<TaskItem task={task} />);

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
    renderWithRouter(<TaskItem task={task} />);

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
    renderWithRouter(<TaskItem task={task} />);

    // Assert
    const container = screen.getByText('Overdue Task').closest('div[class*="border"]');
    expect(container).toHaveClass('border-amber-500');

    // Check that both mobile and desktop date displays have amber text
    const dateElements = screen.getAllByText('Jan 01, 2024');
    dateElements.forEach((element) => {
      expect(element.closest('[class*="text-amber"]')).not.toBeNull();
    });
  });

  it('navigates to task detail when clicked', async () => {
    // Arrange
    const task = mockTask;
    const user = userEvent.setup();

    // Act
    renderWithRouter(<TaskItem task={task} />);

    const taskContainer = screen.getByRole('button');
    await user.click(taskContainer);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/tasks/1');
  });

  it('navigates to task detail when Enter key is pressed', async () => {
    // Arrange
    const task = mockTask;
    const user = userEvent.setup();

    // Act
    renderWithRouter(<TaskItem task={task} />);

    const taskContainer = screen.getByRole('button');
    taskContainer.focus();
    await user.keyboard('{Enter}');

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/tasks/1');
  });

  it('navigates to task detail when Space key is pressed', async () => {
    // Arrange
    const task = mockTask;
    const user = userEvent.setup();

    // Act
    renderWithRouter(<TaskItem task={task} />);

    const taskContainer = screen.getByRole('button');
    taskContainer.focus();
    await user.keyboard(' ');

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/tasks/1');
  });

  it('does not navigate when checkbox is clicked', async () => {
    // Arrange
    const task = mockTask;
    const user = userEvent.setup();

    // Act
    renderWithRouter(<TaskItem task={task} />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    // Assert
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
