import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TaskListPage } from './TaskListPage';
import { type Task } from '@/common/models/Task';

// Mock the hook
vi.mock('./hooks/useGetTasks', () => ({
  useGetTasks: vi.fn(),
}));

// Import the hook after mocking
import { useGetTasks } from './hooks/useGetTasks';

// Mock components
vi.mock('./components/TaskList', () => ({
  TaskList: ({ tasks }: { tasks: Task[] }) => (
    <div data-testid="task-list">
      {tasks.map((task) => (
        <div key={task.id} data-testid="task-item">
          {task.title}
        </div>
      ))}
    </div>
  ),
}));

vi.mock('@/common/components/ui/skeleton', () => ({
  Skeleton: ({ className, 'data-testid': dataTestId }: { className: string; 'data-testid': string }) => (
    <div className={className} data-testid={dataTestId}>
      Skeleton
    </div>
  ),
}));

vi.mock('@/common/components/ui/alert', () => ({
  Alert: ({ className, variant, children }: { className?: string; variant?: string; children: React.ReactNode }) => (
    <div className={className} data-testid={`alert-${variant || 'default'}`}>
      {children}
    </div>
  ),
  AlertTitle: ({ children }: { children: React.ReactNode }) => <div data-testid="alert-title">{children}</div>,
  AlertDescription: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="alert-description">{children}</div>
  ),
}));

vi.mock('lucide-react', () => ({
  AlertCircle: () => <div data-testid="alert-circle-icon">Alert Icon</div>,
  Info: () => <div data-testid="info-icon">Info Icon</div>,
}));

describe('TaskListPage', () => {
  // Setup for each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Helper function to create query client
  const createQueryClient = () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

  it('renders loading state with skeletons', () => {
    // Arrange
    vi.mocked(useGetTasks).mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      error: null,
      refetch: vi.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    // Act
    render(
      <QueryClientProvider client={createQueryClient()}>
        <TaskListPage />
      </QueryClientProvider>,
    );

    // Assert
    expect(screen.getByText('My Tasks')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-1')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-2')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-3')).toBeInTheDocument();
  });

  it('renders error state with error message and retry button', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockRefetch = vi.fn();
    const mockError = new Error('Failed to fetch tasks');

    vi.mocked(useGetTasks).mockReturnValue({
      isLoading: false,
      isError: true,
      data: undefined,
      error: mockError,
      refetch: mockRefetch,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    // Act
    render(
      <QueryClientProvider client={createQueryClient()}>
        <TaskListPage />
      </QueryClientProvider>,
    );

    // Assert
    expect(screen.getByText('My Tasks')).toBeInTheDocument();
    expect(screen.getByTestId('alert-destructive')).toBeInTheDocument();
    expect(screen.getByTestId('alert-circle-icon')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch tasks')).toBeInTheDocument();

    // Act - Click retry button
    const retryButton = screen.getByText('Try Again');
    await user.click(retryButton);

    // Assert - Verify refetch was called
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('renders error state with generic error message when error is not an instance of Error', () => {
    // Arrange
    const mockRefetch = vi.fn();

    vi.mocked(useGetTasks).mockReturnValue({
      isLoading: false,
      isError: true,
      data: undefined,
      error: 'Unknown error', // String error instead of Error object
      refetch: mockRefetch,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    // Act
    render(
      <QueryClientProvider client={createQueryClient()}>
        <TaskListPage />
      </QueryClientProvider>,
    );

    // Assert
    expect(screen.getByText('Failed to load tasks')).toBeInTheDocument();
  });

  it('renders empty state when there are no tasks', () => {
    // Arrange
    vi.mocked(useGetTasks).mockReturnValue({
      isLoading: false,
      isError: false,
      data: [],
      error: null,
      refetch: vi.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    // Act
    render(
      <QueryClientProvider client={createQueryClient()}>
        <TaskListPage />
      </QueryClientProvider>,
    );

    // Assert
    expect(screen.getByText('My Tasks')).toBeInTheDocument();
    expect(screen.getByText('No tasks found')).toBeInTheDocument();
    expect(screen.getByText("You don't have any tasks yet. Create a new task to get started.")).toBeInTheDocument();
    expect(screen.getByTestId('info-icon')).toBeInTheDocument();
  });

  it('renders populated state with tasks', () => {
    // Arrange
    const mockTasks: Task[] = [
      { id: '1', title: 'Task 1', isComplete: false, detail: 'Description 1', dueAt: '2023-01-01' },
      { id: '2', title: 'Task 2', isComplete: true, detail: 'Description 2', dueAt: '2023-01-02' },
    ];

    vi.mocked(useGetTasks).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockTasks,
      error: null,
      refetch: vi.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    // Act
    render(
      <QueryClientProvider client={createQueryClient()}>
        <TaskListPage />
      </QueryClientProvider>,
    );

    // Assert
    expect(screen.getByText('My Tasks')).toBeInTheDocument();
    expect(screen.getByTestId('task-list')).toBeInTheDocument();
    expect(screen.getAllByTestId('task-item')).toHaveLength(2);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });
});
