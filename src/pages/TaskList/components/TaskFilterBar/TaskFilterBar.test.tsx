import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TaskFilterBar } from './TaskFilterBar';

describe('TaskFilterBar', () => {
  const mockOnFilterChange = vi.fn();

  it('renders with placeholder text', () => {
    // Arrange
    const filteredCount = 10;
    const totalCount = 10;

    // Act
    render(<TaskFilterBar onFilterChange={mockOnFilterChange} filteredCount={filteredCount} totalCount={totalCount} />);

    // Assert
    expect(screen.getByPlaceholderText('Filter tasks...')).toBeInTheDocument();
  });

  it('displays the correct count', () => {
    // Arrange
    const filteredCount = 5;
    const totalCount = 10;

    // Act
    render(<TaskFilterBar onFilterChange={mockOnFilterChange} filteredCount={filteredCount} totalCount={totalCount} />);

    // Assert
    expect(screen.getByText('SHOWING 5 OF 10')).toBeInTheDocument();
  });

  it('shows clear button when text is entered', async () => {
    // Arrange
    const user = userEvent.setup();
    const filteredCount = 3;
    const totalCount = 10;

    render(<TaskFilterBar onFilterChange={mockOnFilterChange} filteredCount={filteredCount} totalCount={totalCount} />);

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

    render(<TaskFilterBar onFilterChange={mockOnFilterChange} filteredCount={filteredCount} totalCount={totalCount} />);

    const input = screen.getByPlaceholderText('Filter tasks...');

    // Act - Enter text
    await user.type(input, 'test');

    // Act - Click clear button
    await user.click(screen.getByLabelText('Clear filter'));

    // Assert - Input should be cleared
    expect(input).toHaveValue('');
  });
});
