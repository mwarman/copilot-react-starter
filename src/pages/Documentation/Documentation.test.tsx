import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Documentation from "./Documentation";

// Mock the Loading component
vi.mock("../../common/components/Loading/Loading", () => ({
  default: () => <div data-testid="loading-component">Loading...</div>,
}));

// Create a custom renderer for router testing
const renderWithRouter = (ui: React.ReactElement, { route = "/documentation/introduction" } = {}) => {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
};

// Create a custom renderer for testing redirects
const renderWithRedirectTest = () => {
  return render(
    <MemoryRouter initialEntries={["/documentation"]}>
      <Routes>
        <Route path="/documentation" element={<Documentation />} />
        <Route
          path="/documentation/introduction"
          element={<div data-testid="introduction-page">Introduction Page</div>}
        />
      </Routes>
    </MemoryRouter>
  );
};

describe("Documentation Component", () => {
  // Setup and teardown for mocking react-router-dom
  beforeEach(() => {
    vi.mock("react-router-dom", async () => {
      const actual = await vi.importActual("react-router-dom");
      return {
        ...actual,
        Outlet: () => <div data-testid="outlet-content">Outlet Content</div>,
      };
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Test for redirect from base path
  it("redirects to introduction page when at base documentation route", () => {
    // Arrange & Act
    renderWithRedirectTest();

    // Assert - Check that it redirected to the introduction page
    expect(screen.getByTestId("introduction-page")).toBeInTheDocument();
  });

  // Test for rendering content when on a sub-page
  it("renders documentation layout with content when on a sub-page", () => {
    // Arrange & Act
    renderWithRouter(<Documentation />);

    // Assert
    expect(screen.getByText("Documentation")).toBeInTheDocument();

    // Check that the navigation shows the Introduction link
    const introLink = screen.getByText("Introduction");
    expect(introLink).toBeInTheDocument();
    expect(introLink).toHaveAttribute("href", "/documentation/introduction");

    // Check that the outlet content is rendered
    expect(screen.getByTestId("outlet-content")).toBeInTheDocument();
  });

  // Test the structure of the layout
  it("renders the documentation page with the correct structure", () => {
    // Arrange & Act
    renderWithRouter(<Documentation />);

    // Assert
    // Check heading
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Documentation");

    // Check sidebar heading
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Pages");

    // Check for main content and sidebar structure
    // In jsdom environment, we can't test CSS classes directly that are only applied conditionally
    // based on media queries (like md:col-span-3), so instead we'll check if the elements exist
    const mainContainer = screen.getByTestId("outlet-content").closest(".grid");
    expect(mainContainer).toBeInTheDocument();

    // Check if navigation link is present
    const introductionLink = screen.getByText("Introduction");
    expect(introductionLink).toBeInTheDocument();
  });
});
