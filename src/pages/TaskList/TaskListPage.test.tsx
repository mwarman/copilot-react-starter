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
    filters,
    onFilterToggle,
  }: {
    filterText: string;
    onFilterChange: (value: string) => void;
    filteredCount: number;
    totalCount: number;
    filters: { showComplete: boolean; showIncomplete: boolean; showOverdue: boolean };
    onFilterToggle: (filterName: string) => void;
  }) => (
    <div data-testid="task-filter-bar">
      <input data-testid="filter-input" value={filterText} onChange={(e) => onFilterChange(e.target.value)} />
      <div data-testid="filter-count">
        {filteredCount} of {totalCount} items
      </div>
      <div data-testid="filter-buttons">
        <button
          data-testid="filter-complete"
          data-active={filters.showComplete}
          onClick={() => onFilterToggle('showComplete')}
        >
          Complete
        </button>
        <button
          data-testid="filter-incomplete"
          data-active={filters.showIncomplete}
          onClick={() => onFilterToggle('showIncomplete')}
        >
          Incomplete
        </button>
        <button
          data-testid="filter-overdue"
          data-active={filters.showOverdue}
          onClick={() => onFilterToggle('showOverdue')}
        >
          Overdue
        </button>
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
  Alert: ({
    children,
    variant,
    className,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    variant?: string;
    className?: string;
    'data-testid': string;
  }) => (
    <div data-testid={dataTestId || `alert-${variant || 'default'}`} className={className}>
      {children}
    </div>
  ),
  AlertTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AlertDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
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

  // Sample mock tasks for testing
  const mockTasks: Task[] = [
    { id: '1', title: 'Task 1', isComplete: false, detail: 'Description 1', dueAt: '2023-01-01' },
    { id: '2', title: 'Task 2', isComplete: true, detail: 'Description 2', dueAt: '2023-01-02' },
    { id: '3', title: 'Task 3', isComplete: false, detail: 'Another task', dueAt: '2023-01-03' },
  ];

  it('renders loading state when tasks are loading', () => {
    // Arrange
    vi.mocked(useGetTasks).mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useGetTasks>);

    vi.mocked(useFilterTasks).mockReturnValue({
      filteredTasks: [],
      filterText: '',
      setFilterText: vi.fn(),
      filters: {
        showComplete: false,
        showIncomplete: false,
        showOverdue: false,
      },
      toggleFilter: vi.fn(),
      filteredCount: 0,
      totalCount: 0,
    } as unknown as ReturnType<typeof useFilterTasks>);

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

  it('renders error state when there is an error fetching tasks', async () => {
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
    } as unknown as ReturnType<typeof useGetTasks>);

    vi.mocked(useFilterTasks).mockReturnValue({
      filteredTasks: [],
      filterText: '',
      setFilterText: vi.fn(),
      filters: {
        showComplete: false,
        showIncomplete: false,
        showOverdue: false,
      },
      toggleFilter: vi.fn(),
      filteredCount: 0,
      totalCount: 0,
    } as unknown as ReturnType<typeof useFilterTasks>);

    // Act
    render(
      <QueryClientProvider client={createQueryClient()}>
        <TaskListPage />
      </QueryClientProvider>,
    );

    // Assert
    expect(screen.getByText('My Tasks')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch tasks')).toBeInTheDocument();

    // Test retry functionality
    const retryButton = screen.getByText('Try Again');
    await user.click(retryButton);
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('renders generic error message when error is not an Error instance', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockRefetch = vi.fn();
    const mockError = 'String error'; // Not an Error instance

    vi.mocked(useGetTasks).mockReturnValue({
      isLoading: false,
      isError: true,
      data: undefined,
      error: mockError,
      refetch: mockRefetch,
    } as unknown as ReturnType<typeof useGetTasks>);

    vi.mocked(useFilterTasks).mockReturnValue({
      filteredTasks: [],
      filterText: '',
      setFilterText: vi.fn(),
      filters: {
        showComplete: false,
        showIncomplete: false,
        showOverdue: false,
      },
      toggleFilter: vi.fn(),
      filteredCount: 0,
      totalCount: 0,
    } as unknown as ReturnType<typeof useFilterTasks>);

    // Act
    render(
      <QueryClientProvider client={createQueryClient()}>
        <TaskListPage />
      </QueryClientProvider>,
    );

    // Assert
    expect(screen.getByText('My Tasks')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Failed to load tasks')).toBeInTheDocument(); // Should show the fallback message

    // Test retry functionality
    const retryButton = screen.getByText('Try Again');
    await user.click(retryButton);
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('renders empty state when there are no tasks', () => {
    // Arrange
    vi.mocked(useGetTasks).mockReturnValue({
      isLoading: false,
      isError: false,
      data: [],
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useGetTasks>);

    vi.mocked(useFilterTasks).mockReturnValue({
      filteredTasks: [],
      filterText: '',
      setFilterText: vi.fn(),
      filters: {
        showComplete: false,
        showIncomplete: false,
        showOverdue: false,
      },
      toggleFilter: vi.fn(),
      filteredCount: 0,
      totalCount: 0,
    } as unknown as ReturnType<typeof useFilterTasks>);

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
  });

  it('renders task list when tasks are available', () => {
    // Arrange
    vi.mocked(useGetTasks).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockTasks,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useGetTasks>);

    vi.mocked(useFilterTasks).mockReturnValue({
      filteredTasks: mockTasks,
      filterText: '',
      setFilterText: vi.fn(),
      filters: {
        showComplete: false,
        showIncomplete: false,
        showOverdue: false,
      },
      toggleFilter: vi.fn(),
      filteredCount: 3,
      totalCount: 3,
    } as unknown as ReturnType<typeof useFilterTasks>);

    // Act
    render(
      <QueryClientProvider client={createQueryClient()}>
        <TaskListPage />
      </QueryClientProvider>,
    );

    // Assert
    expect(screen.getByText('My Tasks')).toBeInTheDocument();
    expect(screen.getByTestId('task-list')).toBeInTheDocument();
    expect(screen.getByTestId('task-filter-bar')).toBeInTheDocument();
    expect(screen.getAllByTestId('task-item')).toHaveLength(3);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
  });

  it('filters tasks when text is entered in the search input', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockSetFilterText = vi.fn();

    vi.mocked(useGetTasks).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockTasks,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useGetTasks>);

    vi.mocked(useFilterTasks).mockReturnValue({
      filteredTasks: mockTasks,
      filterText: '',
      setFilterText: mockSetFilterText,
      filters: {
        showComplete: false,
        showIncomplete: false,
        showOverdue: false,
      },
      toggleFilter: vi.fn(),
      filteredCount: 3,
      totalCount: 3,
    } as unknown as ReturnType<typeof useFilterTasks>);

    // Act
    render(
      <QueryClientProvider client={createQueryClient()}>
        <TaskListPage />
      </QueryClientProvider>,
    );

    // Change the filter text
    const filterInput = screen.getByTestId('filter-input');
    await user.type(filterInput, 'Task 1');

    // Assert - the mock should have been called for each character
    expect(mockSetFilterText).toHaveBeenCalledTimes(6); // T, a, s, k, <space>, 1

    // Verify each character was passed to the setFilterText function
    expect(mockSetFilterText).toHaveBeenNthCalledWith(1, 'T');
    expect(mockSetFilterText).toHaveBeenNthCalledWith(2, 'a');
    expect(mockSetFilterText).toHaveBeenNthCalledWith(3, 's');
    expect(mockSetFilterText).toHaveBeenNthCalledWith(4, 'k');
    expect(mockSetFilterText).toHaveBeenNthCalledWith(5, ' ');
    expect(mockSetFilterText).toHaveBeenNthCalledWith(6, '1');
  });

  it('filters tasks when filter buttons are clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockToggleFilter = vi.fn();

    vi.mocked(useGetTasks).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockTasks,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useGetTasks>);

    vi.mocked(useFilterTasks).mockReturnValue({
      filteredTasks: mockTasks,
      filterText: '',
      setFilterText: vi.fn(),
      filters: {
        showComplete: false,
        showIncomplete: false,
        showOverdue: false,
      },
      toggleFilter: mockToggleFilter,
      filteredCount: 3,
      totalCount: 3,
    } as unknown as ReturnType<typeof useFilterTasks>);

    // Act
    render(
      <QueryClientProvider client={createQueryClient()}>
        <TaskListPage />
      </QueryClientProvider>,
    );

    // Click the Complete filter button
    const completeButton = screen.getByTestId('filter-complete');
    await user.click(completeButton);

    // Assert
    expect(mockToggleFilter).toHaveBeenCalledWith('showComplete');
  });
});
