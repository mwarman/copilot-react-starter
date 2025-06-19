import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConfirmationDialog } from './ConfirmationDialog';

describe('ConfirmationDialog', () => {
  const mockOnConfirm = vi.fn();
  const mockOnOpenChange = vi.fn();

  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    title: 'Delete Task',
    description: 'Are you sure you want to delete this task?',
    onConfirm: mockOnConfirm,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dialog with title and description', () => {
    // Arrange & Act
    render(<ConfirmationDialog {...defaultProps} />);

    // Assert
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Delete Task' })).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this task?')).toBeInTheDocument();
  });

  it('renders default button texts', () => {
    // Arrange & Act
    render(<ConfirmationDialog {...defaultProps} />);

    // Assert
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('renders custom button texts', () => {
    // Arrange & Act
    render(<ConfirmationDialog {...defaultProps} confirmText="Remove" cancelText="Keep" />);

    // Assert
    expect(screen.getByRole('button', { name: 'Keep' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<ConfirmationDialog {...defaultProps} />);

    // Act
    const confirmButton = screen.getByRole('button', { name: 'Delete' });
    await user.click(confirmButton);

    // Assert
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onOpenChange when cancel button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<ConfirmationDialog {...defaultProps} />);

    // Act
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    // Assert
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('disables buttons when loading', () => {
    // Arrange & Act
    render(<ConfirmationDialog {...defaultProps} isLoading={true} />);

    // Assert
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Deleting...' })).toBeDisabled();
  });

  it('shows loading text when isLoading is true', () => {
    // Arrange & Act
    render(<ConfirmationDialog {...defaultProps} isLoading={true} />);

    // Assert
    expect(screen.getByRole('button', { name: 'Deleting...' })).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    // Arrange & Act
    render(<ConfirmationDialog {...defaultProps} open={false} />);

    // Assert
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });
});
