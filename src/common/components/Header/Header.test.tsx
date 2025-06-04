import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Header } from './Header';

describe('Header', () => {
  it('renders the application name', () => {
    // Arrange
    render(<Header />);

    // Act
    const heading = screen.getByRole('heading', { name: /task hero/i });

    // Assert
    expect(heading).toBeInTheDocument();
  });

  it('has the correct styling', () => {
    // Arrange
    render(<Header />);

    // Act
    const header = screen.getByRole('banner');

    // Assert
    expect(header).toHaveClass('w-full');
    expect(header).toHaveClass('bg-background');
    expect(header).toHaveClass('border-b');
  });
});
