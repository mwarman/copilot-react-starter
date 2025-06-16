import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('renders a checkbox with default properties', () => {
    // Arrange
    render(<Checkbox aria-label="Test checkbox" />);

    // Assert
    const checkbox = screen.getByRole('checkbox', { name: 'Test checkbox' });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveAttribute('data-slot', 'checkbox');
  });

  it('renders a checkbox with custom className', () => {
    // Arrange
    render(<Checkbox className="test-class" aria-label="Test checkbox" />);

    // Assert
    const checkbox = screen.getByRole('checkbox', { name: 'Test checkbox' });
    expect(checkbox).toHaveClass('test-class');
  });

  it('renders a checked checkbox when defaultChecked is true', () => {
    // Arrange
    render(<Checkbox defaultChecked aria-label="Test checkbox" />);

    // Assert
    const checkbox = screen.getByRole('checkbox', { name: 'Test checkbox' });
    expect(checkbox).toBeChecked();
  });

  it('renders a disabled checkbox', () => {
    // Arrange
    render(<Checkbox disabled aria-label="Test checkbox" />);

    // Assert
    const checkbox = screen.getByRole('checkbox', { name: 'Test checkbox' });
    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveClass('disabled:opacity-50');
  });

  it('calls onCheckedChange when checkbox is clicked', async () => {
    // Arrange
    const handleCheckedChange = vi.fn();
    const user = userEvent.setup();

    render(<Checkbox onCheckedChange={handleCheckedChange} aria-label="Test checkbox" />);

    // Act
    const checkbox = screen.getByRole('checkbox', { name: 'Test checkbox' });
    await user.click(checkbox);

    // Assert
    expect(handleCheckedChange).toHaveBeenCalledTimes(1);
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });

  it('toggles checked state when clicked multiple times', async () => {
    // Arrange
    const handleCheckedChange = vi.fn();
    const user = userEvent.setup();

    render(<Checkbox onCheckedChange={handleCheckedChange} aria-label="Test checkbox" />);

    // Act - click to check
    const checkbox = screen.getByRole('checkbox', { name: 'Test checkbox' });
    await user.click(checkbox);

    // Assert
    expect(handleCheckedChange).toHaveBeenNthCalledWith(1, true);

    // Act - click to uncheck
    await user.click(checkbox);

    // Assert
    expect(handleCheckedChange).toHaveBeenNthCalledWith(2, false);
  });

  it('renders with CheckboxIndicator when checked', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<Checkbox aria-label="Test checkbox" />);

    // Act
    const checkbox = screen.getByRole('checkbox', { name: 'Test checkbox' });
    await user.click(checkbox);

    // Assert
    const indicator = checkbox.querySelector('[data-slot="checkbox-indicator"]');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveClass('flex items-center justify-center');
  });

  it('renders as checked when controlled', () => {
    // Arrange
    render(<Checkbox checked aria-label="Test checkbox" />);

    // Assert
    const checkbox = screen.getByRole('checkbox', { name: 'Test checkbox' });
    expect(checkbox).toBeChecked();
  });

  it('forwards additional props to the checkbox element', () => {
    // Arrange
    render(<Checkbox data-testid="custom-checkbox" id="agreement" aria-label="Test checkbox" />);

    // Assert
    const checkbox = screen.getByTestId('custom-checkbox');
    expect(checkbox).toHaveAttribute('id', 'agreement');
    expect(checkbox).toHaveAttribute('data-testid', 'custom-checkbox');
  });

  it('renders with a check icon when checked', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<Checkbox aria-label="Test checkbox" />);

    // Act
    const checkbox = screen.getByRole('checkbox', { name: 'Test checkbox' });
    await user.click(checkbox);

    // Assert
    const checkIcon = checkbox.querySelector('svg');
    expect(checkIcon).toBeInTheDocument();
    expect(checkIcon).toHaveClass('size-3.5');
  });

  it('changes visual styles when checked', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<Checkbox aria-label="Test checkbox" />);

    const checkbox = screen.getByRole('checkbox', { name: 'Test checkbox' });

    // Act
    await user.click(checkbox);

    // Assert
    expect(checkbox).toHaveAttribute('data-state', 'checked');
  });

  it('maintains focus styles when focused', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<Checkbox aria-label="Test checkbox" />);

    // Act
    const checkbox = screen.getByRole('checkbox', { name: 'Test checkbox' });
    await user.tab(); // Move focus to the checkbox

    // Assert
    expect(checkbox).toHaveFocus();
  });

  it('integrates with a label for accessibility', () => {
    // Arrange
    render(
      <div>
        <Checkbox id="terms" />
        <label htmlFor="terms">Accept terms and conditions</label>
      </div>,
    );

    // Assert
    const checkbox = screen.getByLabelText('Accept terms and conditions');
    expect(checkbox).toBeInTheDocument();
  });
});
