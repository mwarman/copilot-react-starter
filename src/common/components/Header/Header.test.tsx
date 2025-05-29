import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import Header from "./Header";

// Mock the ThemeToggle component
vi.mock("../ThemeToggle/ThemeToggle", () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

describe("Header", () => {
  const renderHeader = () => {
    return render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
  };

  it("renders the app name", () => {
    renderHeader();
    expect(screen.getByText("React Starter Kit")).toBeInTheDocument();
  });

  it("renders the documentation link", () => {
    renderHeader();
    const documentationLink = screen.getByTestId("header-documentation-link");
    expect(documentationLink).toBeInTheDocument();
    expect(documentationLink).toHaveAttribute("href", "/documentation");
    expect(documentationLink).toHaveTextContent("Documentation");
  });

  it("renders the theme toggle component", () => {
    renderHeader();
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });

  it("has the correct styling classes", () => {
    renderHeader();
    const headerElement = screen.getByRole("banner");
    expect(headerElement).toHaveClass("bg-slate-900");
    expect(headerElement).toHaveClass("shadow-md");
  });
});
