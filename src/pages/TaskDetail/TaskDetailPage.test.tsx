import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TaskDetailPage from './TaskDetailPage';
import { api } from '../../common/utils/api';
import type { Task } from '../../common/models/Task';

// Mock the API module
vi.mock('../../common/utils/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('TaskDetailPage', () => {
  const createWrapper = (taskId = '1') => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    return () => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[`/tasks/${taskId}`]}>
          <Routes>
            <Route path="/tasks/:taskId" element={<TaskDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display task details when loaded successfully', async () => {
    // Arrange
    const mockTask: Task = {
      id: '1',
      title: 'Test Task Title',
      detail: 'This is a detailed description of the test task.',
      isComplete: false,
      dueAt: '2025-06-20T10:00:00Z',
    };

    vi.mocked(api.get).mockResolvedValueOnce({ data: mockTask });

    // Act
    const Wrapper = createWrapper();
    render(<Wrapper />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Test Task Title')).toBeInTheDocument();
    });

    expect(screen.getByText('This is a detailed description of the test task.')).toBeInTheDocument();
    expect(screen.getByText('Jun 20, 2025')).toBeInTheDocument();
    expect(screen.getByText('Incomplete')).toBeInTheDocument();
  });

  it('should display not found state when task is not found', async () => {
    // Arrange
    const error = new Error('Request failed with status code 404');
    vi.mocked(api.get).mockRejectedValueOnce(error);

    // Act
    const Wrapper = createWrapper();
    render(<Wrapper />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Task Not Found')).toBeInTheDocument();
    });

    expect(
      screen.getByText('The task you are looking for does not exist or may have been deleted.'),
    ).toBeInTheDocument();
  });
});
