import { render, screen } from '@testing-library/react';
import { describe, expect, it, afterEach } from 'vitest';
import { Footer } from './Footer';

describe('Footer', () => {
  // Store the original Date constructor
  const RealDate = Date;

  // Mock date to return a specific year for testing
  const mockDate = (year: number) => {
    // @ts-expect-error - mocking date
    global.Date = class extends RealDate {
      constructor() {
        super();
      }
      getFullYear() {
        return year;
      }
    };
  };

  // Restore the original Date constructor after tests
  afterEach(() => {
    global.Date = RealDate;
  });

  it('renders correctly with the current year', () => {
    // Arrange
    mockDate(2025);

    // Act
    render(<Footer />);

    // Assert
    expect(screen.getByText(/© 2025 learnBYdoing/)).toBeInTheDocument();
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('bg-slate-100');
    expect(footer).toHaveClass('dark:bg-slate-900');
  });
});
