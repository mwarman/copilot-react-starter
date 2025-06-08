import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { FilterButton } from './FilterButton';
import { Circle } from 'lucide-react';

describe('FilterButton', () => {
  const defaultProps = {
    label: 'Test Filter',
    icon: Circle,
    isActive: false,
    onClick: vi.fn(),
    testId: 'test-filter-button',
  };

  it('should render with the provided label', () => {
    // Arrange & Act
    render(<FilterButton {...defaultProps} />);

    // Assert
    expect(screen.getByText('Test Filter')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    // Arrange
    render(<FilterButton {...defaultProps} />);
    const button = screen.getByTestId('test-filter-button');

    // Act
    fireEvent.click(button);

    // Assert
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('should use outline variant when inactive', () => {
    // Arrange & Act
    render(<FilterButton {...defaultProps} isActive={false} />);
    const button = screen.getByTestId('test-filter-button');

    // Assert
    expect(button).toHaveClass('bg-background');
    expect(button).not.toHaveClass('bg-primary');
  });

  it('should use default variant when active', () => {
    // Arrange & Act
    render(<FilterButton {...defaultProps} isActive={true} />);
    const button = screen.getByTestId('test-filter-button');

    // Assert
    expect(button).toHaveClass('bg-primary');
    expect(button).not.toHaveClass('bg-background');
  });

  it('should set aria-pressed attribute based on isActive', () => {
    // Arrange & Act
    const { rerender } = render(<FilterButton {...defaultProps} isActive={false} />);
    const inactiveButton = screen.getByTestId('test-filter-button');

    // Assert
    expect(inactiveButton).toHaveAttribute('aria-pressed', 'false');

    // Act - rerender with isActive=true
    rerender(<FilterButton {...defaultProps} isActive={true} />);
    const activeButton = screen.getByTestId('test-filter-button');

    // Assert
    expect(activeButton).toHaveAttribute('aria-pressed', 'true');
  });
});
