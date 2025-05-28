import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Header from "./Header";

// Mock the ThemeToggle component
vi.mock("../ThemeToggle/ThemeToggle", () => ({
  ThemeToggle: () => <button data-testid="mock-theme-toggle">Theme Toggle</button>,
}));

describe("Header", () => {
  beforeEach(() => {
    // Clear any theme-related classes before each test
    document.documentElement.classList.remove("dark");
  });

  it("renders the application name", () => {
    // Arrange
    render(<Header />);

    // Act
    const appName = screen.getByText("React Starter Kit");

    // Assert
    expect(appName).toBeInTheDocument();
  });

  it("renders the theme toggle button", () => {
    // Arrange
    render(<Header />);

    // Act
    const themeToggle = screen.getByTestId("mock-theme-toggle");

    // Assert
    expect(themeToggle).toBeInTheDocument();
  });
});
