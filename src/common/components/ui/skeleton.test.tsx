import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton } from './skeleton';

describe('Skeleton', () => {
  it('renders with default class names', () => {
    // Arrange
    render(<Skeleton data-testid="skeleton" />);

    // Act
    const skeleton = screen.getByTestId('skeleton');

    // Assert
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass('bg-accent', 'animate-pulse', 'rounded-md');
  });

  it('merges custom class names with default ones', () => {
    // Arrange
    render(<Skeleton data-testid="skeleton" className="h-10 w-20 custom-class" />);

    // Act
    const skeleton = screen.getByTestId('skeleton');

    // Assert
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass('bg-accent', 'animate-pulse', 'rounded-md', 'h-10', 'w-20', 'custom-class');
  });

  it('passes additional props to the div element', () => {
    // Arrange
    const testId = 'skeleton';
    const ariaLabel = 'Loading content';

    // Act
    render(<Skeleton data-testid={testId} aria-label={ariaLabel} />);
    const skeleton = screen.getByTestId(testId);

    // Assert
    expect(skeleton).toHaveAttribute('aria-label', ariaLabel);
    expect(skeleton).toHaveAttribute('data-slot', 'skeleton');
  });
});
