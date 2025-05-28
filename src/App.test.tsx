import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

// Mock the Router component
vi.mock("./common/components/Router/Router", () => ({
  default: () => <div data-testid="mock-router">Router Component</div>,
}));

// Mock the ThemeProvider component
vi.mock("./common/components/ThemeProvider/ThemeProvider", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-theme-provider">{children}</div>
  ),
}));

describe("App", () => {
  it("renders the Router component within ThemeProvider", () => {
    // Arrange
    render(<App />);

    // Act
    const router = screen.getByTestId("mock-router");
    const themeProvider = screen.getByTestId("mock-theme-provider");

    // Assert
    expect(router).toBeInTheDocument();
    expect(router).toHaveTextContent("Router Component");
    expect(themeProvider).toBeInTheDocument();
    expect(themeProvider).toContainElement(router);
  });
});
