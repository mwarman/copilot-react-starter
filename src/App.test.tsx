import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the Vite and React logos", () => {
    // Arrange
    render(<App />);

    // Act
    const viteLogo = screen.getByAltText(/vite logo/i);
    const reactLogo = screen.getByAltText(/react logo/i);

    // Assert
    expect(viteLogo).toBeInTheDocument();
    expect(reactLogo).toBeInTheDocument();
  });

  it("renders count button with initial value of 0", () => {
    // Arrange
    render(<App />);

    // Act
    const buttonElement = screen.getByRole("button", { name: /count is 0/i });

    // Assert
    expect(buttonElement).toBeInTheDocument();
  });
});
