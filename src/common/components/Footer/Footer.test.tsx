import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Footer } from './Footer';

// Mock the ThemeProvider to avoid matchMedia issues in tests
vi.mock('../../../common/providers/ThemeProvider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}));

describe('Footer', () => {
  it('renders the copyright text with current year', () => {
    // Arrange
    const currentYear = new Date().getFullYear();

    // Act
    render(<Footer />);

    // Assert
    expect(screen.getByText(`© ${currentYear} learnBYdoing`)).toBeInTheDocument();
  });

  it('applies the correct styling', () => {
    // Act
    const { container } = render(<Footer />);

    // Assert
    const footerElement = container.querySelector('footer');
    expect(footerElement).toHaveClass('w-full');
    expect(footerElement).toHaveClass('bg-background');
    expect(footerElement).toHaveClass('border-t');
  });

  it('centers the content horizontally and vertically', () => {
    // Act
    const { container } = render(<Footer />);

    // Assert
    const contentContainer = container.querySelector('.container');
    expect(contentContainer).toHaveClass('flex');
    expect(contentContainer).toHaveClass('justify-center');
    expect(contentContainer).toHaveClass('items-center');
  });
});
