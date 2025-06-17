import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './input';

describe('Input', () => {
  it('renders an input element correctly', () => {
    // Arrange
    render(<Input placeholder="Enter text" />);

    // Act
    const inputElement = screen.getByPlaceholderText('Enter text');

    // Assert
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('data-slot', 'input');
  });

  it('applies custom className when provided', () => {
    // Arrange
    const customClass = 'custom-class';
    render(<Input placeholder="Test input" className={customClass} />);

    // Act
    const inputElement = screen.getByPlaceholderText('Test input');

    // Assert
    expect(inputElement).toHaveClass(customClass);
  });

  it('passes through custom attributes to the input element', () => {
    // Arrange
    render(<Input placeholder="Custom attributes" data-testid="test-input" maxLength={10} disabled />);

    // Act
    const inputElement = screen.getByPlaceholderText('Custom attributes');

    // Assert
    expect(inputElement).toHaveAttribute('data-testid', 'test-input');
    expect(inputElement).toHaveAttribute('maxLength', '10');
    expect(inputElement).toBeDisabled();
  });

  it('respects the type prop when provided', () => {
    // Arrange
    render(<Input type="password" placeholder="Password field" />);

    // Act
    const inputElement = screen.getByPlaceholderText('Password field');

    // Assert
    expect(inputElement).toHaveAttribute('type', 'password');
  });

  it('handles user input correctly', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<Input placeholder="Type here" />);

    // Act
    const inputElement = screen.getByPlaceholderText('Type here');
    await user.type(inputElement, 'Hello, world!');

    // Assert
    expect(inputElement).toHaveValue('Hello, world!');
  });

  it('applies aria-invalid styling when aria-invalid is true', () => {
    // Arrange
    render(<Input placeholder="Invalid input" aria-invalid={true} />);

    // Act
    const inputElement = screen.getByPlaceholderText('Invalid input');

    // Assert
    expect(inputElement).toHaveAttribute('aria-invalid', 'true');
    // We can't test exact styles but we can verify the attribute is passed correctly
  });
});
