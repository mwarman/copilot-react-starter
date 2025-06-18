import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import { useCreateTask } from './useCreateTask';
import { api } from '@/common/utils/api';
import type { Task } from '@/common/models/Task';

// Mock the API
vi.mock('@/common/utils/api', () => ({
  api: {
    post: vi.fn(),
  },
}));

// Mock react-router-dom navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Type the mocked API - cast to access mock methods
const mockApi = api as unknown as {
  post: ReturnType<typeof vi.fn>;
};

describe('useCreateTask', () => {
  let queryClient: QueryClient;

  // Test wrapper component
  const createWrapper = ({ children }: { children: ReactNode }) =>
    createElement(BrowserRouter, null, createElement(QueryClientProvider, { client: queryClient }, children));

  beforeEach(() => {
    // Create a new QueryClient for each test to avoid state leakage
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

    // Clear all mocks
    vi.clearAllMocks();
  });

  it('should return a mutation object with correct properties', () => {
    // Arrange & Act
    const { result } = renderHook(() => useCreateTask(), {
      wrapper: createWrapper,
    });

    // Assert
    expect(result.current).toBeDefined();
    expect(result.current.mutate).toBeDefined();
    expect(result.current.mutateAsync).toBeDefined();
    expect(result.current.isPending).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBeUndefined();
  });

  it('should successfully create a task and navigate to tasks page', async () => {
    // Arrange
    const mockTaskData: Omit<Task, 'id'> = {
      title: 'Test Task',
      detail: 'Test task description',
      isComplete: false,
      dueAt: '2025-12-31T23:59:59Z',
    };

    const mockCreatedTask: Task = {
      id: '123',
      ...mockTaskData,
    };

    mockApi.post.mockResolvedValueOnce({ data: mockCreatedTask });

    const { result } = renderHook(() => useCreateTask(), {
      wrapper: createWrapper,
    });

    // Act
    result.current.mutate(mockTaskData);

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApi.post).toHaveBeenCalledWith('/tasks', mockTaskData);
    expect(mockApi.post).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(mockCreatedTask);
    expect(mockNavigate).toHaveBeenCalledWith('/tasks');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('should invalidate tasks query on successful creation', async () => {
    // Arrange
    const mockTaskData: Omit<Task, 'id'> = {
      title: 'Test Task',
      detail: 'Test task description',
      isComplete: false,
    };

    const mockCreatedTask: Task = {
      id: '456',
      ...mockTaskData,
    };

    mockApi.post.mockResolvedValueOnce({ data: mockCreatedTask });

    // Spy on queryClient methods
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useCreateTask(), {
      wrapper: createWrapper,
    });

    // Act
    result.current.mutate(mockTaskData);

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['tasks'] });
    expect(invalidateQueriesSpy).toHaveBeenCalledTimes(1);
  });

  it('should handle API errors correctly', async () => {
    // Arrange
    const mockTaskData: Omit<Task, 'id'> = {
      title: 'Test Task',
      isComplete: false,
    };

    const mockError = new Error('Failed to create task');
    mockApi.post.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useCreateTask(), {
      wrapper: createWrapper,
    });

    // Act
    result.current.mutate(mockTaskData);

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(mockError);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should create task with minimal required fields', async () => {
    // Arrange
    const mockTaskData: Omit<Task, 'id'> = {
      title: 'Minimal Task',
      isComplete: false,
    };

    const mockCreatedTask: Task = {
      id: '789',
      ...mockTaskData,
    };

    mockApi.post.mockResolvedValueOnce({ data: mockCreatedTask });

    const { result } = renderHook(() => useCreateTask(), {
      wrapper: createWrapper,
    });

    // Act
    result.current.mutate(mockTaskData);

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApi.post).toHaveBeenCalledWith('/tasks', mockTaskData);
    expect(result.current.data).toEqual(mockCreatedTask);
  });

  it('should handle task creation with all optional fields', async () => {
    // Arrange
    const mockTaskData: Omit<Task, 'id'> = {
      title: 'Complete Task',
      detail: 'This task has all optional fields filled',
      isComplete: true,
      dueAt: '2025-06-30T12:00:00Z',
    };

    const mockCreatedTask: Task = {
      id: '999',
      ...mockTaskData,
    };

    mockApi.post.mockResolvedValueOnce({ data: mockCreatedTask });

    const { result } = renderHook(() => useCreateTask(), {
      wrapper: createWrapper,
    });

    // Act
    result.current.mutate(mockTaskData);

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApi.post).toHaveBeenCalledWith('/tasks', mockTaskData);
    expect(result.current.data).toEqual(mockCreatedTask);
    expect(mockNavigate).toHaveBeenCalledWith('/tasks');
  });

  it('should handle network errors appropriately', async () => {
    // Arrange
    const mockTaskData: Omit<Task, 'id'> = {
      title: 'Network Error Task',
      isComplete: false,
    };

    const networkError = new Error('Network Error');
    networkError.name = 'NetworkError';
    mockApi.post.mockRejectedValueOnce(networkError);

    const { result } = renderHook(() => useCreateTask(), {
      wrapper: createWrapper,
    });

    // Act
    result.current.mutate(mockTaskData);

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(networkError);
    expect(result.current.isPending).toBe(false);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should set isPending to true during mutation', async () => {
    // Arrange
    const mockTaskData: Omit<Task, 'id'> = {
      title: 'Pending Task',
      isComplete: false,
    };

    // Create a promise that we can control
    let resolvePromise: (value: { data: Task }) => void;
    const controlledPromise = new Promise<{ data: Task }>((resolve) => {
      resolvePromise = resolve;
    });

    mockApi.post.mockReturnValueOnce(controlledPromise);

    const { result } = renderHook(() => useCreateTask(), {
      wrapper: createWrapper,
    });

    // Act
    result.current.mutate(mockTaskData);

    // Assert - should be pending
    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    // Resolve the promise
    resolvePromise!({ data: { id: '111', ...mockTaskData } });

    // Assert - should no longer be pending
    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('should use mutateAsync method successfully', async () => {
    // Arrange
    const mockTaskData: Omit<Task, 'id'> = {
      title: 'Async Task',
      isComplete: false,
    };

    const mockCreatedTask: Task = {
      id: '555',
      ...mockTaskData,
    };

    mockApi.post.mockResolvedValueOnce({ data: mockCreatedTask });

    const { result } = renderHook(() => useCreateTask(), {
      wrapper: createWrapper,
    });

    // Act
    const promise = result.current.mutateAsync(mockTaskData);

    // Assert
    await expect(promise).resolves.toEqual(mockCreatedTask);
    expect(mockApi.post).toHaveBeenCalledWith('/tasks', mockTaskData);
    expect(mockNavigate).toHaveBeenCalledWith('/tasks');
  });

  it('should handle mutateAsync errors correctly', async () => {
    // Arrange
    const mockTaskData: Omit<Task, 'id'> = {
      title: 'Async Error Task',
      isComplete: false,
    };

    const mockError = new Error('Async operation failed');
    mockApi.post.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useCreateTask(), {
      wrapper: createWrapper,
    });

    // Act
    const promise = result.current.mutateAsync(mockTaskData);

    // Assert
    await expect(promise).rejects.toThrow('Async operation failed');
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
