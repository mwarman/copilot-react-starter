import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetTask } from './useGetTask';
import { api } from '../../../common/utils/api';
import type { Task } from '../../../common/models/Task';
import type { ReactNode } from 'react';

// Mock the API module
vi.mock('../../../common/utils/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

// Test wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useGetTask', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch task successfully', async () => {
    // Arrange
    const mockTask: Task = {
      id: '1',
      title: 'Test Task',
      detail: 'Test task detail',
      isComplete: false,
      dueAt: '2025-06-20T10:00:00Z',
    };

    vi.mocked(api.get).mockResolvedValueOnce({ data: mockTask });

    // Act
    const { result } = renderHook(() => useGetTask('1'), {
      wrapper: createWrapper(),
    });

    // Assert
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockTask);
    expect(vi.mocked(api.get)).toHaveBeenCalledWith('/tasks/1');
  });

  it('should handle error when task is not found', async () => {
    // Arrange
    const mockError = new Error('Task not found');
    vi.mocked(api.get).mockRejectedValueOnce(mockError);

    // Act
    const { result } = renderHook(() => useGetTask('nonexistent'), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
    expect(vi.mocked(api.get)).toHaveBeenCalledWith('/tasks/nonexistent');
  });

  it('should handle HTTP 404 error specifically', async () => {
    // Arrange
    const mockError = new Error('Request failed with status code 404');
    vi.mocked(api.get).mockRejectedValueOnce(mockError);

    // Act
    const { result } = renderHook(() => useGetTask('404-task'), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
    expect(result.current.error?.message).toContain('404');
    expect(vi.mocked(api.get)).toHaveBeenCalledWith('/tasks/404-task');
  });

  it('should not fetch when taskId is empty', () => {
    // Act
    const { result } = renderHook(() => useGetTask(''), {
      wrapper: createWrapper(),
    });

    // Assert
    expect(result.current.isLoading).toBe(false);
    expect(result.current.fetchStatus).toBe('idle');
    expect(vi.mocked(api.get)).not.toHaveBeenCalled();
  });

  it('should not fetch when taskId is undefined', () => {
    // Act
    const { result } = renderHook(() => useGetTask(undefined as unknown as string), {
      wrapper: createWrapper(),
    });

    // Assert
    expect(result.current.isLoading).toBe(false);
    expect(result.current.fetchStatus).toBe('idle');
    expect(vi.mocked(api.get)).not.toHaveBeenCalled();
  });

  it('should use correct query key', async () => {
    // Arrange
    const mockTask: Task = {
      id: '123',
      title: 'Test Task',
      isComplete: false,
    };

    vi.mocked(api.get).mockResolvedValueOnce({ data: mockTask });

    // Act
    const { result } = renderHook(() => useGetTask('123'), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify the query key is correctly set
    expect(result.current.data).toEqual(mockTask);
    expect(vi.mocked(api.get)).toHaveBeenCalledWith('/tasks/123');
  });
});
