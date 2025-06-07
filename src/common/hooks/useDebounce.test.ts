import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return the initial value immediately', () => {
    // Arrange & Act
    const { result } = renderHook(() => useDebounce('initial value', 500));

    // Assert
    expect(result.current).toBe('initial value');
  });

  it('should debounce value changes', () => {
    // Arrange
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial value', delay: 500 },
    });

    // Act - change value but don't advance timer yet
    rerender({ value: 'changed value', delay: 500 });

    // Assert - value should not have changed yet
    expect(result.current).toBe('initial value');

    // Act - advance timer halfway
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Assert - value should still not have changed
    expect(result.current).toBe('initial value');

    // Act - advance timer past the delay
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Assert - value should have changed
    expect(result.current).toBe('changed value');
  });

  it('should reset the timer when value changes during delay', () => {
    // Arrange
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial value', delay: 500 },
    });

    // Act - change value but don't advance timer yet
    rerender({ value: 'first change', delay: 500 });

    // Advance halfway
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Change value again, which should reset the timer
    rerender({ value: 'second change', delay: 500 });

    // Advance past the original delay, but not enough for the second delay
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Assert - should not have updated to second change yet
    expect(result.current).toBe('initial value');

    // Act - advance timer the rest of the way
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Assert - now should be updated to the second change
    expect(result.current).toBe('second change');
  });
});
