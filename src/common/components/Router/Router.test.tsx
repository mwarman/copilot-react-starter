import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Router } from './Router';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: () => <div>Route</div>,
  Navigate: () => <div>Navigate</div>,
}));

// Mock React's lazy and Suspense
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    lazy: () => () => <div data-testid="lazy-loaded-component">Lazy Loaded Component</div>,
    Suspense: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

describe('Router', () => {
  it('renders without errors', () => {
    // Arrange & Act
    render(<Router />);

    // Assert
    expect(screen.getAllByText('Route').length).toBeGreaterThan(0);
  });
});
