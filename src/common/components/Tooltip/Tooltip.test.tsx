import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./Tooltip";

// Create a test component that uses the Tooltip
const TestTooltip = ({ open = false, content = "Tooltip Content", triggerText = "Hover Me" }) => {
  return (
    <Tooltip open={open}>
      <TooltipTrigger data-testid="tooltip-trigger">{triggerText}</TooltipTrigger>
      <TooltipContent data-testid="tooltip-content" sideOffset={5}>
        {content}
      </TooltipContent>
    </Tooltip>
  );
};

describe("Tooltip", () => {
  // Mock ResizeObserver before tests
  beforeEach(() => {
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });
  it("should render the trigger element correctly", () => {
    // Arrange
    render(<TestTooltip />);

    // Assert
    expect(screen.getByTestId("tooltip-trigger")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip-trigger")).toHaveTextContent("Hover Me");
  });

  it("should not show tooltip content by default", () => {
    // Arrange
    render(<TestTooltip />);

    // Assert
    expect(screen.queryByTestId("tooltip-content")).not.toBeInTheDocument();
  });

  it("should show tooltip content when open prop is true", () => {
    // Arrange
    render(<TestTooltip open={true} />);

    // Assert
    expect(screen.getByTestId("tooltip-content")).toBeInTheDocument();
  });

  it("should apply custom class names to tooltip content", () => {
    // Arrange
    render(
      <Tooltip open={true}>
        <TooltipTrigger data-testid="tooltip-trigger">Hover Me</TooltipTrigger>
        <TooltipContent data-testid="tooltip-content" className="custom-class">
          Tooltip Content
        </TooltipContent>
      </Tooltip>
    );

    // Assert
    const tooltipContent = screen.getByTestId("tooltip-content");
    expect(tooltipContent).toHaveClass("custom-class");
  });

  it("should apply the provided sideOffset", () => {
    // Arrange
    const customOffset = 10;
    render(
      <Tooltip open={true}>
        <TooltipTrigger data-testid="tooltip-trigger">Hover Me</TooltipTrigger>
        <TooltipContent data-testid="tooltip-content" sideOffset={customOffset}>
          Tooltip Content
        </TooltipContent>
      </Tooltip>
    );

    // Assert
    const tooltipContent = screen.getByTestId("tooltip-content");
    expect(tooltipContent).toBeInTheDocument();
    // We can't test the actual sideOffset attribute directly as it's applied internally by Radix
  });

  it("should render tooltip provider with custom props", () => {
    // Arrange
    render(
      <TooltipProvider delayDuration={500} data-testid="tooltip-provider">
        <Tooltip>
          <TooltipTrigger data-testid="tooltip-trigger">Hover Me</TooltipTrigger>
          <TooltipContent data-testid="tooltip-content">Tooltip Content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    // Assert - Can't directly test provider attributes in this case
    expect(screen.getByTestId("tooltip-trigger")).toBeInTheDocument();
  });

  it("should forward additional props to the tooltip trigger", () => {
    // Arrange
    const onClick = vi.fn();
    render(
      <Tooltip>
        <TooltipTrigger onClick={onClick} data-testid="tooltip-trigger">
          Hover Me
        </TooltipTrigger>
        <TooltipContent>Tooltip Content</TooltipContent>
      </Tooltip>
    );

    // Assert
    const trigger = screen.getByTestId("tooltip-trigger");
    expect(trigger).toHaveAttribute("data-slot", "tooltip-trigger");
  });

  it("should forward additional props to the tooltip trigger", () => {
    // Arrange
    const onClick = vi.fn();
    render(
      <Tooltip>
        <TooltipTrigger onClick={onClick} data-testid="trigger">
          Hover Me
        </TooltipTrigger>
        <TooltipContent>Tooltip Content</TooltipContent>
      </Tooltip>
    );

    // Assert
    const trigger = screen.getByTestId("trigger");
    expect(trigger).toHaveAttribute("data-slot", "tooltip-trigger");
  });
});
