import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("should render correctly with default props", () => {
    // Arrange
    render(<Button>Click me</Button>);

    // Assert
    const button = screen.getByTestId("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Click me");
    expect(button.tagName).toBe("BUTTON");
  });

  it("should apply custom class names", () => {
    // Arrange
    render(<Button className="test-class">Click me</Button>);

    // Assert
    const button = screen.getByTestId("button");
    expect(button).toHaveClass("test-class");
  });

  it("should handle click events", async () => {
    // Arrange
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    // Act
    await user.click(screen.getByTestId("button"));

    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should support different variants", () => {
    // Arrange
    render(<Button variant="destructive">Delete</Button>);

    // Assert
    const button = screen.getByTestId("button");
    expect(button).toHaveClass("bg-destructive");
  });

  it("should support different sizes", () => {
    // Arrange
    render(<Button size="sm">Small Button</Button>);

    // Assert
    const button = screen.getByTestId("button");
    expect(button).toHaveClass("h-8");
  });

  it("should support the asChild prop", () => {
    // Arrange
    render(
      <Button asChild>
        <a href="https://example.com">Link Button</a>
      </Button>
    );

    // Assert
    const link = screen.getByTestId("button");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  it("should be disabled when disabled prop is true", () => {
    // Arrange
    render(<Button disabled>Disabled Button</Button>);

    // Assert
    const button = screen.getByTestId("button");
    expect(button).toBeDisabled();
  });
});
