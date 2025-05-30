import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import Header from "./Header";

// Mock the ThemeToggle component
vi.mock("../ThemeToggle/ThemeToggle", () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

// Create a mock for useSidebar that we can control in tests
const mockUseSidebar = vi.fn();

// Mock the Sidebar component and hook
vi.mock("../Sidebar/Sidebar", () => ({
  SidebarTrigger: ({ className }: { className?: string }) => (
    <button data-testid="sidebar-trigger" className={className}>
      Sidebar Trigger
    </button>
  ),
  useSidebar: () => mockUseSidebar(),
}));

describe("Header", () => {
  beforeEach(() => {
    // Reset the mock before each test
    mockUseSidebar.mockReset().mockReturnValue({ open: false });
  });

  const renderHeader = () => {
    return render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
  };

  it("renders the app name", () => {
    renderHeader();
    expect(screen.getByText("React Starter Kit")).toBeInTheDocument();
  });

  it("renders the sidebar trigger", () => {
    renderHeader();
    const sidebarTrigger = screen.getByTestId("sidebar-trigger");
    expect(sidebarTrigger).toBeInTheDocument();
    expect(sidebarTrigger).toHaveClass("hover:bg-slate-600/50");
  });

  it("renders the theme toggle component", () => {
    renderHeader();
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });

  it("has the correct styling classes", () => {
    renderHeader();
    const headerElement = screen.getByRole("banner");
    expect(headerElement).toHaveClass("bg-slate-900");
    expect(headerElement).toHaveClass("shadow-md");
  });

  it("hides app title when sidebar is open", () => {
    // Set sidebar to be open for this test
    mockUseSidebar.mockReturnValue({ open: true });

    renderHeader();
    const appTitle = screen.getByText("React Starter Kit");
    expect(appTitle).toHaveClass("w-0");
  });
});
