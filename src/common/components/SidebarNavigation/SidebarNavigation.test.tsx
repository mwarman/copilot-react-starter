import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import SidebarNavigation from "./SidebarNavigation";

// Define types for the mock components
interface SidebarProps {
  className?: string;
  children?: React.ReactNode;
  "data-testid"?: string;
}

interface SidebarHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

interface SidebarContentProps {
  className?: string;
  children?: React.ReactNode;
}

interface SidebarGroupProps {
  title: string;
  defaultOpen?: boolean;
  children?: React.ReactNode;
}

interface SidebarTriggerProps {
  onClick?: () => void;
  className?: string;
  "aria-label"?: string;
  children?: React.ReactNode;
}

// Mock sidebar components to simplify testing
vi.mock("../Sidebar/Sidebar", () => ({
  Sidebar: ({ className, children, "data-testid": testId }: SidebarProps) => (
    <div data-testid={testId} className={className}>
      {children}
    </div>
  ),
  SidebarHeader: ({ className, children }: SidebarHeaderProps) => (
    <div data-testid="sidebar-header" className={className}>
      {children}
    </div>
  ),
  SidebarContent: ({ className, children }: SidebarContentProps) => (
    <div data-testid="sidebar-content" className={className}>
      {children}
    </div>
  ),
  SidebarGroup: ({ title, defaultOpen, children }: SidebarGroupProps) => (
    <div data-testid="sidebar-group" data-title={title} data-defaultopen={defaultOpen ? "true" : "false"}>
      <span data-testid="sidebar-group-title">{title}</span>
      <div data-testid="sidebar-group-content">{children}</div>
    </div>
  ),
  SidebarTrigger: ({ onClick, className, "aria-label": ariaLabel, children }: SidebarTriggerProps) => (
    <button data-testid="sidebar-trigger" onClick={onClick} className={className} aria-label={ariaLabel}>
      {children}
    </button>
  ),
}));

// Mock Lucide icon component
vi.mock("lucide-react", () => ({
  X: () => <div data-testid="x-icon">X Icon</div>,
}));

// Wrap the component with BrowserRouter for Link components
const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe("SidebarNavigation", () => {
  const onClose = vi.fn();

  beforeEach(() => {
    // Reset the mock function before each test
    onClose.mockReset();
  });

  it("renders the sidebar when isOpen is true", () => {
    // Arrange
    renderWithRouter(<SidebarNavigation isOpen={true} onClose={onClose} />);

    // Assert
    const sidebar = screen.getByTestId("sidebar");
    expect(sidebar).toBeInTheDocument();
    expect(sidebar.className).toContain("translate-x-0"); // Sidebar is visible
  });

  it("renders the sidebar when isOpen is false", () => {
    // Arrange
    renderWithRouter(<SidebarNavigation isOpen={false} onClose={onClose} />);

    // Assert
    const sidebar = screen.getByTestId("sidebar");
    expect(sidebar).toBeInTheDocument();
    expect(sidebar.className).toContain("-translate-x-full"); // Sidebar is hidden
  });

  it("renders the overlay when isOpen is true", () => {
    // Arrange
    renderWithRouter(<SidebarNavigation isOpen={true} onClose={onClose} />);

    // Assert
    const overlay = screen.getByTestId("sidebar-overlay");
    expect(overlay).toBeInTheDocument();
  });

  it("does not render the overlay when isOpen is false", () => {
    // Arrange
    renderWithRouter(<SidebarNavigation isOpen={false} onClose={onClose} />);

    // Assert
    const overlay = screen.queryByTestId("sidebar-overlay");
    expect(overlay).not.toBeInTheDocument();
  });

  it("calls onClose when the overlay is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithRouter(<SidebarNavigation isOpen={true} onClose={onClose} />);

    // Act
    await user.click(screen.getByTestId("sidebar-overlay"));

    // Assert
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the close button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithRouter(<SidebarNavigation isOpen={true} onClose={onClose} />);

    // Act
    await user.click(screen.getByTestId("sidebar-trigger"));

    // Assert
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders the application name", () => {
    // Arrange
    renderWithRouter(<SidebarNavigation isOpen={true} onClose={onClose} />);

    // Assert
    const appName = screen.getByText("React Starter Kit");
    expect(appName).toBeInTheDocument();
  });

  it("renders the home link", () => {
    // Arrange
    renderWithRouter(<SidebarNavigation isOpen={true} onClose={onClose} />);

    // Assert
    const homeLink = screen.getByTestId("sidebar-home-link");
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("renders the Documentation group", () => {
    // Arrange
    renderWithRouter(<SidebarNavigation isOpen={true} onClose={onClose} />);

    // Assert
    const docGroup = screen.getByTestId("sidebar-group");
    expect(docGroup).toBeInTheDocument();
    expect(docGroup).toHaveAttribute("data-title", "Documentation");
    expect(docGroup).toHaveAttribute("data-defaultopen", "true");
  });

  it("renders the Introduction link inside Documentation group", () => {
    // Arrange
    renderWithRouter(<SidebarNavigation isOpen={true} onClose={onClose} />);

    // Assert
    const introLink = screen.getByTestId("sidebar-introduction-link");
    expect(introLink).toBeInTheDocument();
    expect(introLink).toHaveAttribute("href", "/documentation/introduction");
  });

  it("calls onClose when a navigation link is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithRouter(<SidebarNavigation isOpen={true} onClose={onClose} />);

    // Act
    await user.click(screen.getByTestId("sidebar-home-link"));

    // Assert
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
