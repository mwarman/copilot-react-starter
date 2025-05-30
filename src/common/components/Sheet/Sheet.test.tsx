import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SheetHeader, SheetFooter } from "./Sheet";

// Note: We're not testing the Radix UI-based components (Sheet, SheetTrigger, SheetContent, SheetClose, SheetTitle, SheetDescription)
// directly since they are difficult to test without extensive mocking or require a specific context to work.
// Instead, we focus on testing the simpler components that don't have complex dependencies.

describe("Sheet Components", () => {
  it("should render SheetHeader correctly", () => {
    // Arrange
    render(<SheetHeader data-testid="header-test">Header Content</SheetHeader>);

    // Assert
    const header = screen.getByTestId("header-test");
    expect(header).toBeInTheDocument();
    expect(header).toHaveAttribute("data-slot", "sheet-header");
    expect(header).toHaveClass("flex", "flex-col", "gap-1.5", "p-4");
    expect(header).toHaveTextContent("Header Content");
  });

  it("should render SheetFooter correctly", () => {
    // Arrange
    render(<SheetFooter data-testid="footer-test">Footer Content</SheetFooter>);

    // Assert
    const footer = screen.getByTestId("footer-test");
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveAttribute("data-slot", "sheet-footer");
    expect(footer).toHaveClass("mt-auto", "flex", "flex-col", "gap-2", "p-4");
    expect(footer).toHaveTextContent("Footer Content");
  });

  it("should apply custom classes to SheetHeader", () => {
    // Arrange
    render(
      <SheetHeader data-testid="header-test" className="custom-header">
        Header
      </SheetHeader>
    );

    // Assert
    const header = screen.getByTestId("header-test");
    expect(header).toHaveClass("custom-header");
    // Should still have the default classes
    expect(header).toHaveClass("flex", "flex-col", "gap-1.5", "p-4");
  });

  it("should apply custom classes to SheetFooter", () => {
    // Arrange
    render(
      <SheetFooter data-testid="footer-test" className="custom-footer">
        Footer
      </SheetFooter>
    );

    // Assert
    const footer = screen.getByTestId("footer-test");
    expect(footer).toHaveClass("custom-footer");
    // Should still have the default classes
    expect(footer).toHaveClass("mt-auto", "flex", "flex-col", "gap-2", "p-4");
  });

  it("should pass additional props to SheetHeader", () => {
    // Arrange
    render(
      <SheetHeader role="banner" aria-label="Dialog header" data-testid="header-test">
        Header
      </SheetHeader>
    );

    // Assert
    const header = screen.getByTestId("header-test");
    expect(header).toHaveAttribute("role", "banner");
    expect(header).toHaveAttribute("aria-label", "Dialog header");
  });

  it("should pass additional props to SheetFooter", () => {
    // Arrange
    render(
      <SheetFooter role="contentinfo" aria-label="Dialog footer" data-testid="footer-test">
        Footer
      </SheetFooter>
    );

    // Assert
    const footer = screen.getByTestId("footer-test");
    expect(footer).toHaveAttribute("role", "contentinfo");
    expect(footer).toHaveAttribute("aria-label", "Dialog footer");
  });
});
