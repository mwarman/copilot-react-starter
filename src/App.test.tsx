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

describe('App', () => {
  it('renders the Router component inside BrowserRouter', () => {
    // Arrange & Act
    const { getByTestId } = render(<App />);

    // Assert
    expect(getByTestId('browser-router')).toBeInTheDocument();
    expect(getByTestId('router-component')).toBeInTheDocument();
  });
});
