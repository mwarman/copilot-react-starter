import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Layout from "./Layout";

// Mock the Header component
vi.mock("../Header/Header", () => ({
  default: ({ toggleSidebar }: { toggleSidebar: () => void }) => (
    <div data-testid="mock-header" onClick={toggleSidebar}>
      Header Component
    </div>
  ),
}));

// Mock the Footer component
vi.mock("../Footer/Footer", () => ({
  default: () => <div data-testid="mock-footer">Footer Component</div>,
}));

// Mock the SidebarNavigation component
vi.mock("../SidebarNavigation/SidebarNavigation", () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    <div data-testid="mock-sidebar" data-open={isOpen} onClick={onClose}>
      Sidebar Component
    </div>
  ),
}));

describe("Layout", () => {
  it("renders the header", () => {
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

  it("renders the sidebar", () => {
    // Arrange
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    // Act
    const sidebar = screen.getByTestId("mock-sidebar");

    // Assert
    expect(sidebar).toBeInTheDocument();
    expect(sidebar).toHaveAttribute("data-open", "false"); // Default state is closed
  });

  it("renders the footer", () => {
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
