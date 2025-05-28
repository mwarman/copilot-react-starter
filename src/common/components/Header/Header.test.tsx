import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
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
  const toggleSidebar = vi.fn();

  beforeEach(() => {
    // Clear any theme-related classes before each test
    document.documentElement.classList.remove("dark");
    // Reset the mock function before each test
    toggleSidebar.mockReset();
  });

  it("renders the application name", () => {
    // Arrange
    renderWithRouter(<Header toggleSidebar={toggleSidebar} />);

    // Act
    const appName = screen.getByText("React Starter Kit");

    // Assert
    expect(appName).toBeInTheDocument();
  });

  it("renders the theme toggle button", () => {
    // Arrange
    renderWithRouter(<Header toggleSidebar={toggleSidebar} />);

    // Act
    const themeToggle = screen.getByTestId("mock-theme-toggle");

    // Assert
    expect(themeToggle).toBeInTheDocument();
  });

  it("renders the documentation link", () => {
    // Arrange
    renderWithRouter(<Header toggleSidebar={toggleSidebar} />);

    // Act
    const documentationLink = screen.getByTestId("header-documentation-link");

    // Assert
    expect(documentationLink).toBeInTheDocument();
    expect(documentationLink).toHaveAttribute("href", "/documentation");
    expect(documentationLink).toHaveTextContent("Documentation");
  });

  it("calls toggleSidebar when sidebar toggle button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithRouter(<Header toggleSidebar={toggleSidebar} />);

    // Act
    await user.click(screen.getByTestId("sidebar-toggle"));

    // Assert
    expect(toggleSidebar).toHaveBeenCalledTimes(1);
  });
});
