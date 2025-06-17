import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return the initial value immediately', () => {
    // Arrange
    const initialValue = 'test';
    const delay = 300;

    // Act
    const { result } = renderHook(() => useDebounce(initialValue, delay));

    // Assert
    expect(result.current).toBe('test');
  });

  it('should debounce the value after the specified delay', () => {
    // Arrange
    const initialValue = 'initial';
    const updatedValue = 'updated';
    const delay = 300;
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: initialValue, delay },
    });

    // Assert initial value
    expect(result.current).toBe(initialValue);

    // Act - Update the value
    rerender({ value: updatedValue, delay });

    // Assert - Value should not have changed immediately
    expect(result.current).toBe(initialValue);

    // Act - Advance timers
    act(() => {
      vi.advanceTimersByTime(delay);
    });

    // Assert - Value should have changed after the delay
    expect(result.current).toBe(updatedValue);
  });

  it('should reset the timer when the value changes during delay', () => {
    // Arrange
    const initialValue = 'initial';
    const intermediateValue = 'intermediate';
    const finalValue = 'final';
    const delay = 300;
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: initialValue, delay },
    });

    // Act - Update the value to intermediate
    rerender({ value: intermediateValue, delay });

    // Act - Advance timers partially
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Assert - Value should not have changed yet
    expect(result.current).toBe(initialValue);

    // Act - Update again before first debounce completes
    rerender({ value: finalValue, delay });

    // Act - Advance timers partially again
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Assert - Value should still not have changed
    expect(result.current).toBe(initialValue);

    // Act - Complete the final timer
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Assert - Value should now be the final value
    expect(result.current).toBe(finalValue);
  });
});
