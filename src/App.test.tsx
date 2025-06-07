import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock React Query
vi.mock('@tanstack/react-query', () => ({
  QueryClient: vi.fn().mockImplementation(() => ({})),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock React Query Devtools
vi.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: () => null,
}));

// Mock the Router component
vi.mock('./common/components/Router/Router', () => ({
  Router: () => <div data-testid="router">Router Component</div>,
}));

// Mock the ThemeProvider to avoid matchMedia issues in tests
vi.mock('./common/providers/ThemeProvider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}));

// Mock the Header component
vi.mock('./common/components/Header/Header', () => ({
  Header: () => <header data-testid="header">Task Hero</header>,
}));

// Mock the Footer component
vi.mock('./common/components/Footer/Footer', () => ({
  Footer: () => <footer data-testid="footer">© 2025 learnBYdoing</footer>,
}));

describe('App component', () => {
  it('renders the header', () => {
    // Arrange
    render(<App />);

    // Assert
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders the router', () => {
    // Arrange
    render(<App />);

    // Assert
    expect(screen.getByTestId('router')).toBeInTheDocument();
  });

  it('renders the footer', () => {
    // Arrange
    render(<App />);

    // Assert
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
