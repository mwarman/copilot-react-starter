import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useIsMobile } from "./use-mobile";

describe("useIsMobile", () => {
  // Store original implementation of matchMedia and innerWidth
  const originalMatchMedia = window.matchMedia;
  const originalInnerWidth = window.innerWidth;

  // Mock for matchMedia with add/removeEventListener
  const createMatchMedia = (matches: boolean) => {
    return (query: string) =>
      ({
        matches,
        media: query,
        addEventListener: vi.fn((_event, listener) => listener()),
        removeEventListener: vi.fn(),
        // Additional properties to match MediaQueryList interface
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(() => true),
      } as unknown as MediaQueryList);
  };

  // Cleanup after each test
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: originalInnerWidth,
    });
    vi.restoreAllMocks();
  });

  it("should return true when window width is less than mobile breakpoint", () => {
    // Arrange - set window width to a mobile size (less than 768px)
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 767,
    });
    window.matchMedia = createMatchMedia(true);

    // Act
    const { result } = renderHook(() => useIsMobile());

    // Assert
    expect(result.current).toBe(true);
  });

  it("should return false when window width is equal to or greater than mobile breakpoint", () => {
    // Arrange - set window width to a desktop size (equal to or greater than 768px)
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 768,
    });
    window.matchMedia = createMatchMedia(false);

    // Act
    const { result } = renderHook(() => useIsMobile());

    // Assert
    expect(result.current).toBe(false);
  });

  it("should update when media query changes", () => {
    // Arrange - set initial window width to desktop size
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024,
    });

    // Create a more sophisticated mock that can trigger changes
    const listeners = new Map();
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: window.innerWidth < 768,
      media: query,
      addEventListener: (event: string, listener: () => void) => {
        listeners.set(event, listener);
      },
      removeEventListener: (event: string) => {
        listeners.delete(event);
      },
    }));

    // Act - render the hook
    const { result, rerender } = renderHook(() => useIsMobile());

    // Assert - initially not mobile
    expect(result.current).toBe(false);

    // Act - change window size to mobile and trigger media query change
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 600,
    });

    // Simulate the media query change event
    const changeListener = listeners.get("change");
    if (changeListener) changeListener();
    rerender();

    // Assert - should now be mobile
    expect(result.current).toBe(true);
  });
});
