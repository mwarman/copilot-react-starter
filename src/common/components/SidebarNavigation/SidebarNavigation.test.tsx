import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import SidebarNavigation from "./SidebarNavigation";
import * as SidebarModule from "../Sidebar/Sidebar";

// Mock the entire Sidebar component
vi.mock("../Sidebar/Sidebar", () => {
  const SidebarContext = {
    Provider: ({ children }: { children: React.ReactNode }) => children,
  };

  // Create a mock for useSidebar that returns the state we need
  const useSidebar = vi.fn();

  return {
    Sidebar: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar">{children}</div>,
    SidebarContent: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="sidebar-content">{children}</div>
    ),
    SidebarGroup: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-group">{children}</div>,
    SidebarGroupContent: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="sidebar-group-content">{children}</div>
    ),
    SidebarHeader: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div data-testid="sidebar-header" className={className}>
        {children}
      </div>
    ),
    SidebarMenu: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-menu">{children}</div>,
    SidebarMenuButton: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="sidebar-menu-button">{children}</div>
    ),
    SidebarMenuItem: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="sidebar-menu-item">{children}</div>
    ),
    SidebarMenuSub: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="sidebar-menu-sub">{children}</div>
    ),
    SidebarMenuSubButton: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="sidebar-menu-sub-button">{children}</div>
    ),
    useSidebar,
    SidebarContext,
  };
});

// Mock the svg import
vi.mock("@/assets/react.svg", () => ({
  default: "react-logo.svg",
}));

interface SidebarState {
  open: boolean;
}

const renderWithRouter = (component: React.ReactNode, sidebarState: SidebarState = { open: true }) => {
  // Set the mock implementation for useSidebar for this render
  vi.mocked(SidebarModule.useSidebar).mockReturnValue({
    open: sidebarState.open,
    state: sidebarState.open ? "expanded" : "collapsed",
    setOpen: vi.fn(),
    openMobile: false,
    setOpenMobile: vi.fn(),
    isMobile: false,
    toggleSidebar: vi.fn(),
  });

  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("SidebarNavigation", () => {
  it("should render correctly when sidebar is open", () => {
    // Arrange
    renderWithRouter(<SidebarNavigation />, { open: true });

    // Assert
    expect(screen.getByText("React Starter Kit")).toBeInTheDocument();
    expect(screen.getByAltText("React Starter Kit Logo")).toBeInTheDocument();
    expect(screen.getByTestId("home-link")).toBeInTheDocument();
    expect(screen.getByTestId("documentation-link")).toBeInTheDocument();
    expect(screen.getByTestId("documentation-introduction-link")).toBeInTheDocument();
  });

  it("should render correctly when sidebar is closed", () => {
    // Arrange
    renderWithRouter(<SidebarNavigation />, { open: false });

    // Assert
    expect(screen.getByText("React Starter Kit")).toBeInTheDocument();
    expect(screen.getByAltText("React Starter Kit Logo")).toBeInTheDocument();
    expect(screen.getByTestId("home-link")).toBeInTheDocument();
    expect(screen.getByTestId("documentation-link")).toBeInTheDocument();
    expect(screen.getByTestId("documentation-introduction-link")).toBeInTheDocument();

    // When sidebar is closed, the title should have w-0 class
    const title = screen.getByText("React Starter Kit");
    expect(title.className).toContain("w-0");
  });

  it("should render all menu items with correct links", () => {
    // Arrange
    renderWithRouter(<SidebarNavigation />, { open: true });

    // Assert
    const homeLink = screen.getByTestId("home-link");
    expect(homeLink).toHaveAttribute("href", "/");
    expect(homeLink).toHaveTextContent("Home");

    const documentationLink = screen.getByTestId("documentation-link");
    expect(documentationLink).toHaveAttribute("href", "/documentation");
    expect(documentationLink).toHaveTextContent("Documentation");

    const introductionLink = screen.getByTestId("documentation-introduction-link");
    expect(introductionLink).toHaveAttribute("href", "/documentation/introduction");
    expect(introductionLink).toHaveTextContent("Introduction");
  });

  it("should render icons for menu items", () => {
    // Arrange
    renderWithRouter(<SidebarNavigation />, { open: true });

    // Assert
    // We can't easily test the exact icons, but we can check for SVG elements
    const homeLink = screen.getByTestId("home-link");
    expect(homeLink.querySelector("svg")).toBeInTheDocument();

    const documentationLink = screen.getByTestId("documentation-link");
    expect(documentationLink.querySelector("svg")).toBeInTheDocument();
  });
});
