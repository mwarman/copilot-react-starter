import { render, screen, waitFor } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { CreateTaskForm } from './CreateTaskForm';
import { useCreateTask } from '../hooks/useCreateTask';
import { useNavigate } from 'react-router-dom';

// Mock the hooks
vi.mock('../hooks/useCreateTask', () => ({
  useCreateTask: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

describe('CreateTaskForm', () => {
  const mockNavigate = vi.fn();
  const mockMutate = vi.fn();

  // Helper function to setup a user event
  const setupUserEvent = () => userEvent.setup();

  // Helper function to render the component
  const renderCreateTaskForm = (): RenderResult => {
    return render(<CreateTaskForm />);
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mock implementations
    // @ts-expect-error - Mocking hook
    useNavigate.mockReturnValue(mockNavigate);
    // @ts-expect-error - Mocking hook
    useCreateTask.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      error: null,
    });
  });

  it('renders the form fields correctly', () => {
    // Arrange
    // Default mock setup is done in beforeEach

    // Act
    renderCreateTaskForm();

    // Assert
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/detail/i)).toBeInTheDocument();
    expect(screen.getByText(/select a due date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
  });

  it('navigates back when cancel button is clicked', async () => {
    // Arrange
    const user = setupUserEvent();

    // Act
    renderCreateTaskForm();
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/tasks');
  });

  it('displays validation errors when form is submitted with invalid data', async () => {
    // Arrange
    const user = setupUserEvent();

    // Act
    renderCreateTaskForm();
    await user.click(screen.getByRole('button', { name: /create task/i }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/title must be at least 2 characters long/i)).toBeInTheDocument();
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('submits the form with valid data', async () => {
    // Arrange
    const user = setupUserEvent();
    const taskData = {
      title: 'Test Task',
      detail: 'This is a test task',
    };

    // Act
    renderCreateTaskForm();
    await user.type(screen.getByLabelText(/title/i), taskData.title);
    await user.type(screen.getByLabelText(/detail/i), taskData.detail);
    await user.click(screen.getByRole('button', { name: /create task/i }));

    // Assert
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(expect.objectContaining(taskData), expect.anything());
    });
  });

  it('displays error message when API request fails', async () => {
    // Arrange
    const errorMessage = 'API Error';
    // @ts-expect-error - Mocking hook
    useCreateTask.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: true,
      error: new Error(errorMessage),
    });

    // Act
    renderCreateTaskForm();

    // Assert
    expect(screen.getByText(new RegExp(errorMessage, 'i'))).toBeInTheDocument();
  });

  it('disables submit button when form is submitting', async () => {
    // Arrange
    // @ts-expect-error - Mocking hook
    useCreateTask.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      isError: false,
      error: null,
    });

    // Act
    renderCreateTaskForm();

    // Assert
    const submitButton = screen.getByRole('button', { name: /creating\.\.\./i });
    expect(submitButton).toBeDisabled();
  });
});
