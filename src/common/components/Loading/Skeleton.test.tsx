import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("should render correctly with default props", () => {
    // Arrange
    render(<Skeleton data-testid="test-skeleton" />);

    // Assert
    const skeleton = screen.getByTestId("test-skeleton");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton.tagName).toBe("DIV");
    expect(skeleton).toHaveAttribute("data-slot", "skeleton");
    expect(skeleton).toHaveClass("bg-accent", "animate-pulse", "rounded-md");
  });

  it("should apply custom class names", () => {
    // Arrange
    render(<Skeleton data-testid="test-skeleton" className="custom-class h-10 w-20" />);

    // Assert
    const skeleton = screen.getByTestId("test-skeleton");
    expect(skeleton).toHaveClass("custom-class", "h-10", "w-20");
    // Default classes should still be applied
    expect(skeleton).toHaveClass("bg-accent", "animate-pulse", "rounded-md");
  });

  it("should pass through additional props", () => {
    // Arrange
    render(<Skeleton data-testid="test-skeleton" aria-label="Loading content" id="skeleton-id" role="status" />);

    // Assert
    const skeleton = screen.getByTestId("test-skeleton");
    expect(skeleton).toHaveAttribute("aria-label", "Loading content");
    expect(skeleton).toHaveAttribute("id", "skeleton-id");
    expect(skeleton).toHaveAttribute("role", "status");
  });

  it("should render children when provided", () => {
    // Arrange
    render(
      <Skeleton data-testid="test-skeleton">
        <span data-testid="child-element">Loading...</span>
      </Skeleton>
    );

    // Assert
    const skeleton = screen.getByTestId("test-skeleton");
    const child = screen.getByTestId("child-element");
    expect(skeleton).toContainElement(child);
    expect(child).toHaveTextContent("Loading...");
  });

  it("should handle style prop correctly", () => {
    // Arrange
    const testStyle = { height: "100px", width: "200px" };
    render(<Skeleton data-testid="test-skeleton" style={testStyle} />);

    // Assert
    const skeleton = screen.getByTestId("test-skeleton");
    expect(skeleton).toHaveStyle(testStyle);
  });

  it("should be accessible", () => {
    // Arrange
    render(<Skeleton data-testid="test-skeleton" role="progressbar" aria-label="Loading content" aria-busy={true} />);

    // Assert
    const skeleton = screen.getByTestId("test-skeleton");
    expect(skeleton).toHaveAttribute("role", "progressbar");
    expect(skeleton).toHaveAttribute("aria-label", "Loading content");
    expect(skeleton).toHaveAttribute("aria-busy", "true");
  });
});
