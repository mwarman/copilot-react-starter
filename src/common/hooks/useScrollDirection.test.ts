import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useScrollDirection } from './useScrollDirection';

// Mock requestAnimationFrame
const mockRequestAnimationFrame = vi.fn((callback) => {
  callback();
  return 1;
});

Object.defineProperty(window, 'requestAnimationFrame', {
  value: mockRequestAnimationFrame,
  writable: true,
});

describe('useScrollDirection', () => {
  beforeEach(() => {
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
    });

    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up event listeners
    window.removeEventListener('scroll', () => {});
  });

  it('should initialize with default values', () => {
    // Arrange & Act
    const { result } = renderHook(() => useScrollDirection());

    // Assert
    expect(result.current.scrollDirection).toBe('up');
    expect(result.current.isVisible).toBe(true);
  });

  it('should detect scroll down direction', () => {
    // Arrange
    const { result } = renderHook(() => useScrollDirection());

    // Act
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    // Assert
    expect(result.current.scrollDirection).toBe('down');
    expect(result.current.isVisible).toBe(true); // Still visible since < 100px
  });

  it('should hide header when scrolling down past threshold', () => {
    // Arrange
    const { result } = renderHook(() => useScrollDirection());

    // Act
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 150, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    // Assert
    expect(result.current.scrollDirection).toBe('down');
    expect(result.current.isVisible).toBe(false);
  });

  it('should show header when scrolling up', () => {
    // Arrange
    const { result } = renderHook(() => useScrollDirection());

    // First scroll down
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 150, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    // Act - scroll up
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    // Assert
    expect(result.current.scrollDirection).toBe('up');
    expect(result.current.isVisible).toBe(true);
  });

  it('should respect custom threshold', () => {
    // Arrange
    const customThreshold = 20;
    const { result } = renderHook(() => useScrollDirection(customThreshold));

    // Act - scroll less than threshold
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 10, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    // Assert - should not change direction
    expect(result.current.scrollDirection).toBe('up');
  });
});
