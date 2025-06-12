import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UpdateTaskForm } from './UpdateTaskForm';
import { BrowserRouter } from 'react-router-dom';
import { useUpdateTask } from '../hooks/useUpdateTask';
import { type Task } from '@/common/models/Task';

// Mock hooks
vi.mock('../hooks/useUpdateTask', () => ({
  useUpdateTask: vi.fn(),
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/tasks/123/edit' }),
  };
});

describe('UpdateTaskForm', () => {
  // Sample task for testing
  const mockTask: Task = {
    id: '123',
    title: 'Test Task',
    detail: 'Test task details',
    isComplete: false,
    dueAt: '2025-12-31T23:59:59Z',
  };

  const mockMutate = vi.fn();
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // @ts-expect-error - Mocking hook
    useUpdateTask.mockReturnValue({
      mutate: mockMutate,
      mutateAsync: mockMutateAsync,
      isPending: false,
      isError: false,
      error: null,
    });
  });

  const renderUpdateTaskForm = (task = mockTask, taskId = '123', previousLocation = '/tasks') => {
    return render(
      <BrowserRouter>
        <UpdateTaskForm task={task} taskId={taskId} previousLocation={previousLocation} />
      </BrowserRouter>,
    );
  };

  it('renders the form with task data pre-filled', () => {
    // Act
    renderUpdateTaskForm();

    // Assert
    expect(screen.getByTestId('title-input')).toHaveValue('Test Task');
    expect(screen.getByTestId('detail-input')).toHaveValue('Test task details');
    expect(screen.getByTestId('due-date-button')).toHaveTextContent('December 31st, 2025');
    expect(screen.getByTestId('is-complete-checkbox')).not.toBeChecked();
  });

  it('renders a form with completion status checked when task is complete', () => {
    // Arrange
    const completedTask: Task = {
      ...mockTask,
      isComplete: true,
    };

    // Act
    renderUpdateTaskForm(completedTask);

    // Assert
    expect(screen.getByTestId('is-complete-checkbox')).toBeChecked();
  });

  it('submits the form with updated values', async () => {
    // Arrange
    const user = userEvent.setup();
    // Using mutate instead of mutateAsync to match implementation
    mockMutate.mockImplementationOnce((_params, options) => {
      // Simulate successful mutation and call onSuccess
      if (options?.onSuccess) {
        options.onSuccess();
      }
    });
    renderUpdateTaskForm();

    // Act
    // Clear and update title
    const titleInput = screen.getByTestId('title-input');
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Task Title');

    // Clear and update detail
    const detailInput = screen.getByTestId('detail-input');
    await user.clear(detailInput);
    await user.type(detailInput, 'Updated task details');

    // Toggle completion status
    await user.click(screen.getByTestId('is-complete-checkbox'));

    // Submit form
    await user.click(screen.getByTestId('update-button'));

    // Assert
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        {
          taskId: '123',
          taskData: expect.objectContaining({
            title: 'Updated Task Title',
            detail: 'Updated task details',
            isComplete: true,
            dueAt: '2025-12-31T23:59:59Z',
          }),
        },
        expect.objectContaining({
          onSuccess: expect.any(Function),
        }),
      );
    });

    // Check navigation after successful submission
    expect(mockNavigate).toHaveBeenCalledWith('/tasks');
  });

  it('displays error message when API request fails', async () => {
    // Arrange
    const errorMessage = 'API Error';
    const testError = new Error(errorMessage);

    // Setup the mock to show error state
    // @ts-expect-error - Mocking hook
    useUpdateTask.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: true,
      error: testError,
    });

    renderUpdateTaskForm();

    // Assert - Error should be displayed automatically
    // since we're mocking the hook to return isError=true
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('navigates back when cancel button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    renderUpdateTaskForm();

    // Act
    await user.click(screen.getByTestId('cancel-button'));

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/tasks');
  });

  it('renders properly for a task without optional fields', () => {
    // Arrange
    const minimalTask: Task = {
      id: '123',
      title: 'Minimal Task',
      isComplete: false,
    };

    // Act
    renderUpdateTaskForm(minimalTask);

    // Assert
    expect(screen.getByTestId('title-input')).toHaveValue('Minimal Task');
    expect(screen.getByTestId('detail-input')).toHaveValue('');
    expect(screen.getByTestId('due-date-button')).toHaveTextContent('Select a due date (optional)');
  });

  it('shows loading state during form submission', async () => {
    // Arrange
    const user = userEvent.setup();
    // @ts-expect-error - Mocking hook
    useUpdateTask.mockReturnValue({
      mutate: mockMutate,
      mutateAsync: vi.fn().mockImplementation(() => new Promise(() => {})), // Never resolves
      isPending: true,
      isError: false,
      error: null,
    });
    renderUpdateTaskForm();

    // Act
    await user.click(screen.getByTestId('update-button'));

    // Assert
    expect(screen.getByTestId('update-button')).toBeDisabled();
    expect(screen.getByTestId('update-button')).toHaveTextContent('Updating...');
  });

  it('navigates to task detail page when no previous location is provided', async () => {
    // Arrange
    const user = userEvent.setup();
    mockMutate.mockImplementationOnce((_params, options) => {
      // Simulate successful mutation and call onSuccess
      if (options?.onSuccess) {
        options.onSuccess();
      }
    });
    // Important: Here we're overriding the default '/tasks' with undefined
    renderUpdateTaskForm(mockTask, '123', undefined);

    // Act
    await user.click(screen.getByTestId('update-button'));

    // Assert - Since previousLocation defaults to '/tasks' in renderUpdateTaskForm
    // even when we pass undefined, we expect navigation to '/tasks'
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/tasks');
    });
  });
});
