import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Separator } from "./Separator";

describe("Separator", () => {
  it("should render correctly with default props", () => {
    // Arrange
    render(<Separator data-testid="test-separator" />);

    // Assert
    const separator = screen.getByTestId("test-separator");
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute("data-slot", "separator-root");
    expect(separator).toHaveAttribute("data-orientation", "horizontal");
    // Default is decorative=true
    expect(separator).toHaveAttribute("role", "none");
  });

  it("should apply default classes", () => {
    // Arrange
    render(<Separator data-testid="test-separator" />);

    // Assert
    const separator = screen.getByTestId("test-separator");
    expect(separator).toHaveClass("bg-border", "shrink-0");
    // Classes for horizontal orientation
    expect(separator).toHaveClass("data-[orientation=horizontal]:h-px", "data-[orientation=horizontal]:w-full");
    // Classes for vertical orientation
    expect(separator).toHaveClass("data-[orientation=vertical]:h-full", "data-[orientation=vertical]:w-px");
  });

  it("should apply custom classes", () => {
    // Arrange
    render(<Separator data-testid="test-separator" className="custom-class" />);

    // Assert
    const separator = screen.getByTestId("test-separator");
    expect(separator).toHaveClass("custom-class");
    // Should still have the default classes
    expect(separator).toHaveClass("bg-border", "shrink-0");
  });

  it("should render with vertical orientation when specified", () => {
    // Arrange
    render(<Separator data-testid="test-separator" orientation="vertical" />);

    // Assert
    const separator = screen.getByTestId("test-separator");
    expect(separator).toHaveAttribute("data-orientation", "vertical");
  });

  it("should not be decorative when decorative is false", () => {
    // Arrange
    render(<Separator data-testid="test-separator" decorative={false} />);

    // Assert
    const separator = screen.getByTestId("test-separator");
    // When not decorative, it should have a separator role
    expect(separator).toHaveAttribute("role", "separator");
  });

  it("should pass additional props to the underlying component", () => {
    // Arrange
    render(<Separator data-testid="test-separator" id="separator-id" aria-label="Content separator" />);

    // Assert
    const separator = screen.getByTestId("test-separator");
    expect(separator).toHaveAttribute("id", "separator-id");
    expect(separator).toHaveAttribute("aria-label", "Content separator");
  });

  it("should render correctly with both orientation and decorative props customized", () => {
    // Arrange
    render(<Separator data-testid="test-separator" orientation="vertical" decorative={false} />);

    // Assert
    const separator = screen.getByTestId("test-separator");
    expect(separator).toHaveAttribute("data-orientation", "vertical");
    expect(separator).toHaveAttribute("role", "separator");
  });
});
