import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Checkbox } from './checkbox';

// Mock the cn utility
vi.mock('@/common/utils/css', () => ({
  cn: vi.fn((...inputs) => inputs.join(' ')),
}));

describe('Checkbox component', () => {
  it('renders with default styles', () => {
    // Arrange
    render(<Checkbox data-testid="test-checkbox" />);

    // Act
    const checkbox = screen.getByTestId('test-checkbox');

    // Assert
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('data-slot', 'checkbox');
  });

  it('applies custom className when provided', () => {
    // Arrange
    const customClass = 'my-custom-class';

    // Act
    render(<Checkbox data-testid="test-checkbox" className={customClass} />);
    const checkbox = screen.getByTestId('test-checkbox');

    // Assert
    expect(checkbox).toHaveClass(customClass);
  });

  it('handles checked state correctly', async () => {
    // Arrange
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox data-testid="test-checkbox" onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByTestId('test-checkbox');

    // Act
    await user.click(checkbox);

    // Assert
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('handles unchecked state correctly', async () => {
    // Arrange
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox data-testid="test-checkbox" checked={true} onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByTestId('test-checkbox');

    // Act
    await user.click(checkbox);

    // Assert
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it('renders the CheckIcon when checked', () => {
    // Arrange & Act
    render(<Checkbox data-testid="test-checkbox" checked={true} />);

    // Assert
    const indicator = screen.getByTestId('test-checkbox');
    const svg = indicator.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('does not render the CheckIcon when unchecked', () => {
    // Arrange & Act
    render(<Checkbox data-testid="test-checkbox" checked={false} />);

    // Assert
    const indicator = screen.getByTestId('test-checkbox');
    expect(indicator.querySelector('svg')).toBeNull();
  });

  it('is disabled when disabled prop is true', () => {
    // Arrange & Act
    render(<Checkbox data-testid="test-checkbox" disabled />);
    const checkbox = screen.getByTestId('test-checkbox');

    // Assert
    expect(checkbox).toBeDisabled();
  });

  it('does not call onCheckedChange when disabled', async () => {
    // Arrange
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox data-testid="test-checkbox" disabled onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByTestId('test-checkbox');

    // Act
    await user.click(checkbox);

    // Assert
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('forwards additional props to the checkbox element', () => {
    // Arrange & Act
    render(<Checkbox data-testid="test-checkbox" aria-label="Test checkbox" value="test-value" />);
    const checkbox = screen.getByTestId('test-checkbox');

    // Assert
    expect(checkbox).toHaveAttribute('aria-label', 'Test checkbox');
    expect(checkbox).toHaveAttribute('value', 'test-value');
  });
});
