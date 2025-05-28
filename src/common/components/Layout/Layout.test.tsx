import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Layout from "./Layout";

// Mock the Header component
vi.mock("../Header/Header", () => ({
  default: () => <div data-testid="mock-header">Header Component</div>,
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
