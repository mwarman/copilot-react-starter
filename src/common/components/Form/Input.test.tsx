import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
  it("should render correctly with default props", () => {
    // Arrange
    render(<Input data-testid="test-input" />);

    // Assert
    const input = screen.getByTestId("test-input");
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("data-slot", "input");
  });

  it("should use text as the default type when no type is provided", () => {
    // Arrange
    render(<Input data-testid="test-input" />);

    // Assert
    const input = screen.getByTestId("test-input");
    // In HTML, inputs have a default type of "text" when not specified
    expect(input).toHaveProperty("type", "text");
  });

  it("should apply custom class names", () => {
    // Arrange
    render(<Input data-testid="test-input" className="custom-class" />);

    // Assert
    const input = screen.getByTestId("test-input");
    expect(input).toHaveClass("custom-class");
  });

  it("should handle different input types", () => {
    // Arrange
    render(<Input data-testid="test-input" type="password" />);

    // Assert
    const input = screen.getByTestId("test-input");
    expect(input).toHaveAttribute("type", "password");
  });

  it("should handle user input correctly", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<Input data-testid="test-input" />);
    const input = screen.getByTestId("test-input");

    // Act
    await user.type(input, "Hello, world!");

    // Assert
    expect(input).toHaveValue("Hello, world!");
  });

  it("should pass through additional props", () => {
    // Arrange
    render(
      <Input
        data-testid="test-input"
        placeholder="Enter text here"
        aria-label="Text input"
        name="test-name"
        id="test-id"
      />
    );

    // Assert
    const input = screen.getByTestId("test-input");
    expect(input).toHaveAttribute("placeholder", "Enter text here");
    expect(input).toHaveAttribute("aria-label", "Text input");
    expect(input).toHaveAttribute("name", "test-name");
    expect(input).toHaveAttribute("id", "test-id");
  });

  it("should apply disabled styles when disabled", () => {
    // Arrange
    render(<Input data-testid="test-input" disabled />);

    // Assert
    const input = screen.getByTestId("test-input");
    expect(input).toBeDisabled();
    expect(input).toHaveClass("disabled:opacity-50");
  });

  it("should handle required attribute", () => {
    // Arrange
    render(<Input data-testid="test-input" required />);

    // Assert
    const input = screen.getByTestId("test-input");
    expect(input).toHaveAttribute("required");
  });

  it("should handle aria-invalid attribute and apply error styles", () => {
    // Arrange
    render(<Input data-testid="test-input" aria-invalid="true" />);

    // Assert
    const input = screen.getByTestId("test-input");
    expect(input).toHaveAttribute("aria-invalid", "true");
    // Check that it has the aria-invalid styles (partial class check)
    expect(input.className).toContain("aria-invalid:border-destructive");
  });

  it("should handle onChange events", async () => {
    // Arrange
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<Input data-testid="test-input" onChange={handleChange} />);
    const input = screen.getByTestId("test-input");

    // Act
    await user.type(input, "a");

    // Assert
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
