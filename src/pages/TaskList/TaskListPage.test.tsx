import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TaskListPage from './TaskListPage';
import { useGetTasks } from './hooks/useGetTasks';

// Mock the useGetTasks hook
vi.mock('./hooks/useGetTasks', () => ({
  useGetTasks: vi.fn(),
}));

describe('TaskListPage', () => {
  // Create a new QueryClient for each test
  const createWrapper = () => {
    // Arrange - Create QueryClient with default options
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  it('displays loading state', () => {
    // Arrange
    vi.mocked(useGetTasks).mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useGetTasks>);

    // Act
    render(<TaskListPage />, { wrapper: createWrapper() });

    // Assert
    expect(screen.getByText('My Tasks')).toBeInTheDocument();
    // Check for loading skeletons (looking for multiple elements with the animate-pulse class)
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('displays error state', () => {
    // Arrange
    vi.mocked(useGetTasks).mockReturnValue({
      isLoading: false,
      isError: true,
      data: undefined,
      error: new Error('Failed to fetch tasks'),
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useGetTasks>);

    // Act
    render(<TaskListPage />, { wrapper: createWrapper() });

    // Assert
    expect(screen.getByText('My Tasks')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch tasks')).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });

  it('displays empty state when no tasks', () => {
    // Arrange
    const mockUseGetTasks = useGetTasks as unknown as ReturnType<typeof vi.fn>;
    mockUseGetTasks.mockReturnValue({
      isLoading: false,
      isError: false,
      data: [],
      status: 'success',
      isPending: false,
      error: null,
      fetchStatus: 'idle',
      isPlaceholderData: false,
      isFetched: true,
      isFetching: false,
      isPaused: false,
      isRefetching: false,
      isSuccess: true,
      refetch: vi.fn(),
    });

    // Act
    render(<TaskListPage />, { wrapper: createWrapper() });

    // Assert
    expect(screen.getByText('My Tasks')).toBeInTheDocument();
    expect(screen.getByText('No tasks found')).toBeInTheDocument();
  });

  it('displays tasks when data is available', () => {
    // Arrange
    const mockUseGetTasks = useGetTasks as unknown as ReturnType<typeof vi.fn>;
    mockUseGetTasks.mockReturnValue({
      isLoading: false,
      isError: false,
      data: [
        {
          id: '1',
          title: 'Task 1',
          detail: 'Detail 1',
          isComplete: false,
          dueAt: '2025-06-20T12:00:00Z',
        },
        {
          id: '2',
          title: 'Task 2',
          isComplete: true,
        },
      ],
      status: 'success',
      isPending: false,
      error: null,
      fetchStatus: 'idle',
      isPlaceholderData: false,
      isFetched: true,
      isFetching: false,
      isPaused: false,
      isRefetching: false,
      isSuccess: true,
      refetch: vi.fn(),
    });

    // Act
    render(<TaskListPage />, { wrapper: createWrapper() });

    // Assert
    expect(screen.getByText('My Tasks')).toBeInTheDocument();
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Detail 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });
});
