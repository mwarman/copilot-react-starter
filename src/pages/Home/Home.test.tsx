import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Home from "./Home";

// Wrap the component with BrowserRouter for Link components
const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe("Home", () => {
  it("renders with the correct test ID", () => {
    // Arrange
    renderWithRouter(<Home />);

    // Act
    const homeElement = screen.getByTestId("home-page");

    // Assert
    expect(homeElement).toBeInTheDocument();
  });

  it("renders the welcome heading", () => {
    // Arrange
    renderWithRouter(<Home />);

    // Act - none needed for this test

    // Assert
    expect(screen.getByText("Welcome to React Starter Kit")).toBeInTheDocument();
  });

  it("renders all three sections", () => {
    // Arrange
    renderWithRouter(<Home />);

    // Act - none needed for this test

    // Assert
    expect(screen.getByText("About This Application")).toBeInTheDocument();
    expect(screen.getByText("Key Features")).toBeInTheDocument();
    expect(screen.getByText("Getting Started")).toBeInTheDocument();
  });

  it("displays text in a larger font size", () => {
    // Arrange
    renderWithRouter(<Home />);

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
    renderWithRouter(<Home testId={customTestId} />);

    // Act
    const homeElement = screen.getByTestId(customTestId);

    // Assert
    expect(homeElement).toBeInTheDocument();
  });

  it("renders a link to the documentation", () => {
    // Arrange
    renderWithRouter(<Home />);

    // Act
    const documentationLink = screen.getByTestId("documentation-link");

    // Assert
    expect(documentationLink).toBeInTheDocument();
    expect(documentationLink).toHaveAttribute("href", "/documentation");
    expect(documentationLink).toHaveTextContent("View Documentation");
  });
});
