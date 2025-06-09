import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Label } from './label';

describe('Label component', () => {
  it('renders with default styles', () => {
    // Arrange
    render(<Label htmlFor="test">Test Label</Label>);

    // Act
    const label = screen.getByText('Test Label');

    // Assert
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'test');
    expect(label).toHaveClass('flex items-center gap-2 text-sm leading-none');
  });

  it('applies custom className when provided', () => {
    // Arrange
    const customClass = 'text-red-500 font-bold';

    // Act
    render(
      <Label htmlFor="test" className={customClass}>
        Test Label
      </Label>,
    );
    const label = screen.getByText('Test Label');

    // Assert
    expect(label).toHaveClass(customClass);
    // Verify a subset of the default classes are still applied
    expect(label).toHaveClass('flex');
    expect(label).toHaveClass('items-center');
    expect(label).toHaveClass('gap-2');
  });

  it('passes additional props to the label element', () => {
    // Arrange
    const dataTestId = 'test-label';

    // Act
    render(
      <Label htmlFor="test" data-testid={dataTestId}>
        Test Label
      </Label>,
    );
    const label = screen.getByTestId(dataTestId);

    // Assert
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'test');
  });
});
