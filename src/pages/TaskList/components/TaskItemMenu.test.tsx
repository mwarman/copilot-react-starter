import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TaskItemMenu } from './TaskItemMenu';

// Mock the delete hook
const mockMutateAsync = vi.fn();
vi.mock('@/common/hooks/useDeleteTask', () => ({
  useDeleteTask: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

// Mock the sonner toast functions
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('TaskItemMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders more actions button', () => {
    // Arrange & Act
    render(<TaskItemMenu taskId="task-1" taskTitle="Test Task" />, { wrapper: createWrapper() });

    // Assert
    expect(screen.getByRole('button', { name: /more actions for test task/i })).toBeInTheDocument();
  });

  it('opens dropdown menu when clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<TaskItemMenu taskId="task-1" taskTitle="Test Task" />, { wrapper: createWrapper() });

    // Act
    const menuButton = screen.getByRole('button', { name: /more actions/i });
    await user.click(menuButton);

    // Assert
    expect(screen.getByRole('menuitem', { name: /delete task/i })).toBeInTheDocument();
  });

  it('opens confirmation dialog when delete is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<TaskItemMenu taskId="task-1" taskTitle="Test Task" />, { wrapper: createWrapper() });

    // Act
    const menuButton = screen.getByRole('button', { name: /more actions/i });
    await user.click(menuButton);

    const deleteButton = screen.getByRole('menuitem', { name: /delete task/i });
    await user.click(deleteButton);

    // Assert
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText('Delete Task')).toBeInTheDocument();
    expect(screen.getByText(/are you sure you want to delete "Test Task"/i)).toBeInTheDocument();
  });

  it('calls delete mutation when confirmed', async () => {
    // Arrange
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValue({});

    render(<TaskItemMenu taskId="task-1" taskTitle="Test Task" />, { wrapper: createWrapper() });

    // Act
    const menuButton = screen.getByRole('button', { name: /more actions/i });
    await user.click(menuButton);

    const deleteMenuItem = screen.getByRole('menuitem', { name: /delete task/i });
    await user.click(deleteMenuItem);

    const confirmButton = screen.getByRole('button', { name: 'Delete' });
    await user.click(confirmButton);

    // Assert
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({ taskId: 'task-1' });
    });
  });

  it('closes dialog when cancel is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<TaskItemMenu taskId="task-1" taskTitle="Test Task" />, { wrapper: createWrapper() });

    // Act
    const menuButton = screen.getByRole('button', { name: /more actions/i });
    await user.click(menuButton);

    const deleteButton = screen.getByRole('menuitem', { name: /delete task/i });
    await user.click(deleteButton);

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    // Assert
    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  });
});
