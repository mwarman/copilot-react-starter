import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "./Home";

describe("Home", () => {
  it("renders with the correct test ID", () => {
    // Arrange
    render(<Home />);

    // Act
    const homeElement = screen.getByTestId("home-page");

    // Assert
    expect(homeElement).toBeInTheDocument();
  });

  it("renders the welcome heading", () => {
    // Arrange
    render(<Home />);

    // Act - none needed for this test

    // Assert
    expect(screen.getByText("Welcome to React Starter Kit")).toBeInTheDocument();
  });

  it("renders all three sections", () => {
    // Arrange
    render(<Home />);

    // Act - none needed for this test

    // Assert
    expect(screen.getByText("About This Application")).toBeInTheDocument();
    expect(screen.getByText("Key Features")).toBeInTheDocument();
    expect(screen.getByText("Getting Started")).toBeInTheDocument();
  });

  it("displays text in a larger font size", () => {
    // Arrange
    render(<Home />);

    // Act
    const paragraphs = screen.getAllByText(/./i, { selector: "p" });

    // Assert
    paragraphs.forEach((paragraph) => {
      expect(paragraph).toHaveClass("text-base");
      expect(paragraph).toHaveClass("md:text-lg");
    });
  });

  it("accepts a custom testId", () => {
    // Arrange
    const customTestId = "custom-home-page";
    render(<Home testId={customTestId} />);

    // Act
    const homeElement = screen.getByTestId(customTestId);

    // Assert
    expect(homeElement).toBeInTheDocument();
  });
});
