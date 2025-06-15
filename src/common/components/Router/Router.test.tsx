import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import * as React from 'react';
import { Router, LoadingFallback } from './Router';

// Mock the Header component
vi.mock('../Header/Header', () => ({
  Header: () => <div data-testid="mock-header">Mock Header</div>,
}));

// Mock the Footer component
vi.mock('../Footer/Footer', () => ({
  default: () => <div data-testid="mock-footer">Mock Footer</div>,
}));

// Mock React's lazy loading
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    lazy: () => {
      const Component = () => <div data-testid="landing-page-component">Landing Page Component</div>;
      Component.displayName = 'LazyLoadedComponent';
      return Component;
    },
    Suspense: ({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) => (
      <>
        {fallback && <div data-testid="suspense-fallback">{fallback}</div>}
        {children}
      </>
    ),
  };
});

// Mock the Navigate component to track redirects
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => {
      mockNavigate(to);
      return null;
    },
  };
});

describe('Router', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockNavigate.mockClear();
  });

  it('renders the Header component', () => {
    // Arrange - No special setup needed

    // Act
    render(
      <BrowserRouter>
        <Router />
      </BrowserRouter>,
    );

    // Assert
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
  });

  it('renders the Footer component', () => {
    // Arrange - No special setup needed

    // Act
    render(
      <BrowserRouter>
        <Router />
      </BrowserRouter>,
    );

    // Assert
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  it('renders the LandingPage component on the root route', async () => {
    // Arrange
    window.history.pushState({}, '', '/');

    // Act
    render(
      <BrowserRouter>
        <Router />
      </BrowserRouter>,
    );

    // Assert
    expect(screen.getByTestId('landing-page-component')).toBeInTheDocument();
  });

  it('redirects to the home page for non-existent routes', () => {
    // Arrange
    window.history.pushState({}, '', '/non-existent-route');

    // Act
    render(
      <BrowserRouter>
        <Router />
      </BrowserRouter>,
    );

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renders the LoadingFallback component during lazy loading', () => {
    // Arrange - Set up a custom mock for Suspense to trigger the fallback
    const SuspenseMock = ({ fallback }: { fallback: React.ReactNode }) => (
      <div data-testid="suspense-component">{fallback}</div>
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn(React, 'Suspense').mockImplementationOnce(SuspenseMock as any);

    // Act - Render the Router component
    render(
      <BrowserRouter>
        <Router />
      </BrowserRouter>,
    );

    // Assert - Verify fallback is shown with the correct content
    expect(screen.getByTestId('suspense-component')).toBeInTheDocument();
    // The loading fallback has an animated spinner which is a div with border classes
    expect(screen.getByTestId('suspense-component').innerHTML).toContain('animate-spin');

    // Clean up
    vi.restoreAllMocks();
  });

  it('handles route changes correctly', () => {
    // Arrange - This test is more about ensuring the navigation logic works
    // We should test with a spy on the mockNavigate function
    mockNavigate.mockClear();

    // Act - Render with a non-existent route
    window.history.pushState({}, '', '/not-found');
    render(
      <BrowserRouter>
        <Router />
      </BrowserRouter>,
    );

    // Assert - Verify redirect happened
    expect(mockNavigate).toHaveBeenCalledWith('/');

    // Reset mock for the next test
    mockNavigate.mockClear();
  });

  describe('LoadingFallback', () => {
    it('renders a loading spinner', () => {
      // Arrange - Prepare to render the LoadingFallback component

      // Act
      render(<LoadingFallback />);

      // Assert
      // Verify that the spinner exists
      const spinnerElement = document.querySelector('.animate-spin');
      expect(spinnerElement).toBeInTheDocument();

      // Verify the container has the correct flex layout
      const containerElement = spinnerElement?.parentElement;
      expect(containerElement).toHaveClass('flex');
      expect(containerElement).toHaveClass('justify-center');
      expect(containerElement).toHaveClass('items-center');
    });
  });

  it('uses lazy loading with Suspense', () => {
    // Arrange - Set up environment for testing lazy loading with Suspense
    // Set up a root path
    window.history.pushState({}, '', '/');

    // Act - Render the Router component
    render(
      <BrowserRouter>
        <Router />
      </BrowserRouter>,
    );

    // Assert - Verify Suspense is used and the correct route is active
    // Verify Suspense is used by checking the presence of the fallback element
    expect(screen.getByTestId('suspense-fallback')).toBeInTheDocument();
    // Check that the correct path is active
    expect(window.location.pathname).toBe('/');
  });
});
