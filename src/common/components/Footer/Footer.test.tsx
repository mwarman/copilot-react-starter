import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer", () => {
  it("renders the copyright year", () => {
    // Arrange
    render(<Footer />);
    const currentYear = new Date().getFullYear();

    // Assert
    expect(screen.getByText(new RegExp(`${currentYear}`))).toBeInTheDocument();
  });

  it("renders 'IlearnBYdoing' text", () => {
    // Arrange
    render(<Footer />);

    // Assert
    expect(screen.getByText(/IlearnBYdoing/)).toBeInTheDocument();
  });
});
