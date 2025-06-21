import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './Header';

// Mock ThemeToggle component
vi.mock('../ThemeToggle/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle-mock" />,
}));

// Mock useScrollDirection hook
vi.mock('../../hooks/useScrollDirection', () => ({
  useScrollDirection: vi.fn(),
}));

// Import the mocked function to use in tests
import { useScrollDirection } from '../../hooks/useScrollDirection';
const mockUseScrollDirection = vi.mocked(useScrollDirection);

// Create a wrapper component that provides the BrowserRouter context
const HeaderWithRouter = () => (
  <BrowserRouter>
    <Header />
  </BrowserRouter>
);

describe('Header', () => {
  beforeEach(() => {
    // Reset mock to default state before each test
    mockUseScrollDirection.mockReturnValue({
      isVisible: true,
      scrollDirection: 'up',
    });
  });

  it('renders the application logo and name', () => {
    // Arrange
    render(<HeaderWithRouter />);

    // Assert
    expect(screen.getByText('Task Hero')).toBeInTheDocument();
    expect(screen.getByLabelText('Task Hero homepage')).toBeInTheDocument();
  });

  it('contains a link to the home page', () => {
    // Arrange
    render(<HeaderWithRouter />);

    // Act
    const homeLink = screen.getByLabelText('Task Hero homepage');

    // Assert
    expect(homeLink.getAttribute('href')).toBe('/');
  });

  it('has the BadgeCheck icon', () => {
    // Arrange
    render(<HeaderWithRouter />);

    // Assert
    // Since Lucide icons are SVG elements, we can check if an SVG is present within the header
    const header = screen.getByRole('banner');
    const svg = header.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('includes the ThemeToggle component', () => {
    // Arrange
    render(<HeaderWithRouter />);

    // Assert
    expect(screen.getByTestId('theme-toggle-mock')).toBeInTheDocument();
  });

  it('includes a Create button with link to create task page', () => {
    // Arrange
    render(<HeaderWithRouter />);

    // Act
    const createTaskButton = screen.getByRole('link', { name: /create/i });

    // Assert
    expect(createTaskButton).toBeInTheDocument();
    expect(createTaskButton.getAttribute('href')).toBe('/tasks/create');
  });

  it('applies fixed positioning and z-index for scroll behavior', () => {
    // Arrange
    render(<HeaderWithRouter />);

    // Act
    const header = screen.getByRole('banner');

    // Assert
    expect(header).toHaveClass('fixed', 'top-0', 'z-50');
  });

  it('shows header when isVisible is true', () => {
    // Arrange
    mockUseScrollDirection.mockReturnValue({ isVisible: true, scrollDirection: 'up' });
    render(<HeaderWithRouter />);

    // Act
    const header = screen.getByRole('banner');

    // Assert
    expect(header).toHaveClass('translate-y-0');
    expect(header).not.toHaveClass('-translate-y-full');
  });

  it('hides header when isVisible is false', () => {
    // Arrange
    mockUseScrollDirection.mockReturnValue({ isVisible: false, scrollDirection: 'down' });
    render(<HeaderWithRouter />);

    // Act
    const header = screen.getByRole('banner');

    // Assert
    expect(header).toHaveClass('-translate-y-full');
    expect(header).not.toHaveClass('translate-y-0');
  });
});
