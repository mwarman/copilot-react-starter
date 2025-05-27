import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

// Mock the Router component
vi.mock("./common/components/Router/Router", () => ({
  default: () => <div data-testid="mock-router">Router Component</div>,
}));

describe("App", () => {
  it("renders the Router component", () => {
    // Arrange
    render(<App />);

    // Act
    const router = screen.getByTestId("mock-router");

    // Assert
    expect(router).toBeInTheDocument();
    expect(router).toHaveTextContent("Router Component");
  });
});
