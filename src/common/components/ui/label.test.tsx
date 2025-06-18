import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Label } from './label';

describe('Label', () => {
  it('renders with default props', () => {
    // Arrange & Act
    render(<Label>Test Label</Label>);

    // Assert
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('data-slot', 'label');
  });

  it('applies default CSS classes', () => {
    // Arrange & Act
    render(<Label>Test Label</Label>);

    // Assert
    const label = screen.getByText('Test Label');
    expect(label).toHaveClass(
      'flex',
      'items-center',
      'gap-2',
      'text-sm',
      'leading-none',
      'font-medium',
      'select-none',
      'group-data-[disabled=true]:pointer-events-none',
      'group-data-[disabled=true]:opacity-50',
      'peer-disabled:cursor-not-allowed',
      'peer-disabled:opacity-50',
    );
  });

  it('accepts and applies custom className', () => {
    // Arrange
    const customClass = 'custom-label-class';

    // Act
    render(<Label className={customClass}>Test Label</Label>);

    // Assert
    const label = screen.getByText('Test Label');
    expect(label).toHaveClass(customClass);
    // Should also maintain default classes
    expect(label).toHaveClass('flex', 'items-center');
  });

  it('forwards all props to the underlying element', () => {
    // Arrange
    const testId = 'test-label';
    const htmlFor = 'input-field';

    // Act
    render(
      <Label data-testid={testId} htmlFor={htmlFor}>
        Test Label
      </Label>,
    );

    // Assert
    const label = screen.getByTestId(testId);
    expect(label).toHaveAttribute('for', htmlFor);
  });

  it('renders with custom attributes', () => {
    // Arrange
    const ariaLabel = 'Custom aria label';
    const role = 'button';

    // Act
    render(
      <Label aria-label={ariaLabel} role={role}>
        Test Label
      </Label>,
    );

    // Assert
    const label = screen.getByText('Test Label');
    expect(label).toHaveAttribute('aria-label', ariaLabel);
    expect(label).toHaveAttribute('role', role);
  });

  it('renders without children', () => {
    // Arrange & Act
    render(<Label data-testid="empty-label" />);

    // Assert
    const label = screen.getByTestId('empty-label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('data-slot', 'label');
  });

  it('merges className with default classes correctly', () => {
    // Arrange
    const customClasses = 'text-lg font-bold text-red-500';

    // Act
    render(<Label className={customClasses}>Styled Label</Label>);

    // Assert
    const label = screen.getByText('Styled Label');
    // Should have both default and custom classes
    expect(label).toHaveClass('flex', 'items-center'); // default
    expect(label).toHaveClass('text-lg', 'font-bold', 'text-red-500'); // custom
  });

  it('handles complex children content', () => {
    // Arrange & Act
    render(
      <Label>
        <span>Complex</span>
        <strong>Label</strong>
        Content
      </Label>,
    );

    // Assert
    const label = screen.getByText('Complex');
    expect(label.closest('[data-slot="label"]')).toBeInTheDocument();
    expect(screen.getByText('Label')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies data-slot attribute consistently', () => {
    // Arrange & Act
    render(
      <>
        <Label data-testid="label-1">Label 1</Label>
        <Label data-testid="label-2">Label 2</Label>
      </>,
    );

    // Assert
    expect(screen.getByTestId('label-1')).toHaveAttribute('data-slot', 'label');
    expect(screen.getByTestId('label-2')).toHaveAttribute('data-slot', 'label');
  });
});
