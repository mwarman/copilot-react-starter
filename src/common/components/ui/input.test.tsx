import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Input } from './input';

describe('Input', () => {
  it('renders an input element', () => {
    // Arrange & Act
    render(<Input data-testid="test-input" />);

    // Assert
    expect(screen.getByTestId('test-input')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    // Arrange & Act
    render(<Input data-testid="test-input" className="custom-class" />);

    // Assert
    expect(screen.getByTestId('test-input')).toHaveClass('custom-class');
  });

  it('handles user input correctly', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<Input data-testid="test-input" />);
    const input = screen.getByTestId('test-input');

    // Act
    await user.type(input, 'test input');

    // Assert
    expect(input).toHaveValue('test input');
  });

  it('passes through other props', () => {
    // Arrange & Act
    render(<Input data-testid="test-input" placeholder="Test placeholder" aria-label="Test label" />);

    // Assert
    const input = screen.getByTestId('test-input');
    expect(input).toHaveAttribute('placeholder', 'Test placeholder');
    expect(input).toHaveAttribute('aria-label', 'Test label');
  });
});
