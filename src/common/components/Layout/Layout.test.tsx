import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Layout from "./Layout";

// Mock matchMedia
beforeEach(() => {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});

// Mock the Header component
vi.mock("../Header/Header", () => ({
  default: () => <div data-testid="mock-header">Header Component</div>,
}));

// Mock the Footer component
vi.mock("../Footer/Footer", () => ({
  default: () => <div data-testid="mock-footer">Footer Component</div>,
}));

// Mock the SidebarNavigation component
vi.mock("../SidebarNavigation/SidebarNavigation", () => ({
  default: () => <div data-testid="mock-sidebar-navigation">SidebarNavigation Component</div>,
}));

// Mock the SidebarProvider component
vi.mock("../Sidebar/Sidebar", () => ({
  SidebarProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-sidebar-provider">{children}</div>
  ),
}));

// Mock the css utility
vi.mock("@/common/utils/css", () => ({
  cn: (...inputs: unknown[]): string => inputs.join(" "),
}));

describe("Layout", () => {
  it("renders the header component", () => {
    // Arrange
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    // Act
    const header = screen.getByTestId("mock-header");

    // Assert
    expect(header).toBeInTheDocument();
  });

  it("renders the footer component", () => {
    // Arrange
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    // Act
    const footer = screen.getByTestId("mock-footer");

    // Assert
    expect(footer).toBeInTheDocument();
  });

  it("renders the sidebar navigation component", () => {
    // Arrange
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    // Act
    const sidebarNavigation = screen.getByTestId("mock-sidebar-navigation");

    // Assert
    expect(sidebarNavigation).toBeInTheDocument();
  });

  it("renders the sidebar provider component", () => {
    // Arrange
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    // Act
    const sidebarProvider = screen.getByTestId("mock-sidebar-provider");

    // Assert
    expect(sidebarProvider).toBeInTheDocument();
  });

  it("renders the children content", () => {
    // Arrange
    render(
      <Layout>
        <div data-testid="content">Test Content</div>
      </Layout>
    );

    // Act
    const content = screen.getByTestId("content");

    // Assert
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent("Test Content");
  });
});
