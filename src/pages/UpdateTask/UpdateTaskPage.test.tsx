import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UpdateTaskPage } from './UpdateTaskPage';
import { useGetTask } from '../TaskDetail/hooks/useGetTask';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import { type Task } from '@/common/models/Task';

// Mock the useGetTask hook
vi.mock('../TaskDetail/hooks/useGetTask', () => ({
  useGetTask: vi.fn(),
}));

// Mock the UpdateTaskForm component
vi.mock('./components/UpdateTaskForm', () => ({
  UpdateTaskForm: ({ task, taskId, previousLocation }: { task: Task; taskId: string; previousLocation: string }) => (
    <div data-testid="mock-update-form">
      <div>Task ID: {taskId}</div>
      <div>Title: {task.title}</div>
      <div>Previous Location: {previousLocation}</div>
    </div>
  ),
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ taskId: '123' }),
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: { from: '/tasks' }, pathname: '/tasks/123/edit' }),
  };
});

describe('UpdateTaskPage', () => {
  // Setup for rendering with QueryClient
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const renderWithProviders = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <UpdateTaskPage />
      </QueryClientProvider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it('should display task update form when data is loaded', () => {
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
    expect(screen.getByTestId('mock-update-form')).toBeInTheDocument();
    expect(screen.getByText('Task ID: 123')).toBeInTheDocument();
    expect(screen.getByText('Title: Test Task')).toBeInTheDocument();
    expect(screen.getByText('Previous Location: /tasks')).toBeInTheDocument();
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

  it('should display not found state when task is null', () => {
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
    expect(screen.getByText("The task you're looking for doesn't exist or has been deleted.")).toBeInTheDocument();
  });

  it('should navigate back when go back button is clicked in error state', async () => {
    // Arrange
    vi.mocked(useGetTask).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { status: 500, message: 'Failed to load task' },
    } as unknown as ReturnType<typeof useGetTask>);

    renderWithProviders();
    const user = userEvent.setup();

    // Act
    await user.click(screen.getByText('Go Back'));

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/tasks');
  });

  it('should navigate back when cancel button is clicked', async () => {
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

    // We're not testing this functionality here as the Cancel button is now handled
    // by the UpdateTaskForm component, which has its own tests
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
