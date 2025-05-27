import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Router from "./Router";

// Mock the Loading component
vi.mock("../Loading/Loading", () => ({
  default: () => <div data-testid="mock-loading">Loading Component</div>,
}));

// Mock React's lazy and Suspense
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    lazy: () => () => <div data-testid="lazy-loaded">Lazy Loaded Component</div>,
    Suspense: ({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) => (
      <div data-testid="suspense">
        <div data-testid="fallback-content">{fallback}</div>
        <div data-testid="lazy-content">{children}</div>
      </div>
    ),
  };
});

// Mock the router
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    createBrowserRouter: vi.fn().mockImplementation((routes) => {
      // Store routes for testing
      return { routes };
    }),
    // @ts-expect-error - simplifying types for test
    RouterProvider: ({ router }) => (
      <div data-testid="router-provider">
        Router Provided
        <div data-testid="route-content">{router.routes[0].element}</div>
      </div>
    ),
  };
});

describe("Router", () => {
  it("provides the router", () => {
    // Arrange
    render(<Router />);

    // Act
    const routerProvider = screen.getByTestId("router-provider");
    const routeContent = screen.getByTestId("route-content");

    // Assert
    expect(routerProvider).toBeInTheDocument();
    expect(routerProvider).toHaveTextContent("Router Provided");
    expect(routeContent).toBeInTheDocument();
  });

  it("uses Suspense with Loading component for lazy loading", () => {
    // Arrange
    render(<Router />);

    // Act
    const suspense = screen.getByTestId("suspense");
    const fallbackContent = screen.getByTestId("fallback-content");
    const mockLoading = screen.getByTestId("mock-loading");
    const lazyContent = screen.getByTestId("lazy-content");

    // Assert
    expect(suspense).toBeInTheDocument();
    expect(fallbackContent).toContainElement(mockLoading);
    expect(lazyContent).toBeInTheDocument();
    expect(lazyContent).toContainElement(screen.getByTestId("lazy-loaded"));
  });
});
