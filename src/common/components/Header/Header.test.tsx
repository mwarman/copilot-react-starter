import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Header from "./Header";

describe("Header", () => {
  it("renders the application name", () => {
    // Arrange
    render(<Header />);

    // Act
    const appName = screen.getByText("React Starter Kit");

    // Assert
    expect(appName).toBeInTheDocument();
  });
});
