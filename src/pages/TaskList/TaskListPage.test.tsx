import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TaskListPage } from './TaskListPage';
import { type Task } from '@/common/models/Task';

// Mock the hooks
vi.mock('./hooks/useGetTasks', () => ({
  useGetTasks: vi.fn(),
}));

vi.mock('./hooks/useFilterTasks', () => ({
  useFilterTasks: vi.fn(),
}));

// Import the hooks after mocking
import { useGetTasks } from './hooks/useGetTasks';
import { useFilterTasks } from './hooks/useFilterTasks';

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

vi.mock('./components/TaskFilterBar', () => ({
  TaskFilterBar: ({
    filterText,
    onFilterChange,
    filteredCount,
    totalCount,
  }: {
    filterText: string;
    onFilterChange: (value: string) => void;
    filteredCount: number;
    totalCount: number;
  }) => (
    <div data-testid="task-filter-bar">
      <input data-testid="filter-input" value={filterText} onChange={(e) => onFilterChange(e.target.value)} />
      <div data-testid="filter-count">
        {filteredCount} of {totalCount} items
      </div>
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

    vi.mocked(useFilterTasks).mockReturnValue({
      filteredTasks: [],
      filterText: '',
      setFilterText: vi.fn(),
      filteredCount: 0,
      totalCount: 0,
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

    vi.mocked(useFilterTasks).mockReturnValue({
      filteredTasks: [],
      filterText: '',
      setFilterText: vi.fn(),
      filteredCount: 0,
      totalCount: 0,
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

    vi.mocked(useFilterTasks).mockReturnValue({
      filteredTasks: [],
      filterText: '',
      setFilterText: vi.fn(),
      filteredCount: 0,
      totalCount: 0,
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

    vi.mocked(useFilterTasks).mockReturnValue({
      filteredTasks: [],
      filterText: '',
      setFilterText: vi.fn(),
      filteredCount: 0,
      totalCount: 0,
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

    vi.mocked(useFilterTasks).mockReturnValue({
      filteredTasks: mockTasks,
      filterText: '',
      setFilterText: vi.fn(),
      filteredCount: 2,
      totalCount: 2,
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
    expect(screen.getByTestId('task-filter-bar')).toBeInTheDocument();
    expect(screen.getByTestId('filter-count')).toHaveTextContent('2 of 2 items');
  });

  it('renders filtered tasks', () => {
    // Arrange
    const mockTasks: Task[] = [
      { id: '1', title: 'Task 1', isComplete: false, detail: 'Description 1', dueAt: '2023-01-01' },
      { id: '2', title: 'Task 2', isComplete: true, detail: 'Description 2', dueAt: '2023-01-02' },
      { id: '3', title: 'Task 3', isComplete: false, detail: 'Another task', dueAt: '2023-01-03' },
    ];

    vi.mocked(useGetTasks).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockTasks,
      error: null,
      refetch: vi.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    // Simulate filtered tasks (only Task 1)
    const filteredTasks = [mockTasks[0]];
    const mockSetFilterText = vi.fn();

    vi.mocked(useFilterTasks).mockReturnValue({
      filteredTasks: filteredTasks,
      filterText: 'Task 1', // Filter term
      setFilterText: mockSetFilterText,
      filteredCount: 1,
      totalCount: 3,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    // Act
    render(
      <QueryClientProvider client={createQueryClient()}>
        <TaskListPage />
      </QueryClientProvider>,
    );

    // Assert
    expect(screen.getByTestId('task-list')).toBeInTheDocument();
    expect(screen.getAllByTestId('task-item')).toHaveLength(1);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Task 3')).not.toBeInTheDocument();
    expect(screen.getByTestId('filter-count')).toHaveTextContent('1 of 3 items');

    // Verify filter input has the correct value
    expect(screen.getByTestId('filter-input')).toHaveValue('Task 1');
  });
});
