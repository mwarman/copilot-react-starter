import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TaskFilterBar, type FilterOptions } from './TaskFilterBar';

describe('TaskFilterBar', () => {
  const mockOnFilterChange = vi.fn();
  const mockOnFilterOptionsChange = vi.fn();
  const defaultFilterOptions: FilterOptions = {
    showComplete: false,
    showIncomplete: false,
    showOverdue: false,
  };

  it('renders with placeholder text', () => {
    // Arrange
    const filteredCount = 10;
    const totalCount = 10;

    // Act
    render(
      <TaskFilterBar
        onFilterChange={mockOnFilterChange}
        onFilterOptionsChange={mockOnFilterOptionsChange}
        filterOptions={defaultFilterOptions}
        filteredCount={filteredCount}
        totalCount={totalCount}
      />,
    );

    // Assert
    expect(screen.getByPlaceholderText('Filter tasks...')).toBeInTheDocument();
  });

  it('displays the correct count', () => {
    // Arrange
    const filteredCount = 5;
    const totalCount = 10;

    // Act
    render(
      <TaskFilterBar
        onFilterChange={mockOnFilterChange}
        onFilterOptionsChange={mockOnFilterOptionsChange}
        filterOptions={defaultFilterOptions}
        filteredCount={filteredCount}
        totalCount={totalCount}
      />,
    );

    // Assert
    expect(screen.getByText('SHOWING 5 OF 10')).toBeInTheDocument();
  });

  it('shows clear button when text is entered', async () => {
    // Arrange
    const user = userEvent.setup();
    const filteredCount = 3;
    const totalCount = 10;

    render(
      <TaskFilterBar
        onFilterChange={mockOnFilterChange}
        onFilterOptionsChange={mockOnFilterOptionsChange}
        filterOptions={defaultFilterOptions}
        filteredCount={filteredCount}
        totalCount={totalCount}
      />,
    );

    const input = screen.getByPlaceholderText('Filter tasks...');

    // Assert - Initially, clear button should not be visible
    expect(screen.queryByLabelText('Clear filter')).not.toBeInTheDocument();

    // Act - Enter text
    await user.type(input, 'test');

    // Assert - Clear button should now be visible
    expect(screen.getByLabelText('Clear filter')).toBeInTheDocument();
  });

  it('clears input when clear button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const filteredCount = 3;
    const totalCount = 10;

    render(
      <TaskFilterBar
        onFilterChange={mockOnFilterChange}
        onFilterOptionsChange={mockOnFilterOptionsChange}
        filterOptions={defaultFilterOptions}
        filteredCount={filteredCount}
        totalCount={totalCount}
      />,
    );

    const input = screen.getByPlaceholderText('Filter tasks...');

    // Act - Enter text
    await user.type(input, 'test');

    // Act - Click clear button
    await user.click(screen.getByLabelText('Clear filter'));

    // Assert - Input should be cleared
    expect(input).toHaveValue('');
  });
});

describe('Filter Buttons', () => {
  const mockOnFilterChange = vi.fn();
  const mockOnFilterOptionsChange = vi.fn();
  const defaultFilterOptions: FilterOptions = {
    showComplete: false,
    showIncomplete: false,
    showOverdue: false,
  };

  it('renders filter buttons correctly', () => {
    // Arrange
    const filteredCount = 10;
    const totalCount = 10;

    // Act
    render(
      <TaskFilterBar
        onFilterChange={mockOnFilterChange}
        onFilterOptionsChange={mockOnFilterOptionsChange}
        filterOptions={defaultFilterOptions}
        filteredCount={filteredCount}
        totalCount={totalCount}
      />,
    );

    // Assert
    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.getByText('Incomplete')).toBeInTheDocument();
    expect(screen.getByText('Overdue')).toBeInTheDocument();
  });

  it('toggles filter buttons correctly', async () => {
    // Arrange
    const user = userEvent.setup();
    const filteredCount = 10;
    const totalCount = 10;

    render(
      <TaskFilterBar
        onFilterChange={mockOnFilterChange}
        onFilterOptionsChange={mockOnFilterOptionsChange}
        filterOptions={defaultFilterOptions}
        filteredCount={filteredCount}
        totalCount={totalCount}
      />,
    );

    // Act - Click the Complete button
    await user.click(screen.getByText('Complete'));

    // Assert
    expect(mockOnFilterOptionsChange).toHaveBeenCalledWith({
      ...defaultFilterOptions,
      showComplete: true,
    });
  });

  it('renders active buttons with different styling', () => {
    // Arrange
    const filteredCount = 5;
    const totalCount = 10;
    const activeFilterOptions: FilterOptions = {
      showComplete: true,
      showIncomplete: false,
      showOverdue: false,
    };

    // Act
    render(
      <TaskFilterBar
        onFilterChange={mockOnFilterChange}
        onFilterOptionsChange={mockOnFilterOptionsChange}
        filterOptions={activeFilterOptions}
        filteredCount={filteredCount}
        totalCount={totalCount}
      />,
    );

    // Assert - Complete button should have default variant (filled)
    const completeButton = screen.getByText('Complete').closest('button');
    const incompleteButton = screen.getByText('Incomplete').closest('button');

    expect(completeButton).toHaveClass('bg-primary'); // Default variant has bg color
    expect(incompleteButton).toHaveClass('border'); // Outline variant has border
  });
});
