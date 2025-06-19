import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog';

describe('AlertDialog Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('AlertDialog', () => {
    it('renders dialog when open', () => {
      // Arrange & Act
      render(
        <AlertDialog open={true}>
          <AlertDialogContent data-testid="content">Test Content</AlertDialogContent>
        </AlertDialog>,
      );

      // Assert
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('forwards all props to the underlying primitive', () => {
      // Arrange
      const mockOnOpenChange = vi.fn();

      // Act
      render(
        <AlertDialog open={true} onOpenChange={mockOnOpenChange}>
          <AlertDialogContent data-testid="content">Test Content</AlertDialogContent>
        </AlertDialog>,
      );

      // Assert
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });
  });

  describe('AlertDialogTrigger', () => {
    it('renders with data-slot attribute', () => {
      // Arrange & Act
      render(
        <AlertDialog>
          <AlertDialogTrigger data-testid="trigger">Open Dialog</AlertDialogTrigger>
        </AlertDialog>,
      );

      // Assert
      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveAttribute('data-slot', 'alert-dialog-trigger');
    });

    it('opens dialog when clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      render(
        <AlertDialog>
          <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Dialog Title</AlertDialogTitle>
          </AlertDialogContent>
        </AlertDialog>,
      );

      // Act
      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));

      // Assert
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Dialog Title' })).toBeInTheDocument();
    });
  });

  describe('AlertDialogPortal', () => {
    it('portals content correctly', () => {
      // Arrange & Act
      render(
        <AlertDialog open={true}>
          <AlertDialogPortal>
            <AlertDialogContent data-testid="content">Test Content</AlertDialogContent>
          </AlertDialogPortal>
        </AlertDialog>,
      );

      // Assert
      // Portal content should be rendered in the document
      expect(screen.getByTestId('content')).toBeInTheDocument();
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });
  });

  describe('AlertDialogOverlay', () => {
    it('renders with default classes when dialog is open', () => {
      // Arrange & Act
      render(
        <AlertDialog open={true}>
          <AlertDialogContent>Test Content</AlertDialogContent>
        </AlertDialog>,
      );

      // Assert
      // Overlay is automatically rendered by AlertDialogContent
      const overlay = document.querySelector('[data-slot="alert-dialog-overlay"]');
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveClass(
        'data-[state=open]:animate-in',
        'data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0',
        'data-[state=open]:fade-in-0',
        'fixed',
        'inset-0',
        'z-50',
        'bg-black/50',
      );
    });

    it('can be customized with explicit overlay', () => {
      // Arrange
      const customClass = 'custom-overlay-class';

      // Act
      render(
        <AlertDialog open={true}>
          <AlertDialogPortal>
            <AlertDialogOverlay className={customClass} />
            <AlertDialogContent>Test Content</AlertDialogContent>
          </AlertDialogPortal>
        </AlertDialog>,
      );

      // Assert
      const overlay = document.querySelector('[data-slot="alert-dialog-overlay"]');
      expect(overlay).toHaveClass(customClass);
      expect(overlay).toHaveClass('fixed', 'inset-0'); // Should maintain default classes
    });
  });

  describe('AlertDialogContent', () => {
    it('renders with default classes and data-slot attribute', () => {
      // Arrange & Act
      render(
        <AlertDialog open={true}>
          <AlertDialogContent data-testid="content">Test Content</AlertDialogContent>
        </AlertDialog>,
      );

      // Assert
      const content = screen.getByTestId('content');
      expect(content).toHaveAttribute('data-slot', 'alert-dialog-content');
      expect(content).toHaveClass(
        'bg-background',
        'data-[state=open]:animate-in',
        'data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0',
        'data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95',
        'data-[state=open]:zoom-in-95',
        'fixed',
        'top-[50%]',
        'left-[50%]',
        'z-50',
        'grid',
        'w-full',
        'max-w-[calc(100%-2rem)]',
        'translate-x-[-50%]',
        'translate-y-[-50%]',
        'gap-4',
        'rounded-lg',
        'border',
        'p-6',
        'shadow-lg',
        'duration-200',
        'sm:max-w-lg',
      );
    });

    it('applies custom className', () => {
      // Arrange
      const customClass = 'custom-content-class';

      // Act
      render(
        <AlertDialog open={true}>
          <AlertDialogContent data-testid="content" className={customClass}>
            Test Content
          </AlertDialogContent>
        </AlertDialog>,
      );

      // Assert
      const content = screen.getByTestId('content');
      expect(content).toHaveClass(customClass);
      expect(content).toHaveClass('bg-background', 'fixed'); // Should maintain default classes
    });

    it('renders children content', () => {
      // Arrange & Act
      render(
        <AlertDialog open={true}>
          <AlertDialogContent>
            <span>Child Content</span>
          </AlertDialogContent>
        </AlertDialog>,
      );

      // Assert
      expect(screen.getByText('Child Content')).toBeInTheDocument();
    });
  });

  describe('AlertDialogHeader', () => {
    it('renders with default classes and data-slot attribute', () => {
      // Arrange & Act
      render(<AlertDialogHeader data-testid="header">Header Content</AlertDialogHeader>);

      // Assert
      const header = screen.getByTestId('header');
      expect(header).toHaveAttribute('data-slot', 'alert-dialog-header');
      expect(header).toHaveClass('flex', 'flex-col', 'gap-2', 'text-center', 'sm:text-left');
    });

    it('applies custom className', () => {
      // Arrange
      const customClass = 'custom-header-class';

      // Act
      render(
        <AlertDialogHeader data-testid="header" className={customClass}>
          Header Content
        </AlertDialogHeader>,
      );

      // Assert
      const header = screen.getByTestId('header');
      expect(header).toHaveClass(customClass);
      expect(header).toHaveClass('flex', 'flex-col'); // Should maintain default classes
    });
  });

  describe('AlertDialogFooter', () => {
    it('renders with default classes and data-slot attribute', () => {
      // Arrange & Act
      render(<AlertDialogFooter data-testid="footer">Footer Content</AlertDialogFooter>);

      // Assert
      const footer = screen.getByTestId('footer');
      expect(footer).toHaveAttribute('data-slot', 'alert-dialog-footer');
      expect(footer).toHaveClass('flex', 'flex-col-reverse', 'gap-2', 'sm:flex-row', 'sm:justify-end');
    });

    it('applies custom className', () => {
      // Arrange
      const customClass = 'custom-footer-class';

      // Act
      render(
        <AlertDialogFooter data-testid="footer" className={customClass}>
          Footer Content
        </AlertDialogFooter>,
      );

      // Assert
      const footer = screen.getByTestId('footer');
      expect(footer).toHaveClass(customClass);
      expect(footer).toHaveClass('flex', 'flex-col-reverse'); // Should maintain default classes
    });
  });

  describe('AlertDialogTitle', () => {
    it('renders with default classes and data-slot attribute', () => {
      // Arrange & Act
      render(
        <AlertDialog open={true}>
          <AlertDialogContent>
            <AlertDialogTitle data-testid="title">Dialog Title</AlertDialogTitle>
          </AlertDialogContent>
        </AlertDialog>,
      );

      // Assert
      const title = screen.getByTestId('title');
      expect(title).toHaveAttribute('data-slot', 'alert-dialog-title');
      expect(title).toHaveClass('text-lg', 'font-semibold');
      expect(title).toHaveRole('heading');
    });

    it('applies custom className', () => {
      // Arrange
      const customClass = 'custom-title-class';

      // Act
      render(
        <AlertDialog open={true}>
          <AlertDialogContent>
            <AlertDialogTitle data-testid="title" className={customClass}>
              Dialog Title
            </AlertDialogTitle>
          </AlertDialogContent>
        </AlertDialog>,
      );

      // Assert
      const title = screen.getByTestId('title');
      expect(title).toHaveClass(customClass);
      expect(title).toHaveClass('text-lg', 'font-semibold'); // Should maintain default classes
    });
  });

  describe('AlertDialogDescription', () => {
    it('renders with default classes and data-slot attribute', () => {
      // Arrange & Act
      render(
        <AlertDialog open={true}>
          <AlertDialogContent>
            <AlertDialogDescription data-testid="description">Dialog Description</AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>,
      );

      // Assert
      const description = screen.getByTestId('description');
      expect(description).toHaveAttribute('data-slot', 'alert-dialog-description');
      expect(description).toHaveClass('text-muted-foreground', 'text-sm');
    });

    it('applies custom className', () => {
      // Arrange
      const customClass = 'custom-description-class';

      // Act
      render(
        <AlertDialog open={true}>
          <AlertDialogContent>
            <AlertDialogDescription data-testid="description" className={customClass}>
              Dialog Description
            </AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>,
      );

      // Assert
      const description = screen.getByTestId('description');
      expect(description).toHaveClass(customClass);
      expect(description).toHaveClass('text-muted-foreground', 'text-sm'); // Should maintain default classes
    });
  });

  describe('AlertDialogAction', () => {
    it('renders with button variant classes', () => {
      // Arrange & Act
      render(
        <AlertDialog open={true}>
          <AlertDialogContent>
            <AlertDialogAction data-testid="action">Confirm</AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>,
      );

      // Assert
      const action = screen.getByTestId('action');
      expect(action).toHaveRole('button');
      // Should have button variant classes from buttonVariants()
      expect(action).toHaveClass('inline-flex', 'items-center', 'justify-center');
    });

    it('applies custom className', () => {
      // Arrange
      const customClass = 'custom-action-class';

      // Act
      render(
        <AlertDialog open={true}>
          <AlertDialogContent>
            <AlertDialogAction data-testid="action" className={customClass}>
              Confirm
            </AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>,
      );

      // Assert
      const action = screen.getByTestId('action');
      expect(action).toHaveClass(customClass);
      expect(action).toHaveClass('inline-flex', 'items-center'); // Should maintain button variant classes
    });

    it('closes dialog when clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockOnOpenChange = vi.fn();

      render(
        <AlertDialog open={true} onOpenChange={mockOnOpenChange}>
          <AlertDialogContent>
            <AlertDialogAction>Confirm</AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>,
      );

      // Act
      await user.click(screen.getByRole('button', { name: 'Confirm' }));

      // Assert
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('AlertDialogCancel', () => {
    it('renders with outline button variant classes', () => {
      // Arrange & Act
      render(
        <AlertDialog open={true}>
          <AlertDialogContent>
            <AlertDialogCancel data-testid="cancel">Cancel</AlertDialogCancel>
          </AlertDialogContent>
        </AlertDialog>,
      );

      // Assert
      const cancel = screen.getByTestId('cancel');
      expect(cancel).toHaveRole('button');
      // Should have outline button variant classes
      expect(cancel).toHaveClass('inline-flex', 'items-center', 'justify-center', 'border');
    });

    it('applies custom className', () => {
      // Arrange
      const customClass = 'custom-cancel-class';

      // Act
      render(
        <AlertDialog open={true}>
          <AlertDialogContent>
            <AlertDialogCancel data-testid="cancel" className={customClass}>
              Cancel
            </AlertDialogCancel>
          </AlertDialogContent>
        </AlertDialog>,
      );

      // Assert
      const cancel = screen.getByTestId('cancel');
      expect(cancel).toHaveClass(customClass);
      expect(cancel).toHaveClass('inline-flex', 'items-center', 'border'); // Should maintain outline variant classes
    });

    it('closes dialog when clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockOnOpenChange = vi.fn();

      render(
        <AlertDialog open={true} onOpenChange={mockOnOpenChange}>
          <AlertDialogContent>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogContent>
        </AlertDialog>,
      );

      // Act
      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      // Assert
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Complete AlertDialog Integration', () => {
    it('renders a complete alert dialog with all components', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockOnConfirm = vi.fn();
      const mockOnOpenChange = vi.fn();

      render(
        <AlertDialog open={true} onOpenChange={mockOnOpenChange}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Action</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={mockOnConfirm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>,
      );

      // Assert initial render
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Confirm Action' })).toBeInTheDocument();
      expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();

      // Act - click confirm
      await user.click(screen.getByRole('button', { name: 'Continue' }));

      // Assert
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it('handles keyboard navigation and accessibility', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockOnOpenChange = vi.fn();

      render(
        <AlertDialog open={true} onOpenChange={mockOnOpenChange}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Action</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>,
      );

      // Act - use keyboard to navigate and press Escape
      await user.keyboard('{Escape}');

      // Assert
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it('forwards all props correctly to underlying components', () => {
      // Arrange & Act
      render(
        <AlertDialog open={true}>
          <AlertDialogContent data-testid="content" role="dialog" aria-labelledby="title">
            <AlertDialogHeader data-testid="header" className="custom-header">
              <AlertDialogTitle data-testid="title" id="title">
                Test Title
              </AlertDialogTitle>
              <AlertDialogDescription data-testid="description" className="custom-description">
                Test Description
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter data-testid="footer" className="custom-footer">
              <AlertDialogCancel data-testid="cancel" disabled>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction data-testid="action" type="submit">
                Submit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>,
      );

      // Assert
      const content = screen.getByTestId('content');
      expect(content).toHaveAttribute('role', 'dialog');
      expect(content).toHaveAttribute('aria-labelledby', 'title');

      const header = screen.getByTestId('header');
      expect(header).toHaveClass('custom-header');

      const title = screen.getByTestId('title');
      expect(title).toHaveAttribute('id', 'title');

      const description = screen.getByTestId('description');
      expect(description).toHaveClass('custom-description');

      const footer = screen.getByTestId('footer');
      expect(footer).toHaveClass('custom-footer');

      const cancel = screen.getByTestId('cancel');
      expect(cancel).toBeDisabled();

      const action = screen.getByTestId('action');
      expect(action).toHaveAttribute('type', 'submit');
    });
  });
});
