import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { ThemeToggle } from "./ThemeToggle";

// Mock the useTheme hook with a simple implementation
const mockSetTheme = vi.fn();
vi.mock("../ThemeProvider/ThemeProvider", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: mockSetTheme,
  }),
}));

describe("ThemeToggle component", () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockSetTheme.mockClear();
  });

  test("renders the theme toggle button", () => {
    render(<ThemeToggle />);

    const themeButton = screen.getByTestId("theme-toggle");
    expect(themeButton).toBeInTheDocument();
  });

  test("toggles the theme when clicked", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    const themeButton = screen.getByTestId("theme-toggle");
    await user.click(themeButton);

    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  test("has the correct hover styles", () => {
    render(<ThemeToggle />);

    const themeButton = screen.getByTestId("theme-toggle");
    expect(themeButton.className).toContain("hover:bg-slate-600/50");
    expect(themeButton.className).toContain("dark:hover:bg-slate-700/50");
  });
});
