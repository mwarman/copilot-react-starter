import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

// Mock the Router component
vi.mock('./common/components/Router/Router', () => ({
  default: () => <div data-testid="router-component">Router Component</div>,
}));

// Mock BrowserRouter
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div data-testid="browser-router">{children}</div>,
}));

// Mock ThemeProvider
vi.mock('./common/providers/ThemeProvider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="theme-provider">{children}</div>,
}));

// Mock QueryClientProvider
vi.mock('@tanstack/react-query', () => ({
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="query-provider">{children}</div>
  ),
  QueryClient: vi.fn(() => ({})),
}));

// Mock Toaster component to avoid matchMedia issues
vi.mock('./common/components/ui/sonner', () => ({
  Toaster: () => <div data-testid="toaster" />,
}));

describe('App', () => {
  it('renders the Router component inside BrowserRouter, ThemeProvider, and QueryClientProvider', () => {
    // Arrange & Act
    const { getByTestId } = render(<App />);

    // Assert
    expect(getByTestId('query-provider')).toBeInTheDocument();
    expect(getByTestId('theme-provider')).toBeInTheDocument();
    expect(getByTestId('browser-router')).toBeInTheDocument();
    expect(getByTestId('router-component')).toBeInTheDocument();
  });
});
