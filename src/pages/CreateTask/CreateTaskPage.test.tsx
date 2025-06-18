import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CreateTaskPage from './CreateTaskPage';

// Hoist mock functions to ensure they're available at the top level
const mockNavigate = vi.hoisted(() => vi.fn());
const mockMutate = vi.hoisted(() => vi.fn());
const mockUseCreateTask = vi.hoisted(() => vi.fn());

// Mock the navigation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the useCreateTask hook
vi.mock('./hooks/useCreateTask', () => ({
  useCreateTask: mockUseCreateTask,
}));

describe('CreateTaskPage', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Set default mock return value
    mockUseCreateTask.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    });
  });

  // Setup function to render component with providers
  const renderWithProviders = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/tasks/create']}>
          <Routes>
            <Route path="/tasks/create" element={<CreateTaskPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  describe('Rendering', () => {
    it('renders the create task form with all expected fields', () => {
      // Arrange & Act
      renderWithProviders();

      // Assert
      expect(screen.getByText('Add a Task')).toBeInTheDocument();
      expect(screen.getByText('Task Details')).toBeInTheDocument();
      expect(screen.getByLabelText(/Title/)).toBeInTheDocument();
      expect(screen.getByLabelText('Details')).toBeInTheDocument();
      expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Create Task/i })).toBeInTheDocument();
    });

    it('renders required field indicator for title', () => {
      // Arrange & Act
      renderWithProviders();

      // Assert
      const titleLabel = screen.getByText('Title');
      expect(titleLabel.querySelector('.text-destructive')).toBeInTheDocument();
      expect(titleLabel.querySelector('.text-destructive')).toHaveTextContent('*');
    });

    it.skip('sets autofocus on title input', () => {
      // Arrange & Act
      renderWithProviders();

      // Assert
      const titleInput = screen.getByLabelText(/Title/);
      expect(titleInput).toHaveAttribute('autoFocus');
    });

    it('renders form fields with correct placeholders', () => {
      // Arrange & Act
      renderWithProviders();

      // Assert
      expect(screen.getByPlaceholderText('Enter task title...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter task details (optional)')).toBeInTheDocument();
      expect(screen.getByText('Select a due date (optional)')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('displays validation errors for invalid inputs', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders();

      // Act - Submit with empty title
      const submitButton = screen.getByRole('button', { name: /Create Task/i });
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Title must be at least 2 characters long')).toBeInTheDocument();
      });
    });

    it('displays validation error for title with only 1 character', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders();

      // Act
      const titleInput = screen.getByLabelText(/Title/);
      await user.type(titleInput, 'A');

      const submitButton = screen.getByRole('button', { name: /Create Task/i });
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Title must be at least 2 characters long')).toBeInTheDocument();
      });
    });

    it('does not show validation errors for valid title', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders();

      // Act
      const titleInput = screen.getByLabelText(/Title/);
      await user.type(titleInput, 'Valid Task Title');

      const submitButton = screen.getByRole('button', { name: /Create Task/i });
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(screen.queryByText('Title must be at least 2 characters long')).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Interaction', () => {
    it('allows typing in title field', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders();

      // Act
      const titleInput = screen.getByLabelText(/Title/) as HTMLInputElement;
      await user.type(titleInput, 'My Task Title');

      // Assert
      expect(titleInput.value).toBe('My Task Title');
    });

    it('allows typing in details field', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders();

      // Act
      const detailsField = screen.getByLabelText('Details') as HTMLTextAreaElement;
      await user.type(detailsField, 'Task details here');

      // Assert
      expect(detailsField.value).toBe('Task details here');
    });

    it('opens date picker when clicking due date button', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders();

      // Act
      const dueDateButton = screen.getByText('Select a due date (optional)');
      await user.click(dueDateButton);

      // Assert
      // Calendar component should be visible (checking for common calendar elements)
      await waitFor(() => {
        // Look for calendar navigation or grid elements
        const calendarElements = document.querySelectorAll('[role="grid"], [role="button"]');
        expect(calendarElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Form Submission', () => {
    it('calls mutate with correct data when form is submitted with valid data', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders();

      // Act
      const titleInput = screen.getByLabelText(/Title/);
      const detailsField = screen.getByLabelText('Details');

      await user.type(titleInput, 'Test Task');
      await user.type(detailsField, 'Test details');

      const submitButton = screen.getByRole('button', { name: /Create Task/i });
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          title: 'Test Task',
          detail: 'Test details',
          isComplete: false,
          dueAt: undefined,
        });
      });
    });

    it('calls mutate with trimmed detail field', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders();

      // Act
      const titleInput = screen.getByLabelText(/Title/);
      const detailsField = screen.getByLabelText('Details');

      await user.type(titleInput, 'Test Task');
      await user.type(detailsField, '  Test details with spaces  ');

      const submitButton = screen.getByRole('button', { name: /Create Task/i });
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          title: 'Test Task',
          detail: 'Test details with spaces',
          isComplete: false,
          dueAt: undefined,
        });
      });
    });

    it('calls mutate with undefined detail when empty', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders();

      // Act
      const titleInput = screen.getByLabelText(/Title/);
      await user.type(titleInput, 'Test Task');

      const submitButton = screen.getByRole('button', { name: /Create Task/i });
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          title: 'Test Task',
          detail: undefined,
          isComplete: false,
          dueAt: undefined,
        });
      });
    });

    it('calls mutate with undefined detail when only whitespaces', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders();

      // Act
      const titleInput = screen.getByLabelText(/Title/);
      const detailsField = screen.getByLabelText('Details');

      await user.type(titleInput, 'Test Task');
      await user.type(detailsField, '   ');

      const submitButton = screen.getByRole('button', { name: /Create Task/i });
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          title: 'Test Task',
          detail: undefined,
          isComplete: false,
          dueAt: undefined,
        });
      });
    });

    it('does not call mutate when form validation fails', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders();

      // Act - Submit without title
      const submitButton = screen.getByRole('button', { name: /Create Task/i });
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Title must be at least 2 characters long')).toBeInTheDocument();
      });
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    it('navigates to tasks list when cancel button is clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders();

      // Act
      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      await user.click(cancelButton);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith('/tasks');
    });
  });

  describe('Loading State', () => {
    it('shows loading state when isPending is true', () => {
      // Arrange
      mockUseCreateTask.mockReturnValue({
        mutate: mockMutate,
        isPending: true,
        error: null,
      });

      // Act
      renderWithProviders();

      // Assert
      expect(screen.getByText('Creating...')).toBeInTheDocument();
      expect(screen.getByLabelText(/Title/)).toBeDisabled();
      expect(screen.getByLabelText('Details')).toBeDisabled();
      expect(screen.getByText('Select a due date (optional)')).toHaveAttribute('disabled');
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /Creating/i })).toBeDisabled();
    });

    it('shows normal state when isPending is false', () => {
      // Arrange
      mockUseCreateTask.mockReturnValue({
        mutate: mockMutate,
        isPending: false,
        error: null,
      });

      // Act
      renderWithProviders();

      // Assert
      expect(screen.getByText('Create Task')).toBeInTheDocument();
      expect(screen.getByLabelText(/Title/)).not.toBeDisabled();
      expect(screen.getByLabelText('Details')).not.toBeDisabled();
      expect(screen.getByText('Select a due date (optional)')).not.toHaveAttribute('disabled');
      expect(screen.getByRole('button', { name: /Cancel/i })).not.toBeDisabled();
      expect(screen.getByRole('button', { name: /Create Task/i })).not.toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('displays error alert when error occurs', () => {
      // Arrange
      const errorMessage = 'Failed to create task';
      mockUseCreateTask.mockReturnValue({
        mutate: mockMutate,
        isPending: false,
        error: new Error(errorMessage),
      });

      // Act
      renderWithProviders();

      // Assert
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('displays generic error message for non-Error objects', () => {
      // Arrange
      mockUseCreateTask.mockReturnValue({
        mutate: mockMutate,
        isPending: false,
        error: 'String error',
      });

      // Act
      renderWithProviders();

      // Assert
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to create task')).toBeInTheDocument();
    });

    it('does not display error alert when no error', () => {
      // Arrange
      mockUseCreateTask.mockReturnValue({
        mutate: mockMutate,
        isPending: false,
        error: null,
      });

      // Act
      renderWithProviders();

      // Assert
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      // Arrange & Act
      renderWithProviders();

      // Assert
      expect(screen.getByRole('heading', { level: 1, name: 'Add a Task' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: 'Task Details' })).toBeInTheDocument();
    });

    it('has proper form structure', () => {
      // Arrange & Act
      renderWithProviders();

      // Assert
      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();

      // Check that form controls are properly labeled
      expect(screen.getByLabelText(/Title/)).toBeInTheDocument();
      expect(screen.getByLabelText('Details')).toBeInTheDocument();
      expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
    });

    it('has proper button roles and types', () => {
      // Arrange & Act
      renderWithProviders();

      // Assert
      const submitButton = screen.getByRole('button', { name: /Create Task/i });
      const cancelButton = screen.getByRole('button', { name: /Cancel/i });

      expect(submitButton).toHaveAttribute('type', 'submit');
      expect(cancelButton).toHaveAttribute('type', 'button');
    });
  });

  describe('UI Layout', () => {
    it('applies correct container and styling classes', () => {
      // Arrange & Act
      renderWithProviders();

      // Assert
      const container = screen.getByText('Add a Task').closest('.container');
      expect(container).toHaveClass('container', 'mx-auto', 'p-4', 'max-w-3xl');

      const card = screen.getByText('Task Details').closest('.bg-card');
      expect(card).toHaveClass('bg-card', 'rounded-md', 'p-6', 'border');
    });

    it('has proper spacing between form elements', () => {
      // Arrange & Act
      renderWithProviders();

      // Assert
      const form = screen.getByRole('form');
      expect(form).toHaveClass('space-y-6');
    });
  });
});
