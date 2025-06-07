import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { TaskFilterBar } from './TaskFilterBar';

describe('TaskFilterBar', () => {
  const defaultProps = {
    filterText: '',
    onFilterChange: vi.fn(),
    filteredCount: 10,
    totalCount: 20,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the filter input and item count', () => {
    // Arrange & Act
    render(<TaskFilterBar {...defaultProps} />);

    // Assert
    expect(screen.getByTestId('task-filter-input')).toBeInTheDocument();
    expect(screen.getByText('10 of 20 items')).toBeInTheDocument();
  });

  it('should show singular "item" when total count is 1', () => {
    // Arrange & Act
    render(<TaskFilterBar {...defaultProps} filteredCount={1} totalCount={1} />);

    // Assert
    expect(screen.getByText('1 of 1 item')).toBeInTheDocument();
  });

  it('should call onFilterChange when typing in the input', () => {
    // Arrange
    render(<TaskFilterBar {...defaultProps} />);
    const input = screen.getByTestId('task-filter-input');

    // Act
    fireEvent.change(input, { target: { value: 'test' } });

    // Assert
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith('test');
  });

  it('should not show clear button when filter text is empty', () => {
    // Arrange & Act
    render(<TaskFilterBar {...defaultProps} filterText="" />);

    // Assert
    expect(screen.queryByTestId('clear-filter-button')).not.toBeInTheDocument();
  });

  it('should show clear button when filter text exists', () => {
    // Arrange & Act
    render(<TaskFilterBar {...defaultProps} filterText="test" />);

    // Assert
    expect(screen.getByTestId('clear-filter-button')).toBeInTheDocument();
  });

  it('should call onFilterChange with empty string when clear button is clicked', () => {
    // Arrange
    render(<TaskFilterBar {...defaultProps} filterText="test" />);
    const clearButton = screen.getByTestId('clear-filter-button');

    // Act
    fireEvent.click(clearButton);

    // Assert
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith('');
  });
});
