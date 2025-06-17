import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      clear: vi.fn(() => {
        store = {};
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      length: 0,
      key: vi.fn(),
    };
  })();

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('should initialize with the provided initial value when no value exists in localStorage', () => {
    // Arrange
    const key = 'testKey';
    const initialValue = { test: 'value' };

    // Act
    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    // Assert
    expect(result.current[0]).toEqual(initialValue);
    expect(localStorageMock.getItem).toHaveBeenCalledWith(key);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(key, JSON.stringify(initialValue));
  });

  it('should initialize with the value from localStorage when it exists', () => {
    // Arrange
    const key = 'testKey';
    const initialValue = { test: 'value' };
    const storedValue = { test: 'storedValue' };
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(storedValue));

    // Act
    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    // Assert
    expect(result.current[0]).toEqual(storedValue);
    expect(localStorageMock.getItem).toHaveBeenCalledWith(key);
  });

  it('should update the value in state and localStorage when setValue is called', () => {
    // Arrange
    const key = 'testKey';
    const initialValue = { test: 'value' };
    const newValue = { test: 'newValue' };

    // Act
    const { result } = renderHook(() => useLocalStorage(key, initialValue));
    act(() => {
      result.current[1](newValue);
    });

    // Assert
    expect(result.current[0]).toEqual(newValue);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(key, JSON.stringify(newValue));
  });

  it('should handle localStorage.getItem errors', () => {
    // Arrange
    const key = 'testKey';
    const initialValue = { test: 'value' };
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorageMock.getItem.mockImplementationOnce(() => {
      throw new Error('getItem error');
    });

    // Act
    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    // Assert
    expect(result.current[0]).toEqual(initialValue);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should handle localStorage.setItem errors', () => {
    // Arrange
    const key = 'testKey';
    const initialValue = { test: 'value' };
    const newValue = { test: 'newValue' };
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new Error('setItem error');
    });

    // Act
    const { result } = renderHook(() => useLocalStorage(key, initialValue));
    act(() => {
      result.current[1](newValue);
    });

    // Assert
    expect(result.current[0]).toEqual(newValue);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
