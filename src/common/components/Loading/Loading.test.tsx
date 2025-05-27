import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Loading from "./Loading";

describe("Loading", () => {
  it("renders the loading spinner", () => {
    // Arrange
    render(<Loading />);

    // Act
    const loading = screen.getByTestId("loading");

    // Assert
    expect(loading).toBeInTheDocument();
  });

  it("applies custom className", () => {
    // Arrange
    render(<Loading className="custom-class" />);

    // Act
    const loading = screen.getByTestId("loading");

    // Assert
    expect(loading).toHaveClass("custom-class");
  });

  it("applies custom testId", () => {
    // Arrange
    render(<Loading testId="custom-test-id" />);

    // Act
    const loading = screen.getByTestId("custom-test-id");

    // Assert
    expect(loading).toBeInTheDocument();
  });
});
