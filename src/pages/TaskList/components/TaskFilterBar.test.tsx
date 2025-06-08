import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { TaskFilterBar } from './TaskFilterBar';
import { type TaskFilters } from '../hooks/useFilterTasks';

describe('TaskFilterBar', () => {
  const defaultProps = {
    filterText: '',
    onFilterChange: vi.fn(),
    filteredCount: 10,
    totalCount: 20,
    filters: {
      showComplete: false,
      showIncomplete: false,
      showOverdue: false,
    } as TaskFilters,
    onFilterToggle: vi.fn(),
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

  it('should render all three filter buttons', () => {
    // Arrange & Act
    render(<TaskFilterBar {...defaultProps} />);

    // Assert
    expect(screen.getByTestId('filter-complete-button')).toBeInTheDocument();
    expect(screen.getByTestId('filter-incomplete-button')).toBeInTheDocument();
    expect(screen.getByTestId('filter-overdue-button')).toBeInTheDocument();
  });

  it('should call onFilterToggle with correct filter name when Complete button is clicked', () => {
    // Arrange
    render(<TaskFilterBar {...defaultProps} />);
    const completeButton = screen.getByTestId('filter-complete-button');

    // Act
    fireEvent.click(completeButton);

    // Assert
    expect(defaultProps.onFilterToggle).toHaveBeenCalledWith('showComplete');
  });

  it('should call onFilterToggle with correct filter name when Incomplete button is clicked', () => {
    // Arrange
    render(<TaskFilterBar {...defaultProps} />);
    const incompleteButton = screen.getByTestId('filter-incomplete-button');

    // Act
    fireEvent.click(incompleteButton);

    // Assert
    expect(defaultProps.onFilterToggle).toHaveBeenCalledWith('showIncomplete');
  });

  it('should call onFilterToggle with correct filter name when Overdue button is clicked', () => {
    // Arrange
    render(<TaskFilterBar {...defaultProps} />);
    const overdueButton = screen.getByTestId('filter-overdue-button');

    // Act
    fireEvent.click(overdueButton);

    // Assert
    expect(defaultProps.onFilterToggle).toHaveBeenCalledWith('showOverdue');
  });

  it('should display active state for filter buttons when corresponding filter is active', () => {
    // Arrange & Act
    render(
      <TaskFilterBar
        {...defaultProps}
        filters={{
          showComplete: true,
          showIncomplete: false,
          showOverdue: false,
        }}
      />,
    );

    // Assert
    const completeButton = screen.getByTestId('filter-complete-button');
    expect(completeButton).toHaveClass('bg-primary');
    expect(completeButton).toHaveAttribute('aria-pressed', 'true');

    const incompleteButton = screen.getByTestId('filter-incomplete-button');
    expect(incompleteButton).not.toHaveClass('bg-primary');
    expect(incompleteButton).toHaveAttribute('aria-pressed', 'false');
  });
});
