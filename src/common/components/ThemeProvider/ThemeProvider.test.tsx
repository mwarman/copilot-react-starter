import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { ThemeProvider, useTheme } from "./ThemeProvider";

// Test component that uses the useTheme hook
const TestComponent = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <button data-testid="toggle-theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        Toggle Theme
      </button>
      <button data-testid="set-system-theme" onClick={() => setTheme("system")}>
        Set System Theme
      </button>
    </div>
  );
};

describe("ThemeProvider component", () => {
  beforeEach(() => {
    // Clear local storage and DOM before each test
    localStorage.clear();
    document.documentElement.classList.remove("light", "dark");

    // Mock matchMedia
    Object.defineProperty(window, "matchMedia", {
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
      configurable: true,
    });
  });

  test("provides theme context to children", () => {
    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId("current-theme")).toHaveTextContent("light");
  });

  test("updates theme when setTheme is called", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>
    );

    // Initial theme should be light
    expect(screen.getByTestId("current-theme")).toHaveTextContent("light");

    // Toggle theme to dark
    await user.click(screen.getByTestId("toggle-theme"));

    // Theme should now be dark
    expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    // Check localStorage was updated
    expect(localStorage.getItem("vite-ui-theme")).toBe("dark");
  });

  test("loads theme from localStorage", () => {
    // Set initial theme in localStorage
    localStorage.setItem("vite-ui-theme", "dark");

    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>
    );

    // Theme should be loaded from localStorage
    expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
