import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Header from "./Header";

// Mock the ThemeToggle component
vi.mock("../ThemeToggle/ThemeToggle", () => ({
  ThemeToggle: () => <button data-testid="mock-theme-toggle">Theme Toggle</button>,
}));

// Wrap the component with BrowserRouter for Link components
const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe("Header", () => {
  beforeEach(() => {
    // Clear any theme-related classes before each test
    document.documentElement.classList.remove("dark");
  });

  it("renders the application name", () => {
    // Arrange
    renderWithRouter(<Header />);

    // Act
    const appName = screen.getByText("React Starter Kit");

    // Assert
    expect(appName).toBeInTheDocument();
  });

  it("renders the theme toggle button", () => {
    // Arrange
    renderWithRouter(<Header />);

    // Act
    const themeToggle = screen.getByTestId("mock-theme-toggle");

    // Assert
    expect(themeToggle).toBeInTheDocument();
  });

  it("renders the documentation link", () => {
    // Arrange
    renderWithRouter(<Header />);

    // Act
    const documentationLink = screen.getByTestId("header-documentation-link");

    // Assert
    expect(documentationLink).toBeInTheDocument();
    expect(documentationLink).toHaveAttribute("href", "/documentation");
    expect(documentationLink).toHaveTextContent("Documentation");
  });
});
