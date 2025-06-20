import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UpdateTaskPage from './UpdateTaskPage';
import type { Task } from '../../common/models/Task';

// Hoist mock functions to ensure they're available at the top level
const mockNavigate = vi.hoisted(() => vi.fn());
const mockUseGetTask = vi.hoisted(() => vi.fn());
const mockUseUpdateTask = vi.hoisted(() => vi.fn());
const mockUpdateMutate = vi.hoisted(() => vi.fn());

// Mock the navigation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock the hooks
vi.mock('../../pages/TaskDetail/hooks/useGetTask', () => ({
  useGetTask: mockUseGetTask,
}));

vi.mock('./hooks/useUpdateTask', () => ({
  useUpdateTask: mockUseUpdateTask,
}));

// Mock ResizeObserver which is needed for some UI components
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
});

const mockTask: Task = {
  id: 'task-1',
  title: 'Test Task',
  detail: 'Test task details',
  isComplete: false,
  dueAt: '2024-12-31T23:59:59.999Z',
};

describe('UpdateTaskPage', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    });

    // Set default mock return values
    mockUseGetTask.mockReturnValue({
      data: mockTask,
      isLoading: false,
      error: null,
    });

    mockUseUpdateTask.mockReturnValue({
      mutate: mockUpdateMutate,
      isPending: false,
      error: null,
    });
  });

  // Setup function to render component with providers
  const renderWithProviders = (taskId = 'task-1') => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[`/tasks/${taskId}/edit`]}>
          <Routes>
            <Route path="/tasks/:taskId/edit" element={<UpdateTaskPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  describe('Loading State', () => {
    it('shows loading state while fetching task data', () => {
      // Arrange - Set loading state
      mockUseGetTask.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      });

      // Act
      renderWithProviders();

      // Assert
      expect(screen.getByText('Back')).toBeInTheDocument();
      const pulseElements = document.querySelectorAll('.animate-pulse');
      expect(pulseElements.length).toBeGreaterThan(0);
    });
  });

  describe('Error States', () => {
    it('shows error when task fails to load', async () => {
      // Arrange
      mockUseGetTask.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: { message: 'API Error' },
      });

      // Act
      renderWithProviders();

      // Assert
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to load task data')).toBeInTheDocument();
    });

    it('shows not found when task does not exist', async () => {
      // Arrange
      const error = { message: 'Request failed with status code 404' };
      mockUseGetTask.mockReturnValue({
        data: undefined,
        isLoading: false,
        error,
      });

      // Act
      renderWithProviders();

      // Assert
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to load task data')).toBeInTheDocument();
    });
  });

  describe('Form Rendering', () => {
    it('renders the update task form with pre-populated fields', async () => {
      // Arrange & Act
      renderWithProviders();

      // Assert
      expect(screen.getByText('Edit Task')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test task details')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /update task/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('renders completion checkbox with correct state', () => {
      // Arrange & Act
      renderWithProviders();

      // Assert
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
    });

    it('renders completion checkbox as checked for completed task', () => {
      // Arrange
      const completedTask = { ...mockTask, isComplete: true };
      mockUseGetTask.mockReturnValue({
        data: completedTask,
        isLoading: false,
        error: null,
      });

      // Act
      renderWithProviders();

      // Assert
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });
  });

  describe('Form Validation', () => {
    it('displays validation errors for invalid inputs', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders();

      // Act
      const titleInput = screen.getByDisplayValue('Test Task');
      await user.clear(titleInput);
      await user.type(titleInput, 'a'); // Too short (min 2 chars)

      const submitButton = screen.getByRole('button', { name: /update task/i });
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Title must be at least 2 characters long')).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('submits form with updated data', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders();

      // Wait for form to be fully rendered
      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
      });

      // Act
      const titleInput = screen.getByDisplayValue('Test Task');
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Task Title');

      const submitButton = screen.getByRole('button', { name: /update task/i });
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(mockUpdateMutate).toHaveBeenCalledWith(
          {
            taskId: 'task-1',
            data: expect.objectContaining({
              title: 'Updated Task Title',
              detail: 'Test task details',
              isComplete: false,
              dueAt: expect.stringMatching(/^2024-12-31T23:59:59\.\d{3}Z$/),
            }),
          },
          expect.objectContaining({
            onSuccess: expect.any(Function),
            onError: expect.any(Function),
          }),
        );
      });
    });

    it('toggles completion status', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders();

      // Act
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      const submitButton = screen.getByRole('button', { name: /update task/i });
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(mockUpdateMutate).toHaveBeenCalledWith(
          {
            taskId: 'task-1',
            data: expect.objectContaining({
              isComplete: true,
            }),
          },
          expect.objectContaining({
            onSuccess: expect.any(Function),
            onError: expect.any(Function),
          }),
        );
      });
    });

    it('handles API errors during submission', async () => {
      // Arrange
      const user = userEvent.setup();
      mockUseUpdateTask.mockReturnValue({
        mutate: mockUpdateMutate,
        isPending: false,
        error: { message: 'API Error' },
      });

      renderWithProviders();

      // Act
      const submitButton = screen.getByRole('button', { name: /update task/i });
      await user.click(submitButton);

      // Assert
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to update task')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('navigates back when cancel button is clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders();

      // Act
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/tasks');
    });

    it('navigates back when back button is clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders();

      // Act
      const backButton = screen.getByText('Back');
      await user.click(backButton);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/tasks');
    });
  });

  describe('Loading States', () => {
    it('shows loading state during form submission', async () => {
      // Arrange
      mockUseUpdateTask.mockReturnValue({
        mutate: mockUpdateMutate,
        isPending: true,
        error: null,
      });

      renderWithProviders();

      // Act & Assert
      const submitButton = screen.getByRole('button', { name: /updating/i });
      expect(submitButton).toBeDisabled();
    });
  });
});
