import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DeleteTaskButton } from './DeleteTaskButton';

const mockNavigate = vi.fn();
const mockMutateAsync = vi.fn();

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the delete hook
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
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe('DeleteTaskButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders delete button with correct text and icon', () => {
    // Arrange & Act
    render(<DeleteTaskButton taskId="task-1" taskTitle="Test Task" />, { wrapper: createWrapper() });

    // Assert
    const deleteButton = screen.getByRole('button', { name: /delete test task/i });
    expect(deleteButton).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('opens confirmation dialog when delete button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<DeleteTaskButton taskId="task-1" taskTitle="Test Task" />, { wrapper: createWrapper() });

    // Act
    const deleteButton = screen.getByRole('button', { name: /delete test task/i });
    await user.click(deleteButton);

    // Assert
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText('Delete Task')).toBeInTheDocument();
    expect(screen.getByText(/are you sure you want to delete "Test Task"/i)).toBeInTheDocument();
  });

  it('calls delete mutation and navigates when confirmed', async () => {
    // Arrange
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValue({});

    render(<DeleteTaskButton taskId="task-1" taskTitle="Test Task" />, { wrapper: createWrapper() });

    // Act
    const deleteButton = screen.getByRole('button', { name: /delete test task/i });
    await user.click(deleteButton);

    const confirmButton = screen.getByRole('button', { name: 'Delete' });
    await user.click(confirmButton);

    // Assert
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({ taskId: 'task-1' });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/tasks');
    });
  });

  it('closes dialog when cancel is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<DeleteTaskButton taskId="task-1" taskTitle="Test Task" />, { wrapper: createWrapper() });

    // Act
    const deleteButton = screen.getByRole('button', { name: /delete test task/i });
    await user.click(deleteButton);

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    // Assert
    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  });

  it('shows destructive styling', () => {
    // Arrange & Act
    render(<DeleteTaskButton taskId="task-1" taskTitle="Test Task" />, { wrapper: createWrapper() });

    // Assert
    const deleteButton = screen.getByRole('button', { name: /delete test task/i });
    expect(deleteButton).toHaveClass('bg-destructive');
  });
});
