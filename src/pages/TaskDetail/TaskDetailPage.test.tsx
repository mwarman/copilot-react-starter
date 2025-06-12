import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TaskDetailPage } from './TaskDetailPage';
import { useGetTask } from './hooks/useGetTask';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';

// Mock the useGetTask hook
vi.mock('./hooks/useGetTask', () => ({
  useGetTask: vi.fn(),
}));

// Mock the useToggleTaskComplete hook
const mockToggleMutate = vi.fn();
vi.mock('@/common/hooks/useToggleTaskComplete', () => ({
  useToggleTaskComplete: () => ({
    mutate: mockToggleMutate,
    isPending: false,
    isError: false,
  }),
}));

// Mock the DeleteTaskDialog component
vi.mock('@/common/components/DeleteTaskDialog', () => ({
  DeleteTaskDialog: ({ taskId, taskTitle }: { taskId: string; taskTitle: string }) => (
    <button data-testid="mock-delete-button" data-task-id={taskId} data-task-title={taskTitle}>
      Delete Task
    </button>
  ),
}));

// Mock the router hooks
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useParams: () => ({ taskId: '123' }),
  useNavigate: () => mockNavigate,
}));

describe('TaskDetailPage', () => {
  let queryClient: QueryClient;

  // Set up the QueryClient for each test
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  // Clean up after each test
  afterEach(() => {
    vi.useRealTimers();
  });

  // Helper function to render the component with the QueryClient provider
  const renderWithProviders = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <TaskDetailPage />
      </QueryClientProvider>,
    );
  };

  it('should display loading state', () => {
    // Arrange
    vi.mocked(useGetTask).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as ReturnType<typeof useGetTask>);

    // Act
    renderWithProviders();

    // Assert
    expect(screen.getAllByText(/^(?:.*?)$/i, { selector: '[data-slot="skeleton"]' })).toHaveLength(4);
  });

  it('should display task details when data is loaded', async () => {
    // Arrange
    const mockTask = {
      id: '123',
      title: 'Test Task',
      detail: 'This is a test task description',
      isComplete: false,
      dueAt: '2030-12-31T23:59:59Z',
    };

    vi.mocked(useGetTask).mockReturnValue({
      data: mockTask,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useGetTask>);

    // Act
    renderWithProviders();

    // Assert
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('This is a test task description')).toBeInTheDocument();
    expect(screen.getByText(/In Progress/i)).toBeInTheDocument();
    expect(screen.getByText(/Task ID: 123/i)).toBeInTheDocument();
  });

  it('should display error state when task loading fails', () => {
    // Arrange
    vi.mocked(useGetTask).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { status: 500, message: 'Failed to load task' },
    } as unknown as ReturnType<typeof useGetTask>);

    // Act
    renderWithProviders();

    // Assert
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Failed to load task')).toBeInTheDocument();
  });

  it('should display not found state for 404 errors', () => {
    // Arrange
    vi.mocked(useGetTask).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { status: 404, message: 'Task not found' },
    } as unknown as ReturnType<typeof useGetTask>);

    // Act
    renderWithProviders();

    // Assert
    expect(screen.getAllByText('Task Not Found')[0]).toBeInTheDocument();
    expect(screen.getByText("The task you're looking for doesn't exist or has been deleted.")).toBeInTheDocument();
  });

  it('should navigate back to task list when back button is clicked', async () => {
    // Arrange
    const mockTask = {
      id: '123',
      title: 'Test Task',
      detail: 'This is a test task description',
      isComplete: false,
      dueAt: '2030-12-31T23:59:59Z',
    };

    vi.mocked(useGetTask).mockReturnValue({
      data: mockTask,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useGetTask>);

    renderWithProviders();
    const user = userEvent.setup();

    // Act
    await user.click(screen.getByText('Back to Tasks'));

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/tasks');
  });

  it('should display a completed task with proper styling', () => {
    // Arrange
    const mockCompletedTask = {
      id: '123',
      title: 'Completed Task',
      detail: 'This task has been completed',
      isComplete: true,
      dueAt: '2030-12-31T23:59:59Z',
    };

    vi.mocked(useGetTask).mockReturnValue({
      data: mockCompletedTask,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useGetTask>);

    // Act
    renderWithProviders();

    // Assert
    expect(screen.getByText('Completed')).toBeInTheDocument();
    const statusBadge = screen.getByText('Completed').closest('div');
    expect(statusBadge).toHaveClass('bg-green-100');

    // Check that the checkbox is checked
    const checkbox = screen.getByTestId('task-complete-checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'true');

    // Check the checkbox label
    expect(screen.getByText('Mark as incomplete')).toBeInTheDocument();
  });

  it('should toggle task status from complete to incomplete', async () => {
    // Arrange
    const mockCompletedTask = {
      id: '123',
      title: 'Completed Task',
      detail: 'This task has been completed',
      isComplete: true,
      dueAt: '2030-12-31T23:59:59Z',
    };

    vi.mocked(useGetTask).mockReturnValue({
      data: mockCompletedTask,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useGetTask>);

    const user = userEvent.setup();
    mockToggleMutate.mockClear();

    // Act
    renderWithProviders();
    const checkbox = screen.getByTestId('task-complete-checkbox');
    await user.click(checkbox);

    // Assert
    expect(mockToggleMutate).toHaveBeenCalledWith({
      taskId: '123',
      isComplete: false,
    });
  });

  it('should display formatted due date correctly', () => {
    // Arrange
    const mockTask = {
      id: '123',
      title: 'Test Task',
      detail: 'This is a test task description',
      isComplete: false,
      dueAt: '2030-12-31T23:59:59Z',
    };

    vi.mocked(useGetTask).mockReturnValue({
      data: mockTask,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useGetTask>);

    // Act
    renderWithProviders();

    // Assert
    expect(screen.getByText(/December 31, 2030/i)).toBeInTheDocument();
  });

  it('should handle task with missing or null fields gracefully', () => {
    // Arrange
    const mockIncompleteTask = {
      id: '123',
      title: 'Incomplete Data Task',
      // Missing detail field
      isComplete: false,
      // Missing dueAt field
    };

    vi.mocked(useGetTask).mockReturnValue({
      data: mockIncompleteTask,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useGetTask>);

    // Act
    renderWithProviders();

    // Assert
    expect(screen.getByText('Incomplete Data Task')).toBeInTheDocument();
    expect(screen.getByText(/In Progress/i)).toBeInTheDocument();
    expect(screen.getByText(/Task ID: 123/i)).toBeInTheDocument();
    expect(screen.getByText('No details provided')).toBeInTheDocument();
  });

  it('should toggle task completion status when checkbox is clicked', async () => {
    // Arrange
    const mockTask = {
      id: '123',
      title: 'Test Task',
      detail: 'This is a test task description',
      isComplete: false,
      dueAt: '2030-12-31T23:59:59Z',
    };

    vi.mocked(useGetTask).mockReturnValue({
      data: mockTask,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useGetTask>);

    const user = userEvent.setup();
    mockToggleMutate.mockClear();

    // Act
    renderWithProviders();
    const checkbox = screen.getByTestId('task-complete-checkbox');
    await user.click(checkbox);

    // Assert
    expect(mockToggleMutate).toHaveBeenCalledWith({
      taskId: '123',
      isComplete: true,
    });
  });

  it('should handle a scenario with null task data gracefully', () => {
    // Arrange
    vi.mocked(useGetTask).mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useGetTask>);

    // Act
    renderWithProviders();

    // Assert
    expect(screen.getAllByText('Task Not Found')[0]).toBeInTheDocument();
  });

  it('should render error state for other HTTP status codes', () => {
    // Arrange
    vi.mocked(useGetTask).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: {
        status: 401, // Unauthorized status
        message: 'Unauthorized access',
      },
    } as unknown as ReturnType<typeof useGetTask>);

    // Act
    renderWithProviders();

    // Assert
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Unauthorized access')).toBeInTheDocument();
  });

  it('should display overdue status for tasks with past due dates', () => {
    // Arrange
    const mockDate = new Date('2025-06-10T12:00:00Z');
    vi.setSystemTime(mockDate);

    const mockOverdueTask = {
      id: '123',
      title: 'Overdue Task',
      detail: 'This task is overdue',
      isComplete: false,
      dueAt: '2025-06-01T23:59:59Z', // Past due date (9 days ago)
    };

    vi.mocked(useGetTask).mockReturnValue({
      data: mockOverdueTask,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useGetTask>);

    // Act
    renderWithProviders();

    // Assert
    expect(screen.getByText('Overdue')).toBeInTheDocument();
    const statusBadge = screen.getByText('Overdue').closest('div');
    expect(statusBadge).toHaveClass('bg-red-100');
    expect(screen.getByText(/Due: June 1, 2025/i)).toBeInTheDocument();
    expect(screen.getByText(/\(9 days ago\)/i)).toBeInTheDocument();

    // Cleanup
    vi.useRealTimers();
  });

  it('should not display due date for completed tasks', () => {
    // Arrange
    const mockCompletedTask = {
      id: '123',
      title: 'Completed Task',
      detail: 'This task has been completed',
      isComplete: true,
      dueAt: '2030-12-31T23:59:59Z',
    };

    vi.mocked(useGetTask).mockReturnValue({
      data: mockCompletedTask,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useGetTask>);

    // Act
    renderWithProviders();

    // Assert
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.queryByText(/Due:/i)).not.toBeInTheDocument();
  });

  it('should handle error with no message gracefully', () => {
    // Arrange
    vi.mocked(useGetTask).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: {
        status: 500,
        // No message property
      },
    } as unknown as ReturnType<typeof useGetTask>);

    // Act
    renderWithProviders();

    // Assert
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('An unexpected error occurred while loading the task.')).toBeInTheDocument();
  });

  it('should handle case when taskId is not provided', () => {
    // Arrange
    vi.mock('react-router-dom', () => ({
      useParams: () => ({ taskId: undefined }),
      useNavigate: () => mockNavigate,
    }));

    vi.mocked(useGetTask).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as ReturnType<typeof useGetTask>);

    // Act
    renderWithProviders();

    // Assert
    expect(screen.getAllByText(/^(?:.*?)$/i, { selector: '[data-slot="skeleton"]' })).toHaveLength(4);

    // Cleanup
    vi.mock('react-router-dom', () => ({
      useParams: () => ({ taskId: '123' }),
      useNavigate: () => mockNavigate,
    }));
  });

  it('should display task completion status', () => {
    // Arrange
    const mockCompletedTask = {
      id: '123',
      title: 'Completed Task',
      detail: 'This task has been completed',
      isComplete: true,
      dueAt: '2030-12-31T23:59:59Z',
    };

    vi.mocked(useGetTask).mockReturnValue({
      data: mockCompletedTask,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useGetTask>);

    // Act
    renderWithProviders();

    // Assert
    expect(screen.getByText(/Mark as incomplete/)).toBeInTheDocument();
    expect(screen.getAllByText(/Completed/i)[0]).toBeInTheDocument();
  });

  it('should render delete button in task detail page', () => {
    // Arrange
    const mockTask = {
      id: '123',
      title: 'Test Task',
      detail: 'This is a test task description',
      isComplete: false,
      dueAt: '2030-12-31T23:59:59Z',
    };

    vi.mocked(useGetTask).mockReturnValue({
      data: mockTask,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useGetTask>);

    // Act
    renderWithProviders();

    // Assert
    const deleteButton = screen.getByTestId('mock-delete-button');
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveAttribute('data-task-id', '123');
    expect(deleteButton).toHaveAttribute('data-task-title', 'Test Task');
  });
});
