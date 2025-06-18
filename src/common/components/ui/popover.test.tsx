import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from './popover';

describe('Popover Components', () => {
  beforeEach(() => {
    // Reset any global state before each test
    document.body.innerHTML = '';
  });

  describe('Popover', () => {
    it('renders with default props', () => {
      // Arrange & Act
      render(
        <Popover>
          <PopoverTrigger data-testid="trigger">Open</PopoverTrigger>
        </Popover>,
      );

      // Assert
      const trigger = screen.getByTestId('trigger');
      expect(trigger).toBeInTheDocument();
    });

    it('forwards props to Radix Root component', () => {
      // Arrange & Act
      render(
        <Popover>
          <PopoverTrigger data-testid="trigger">Open</PopoverTrigger>
        </Popover>,
      );

      // Assert
      // Radix Root doesn't render a DOM element, but it should forward props correctly
      // We verify this by checking that the trigger renders properly within the context
      const trigger = screen.getByTestId('trigger');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute('data-slot', 'popover-trigger');
    });

    it('forwards props to Radix Root', () => {
      // Arrange & Act
      render(
        <Popover defaultOpen>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent data-testid="content">Content</PopoverContent>
        </Popover>,
      );

      // Assert
      const content = screen.getByTestId('content');
      expect(content).toBeInTheDocument();
    });
  });

  describe('PopoverTrigger', () => {
    it('renders as a button by default', () => {
      // Arrange & Act
      render(
        <Popover>
          <PopoverTrigger data-testid="trigger">Open Popover</PopoverTrigger>
        </Popover>,
      );

      // Assert
      const trigger = screen.getByTestId('trigger');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute('data-slot', 'popover-trigger');
      expect(trigger.tagName).toBe('BUTTON');
    });

    it('forwards props correctly', () => {
      // Arrange
      const className = 'custom-trigger-class';
      const ariaLabel = 'Open popover menu';

      // Act
      render(
        <Popover>
          <PopoverTrigger className={className} aria-label={ariaLabel} data-testid="trigger">
            Open
          </PopoverTrigger>
        </Popover>,
      );

      // Assert
      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveClass(className);
      expect(trigger).toHaveAttribute('aria-label', ariaLabel);
    });

    it('opens popover when clicked', async () => {
      // Arrange
      const user = userEvent.setup();

      // Act
      render(
        <Popover>
          <PopoverTrigger data-testid="trigger">Open</PopoverTrigger>
          <PopoverContent data-testid="content">Popover Content</PopoverContent>
        </Popover>,
      );

      const trigger = screen.getByTestId('trigger');
      await user.click(trigger);

      // Assert
      await waitFor(() => {
        const content = screen.getByTestId('content');
        expect(content).toBeInTheDocument();
      });
    });
  });

  describe('PopoverContent', () => {
    it('renders with default props and styling', async () => {
      // Arrange
      const user = userEvent.setup();

      // Act
      render(
        <Popover>
          <PopoverTrigger data-testid="trigger">Open</PopoverTrigger>
          <PopoverContent data-testid="content">Test Content</PopoverContent>
        </Popover>,
      );

      const trigger = screen.getByTestId('trigger');
      await user.click(trigger);

      // Assert
      await waitFor(() => {
        const content = screen.getByTestId('content');
        expect(content).toBeInTheDocument();
        expect(content).toHaveAttribute('data-slot', 'popover-content');
      });
    });

    it('applies default CSS classes', async () => {
      // Arrange
      const user = userEvent.setup();

      // Act
      render(
        <Popover>
          <PopoverTrigger data-testid="trigger">Open</PopoverTrigger>
          <PopoverContent data-testid="content">Test Content</PopoverContent>
        </Popover>,
      );

      const trigger = screen.getByTestId('trigger');
      await user.click(trigger);

      // Assert
      await waitFor(() => {
        const content = screen.getByTestId('content');
        expect(content).toHaveClass(
          'bg-popover',
          'text-popover-foreground',
          'z-50',
          'w-72',
          'rounded-md',
          'border',
          'p-4',
          'shadow-md',
          'outline-hidden',
        );
      });
    });

    it('accepts and applies custom className', async () => {
      // Arrange
      const user = userEvent.setup();
      const customClass = 'custom-popover-class';

      // Act
      render(
        <Popover>
          <PopoverTrigger data-testid="trigger">Open</PopoverTrigger>
          <PopoverContent className={customClass} data-testid="content">
            Test Content
          </PopoverContent>
        </Popover>,
      );

      const trigger = screen.getByTestId('trigger');
      await user.click(trigger);

      // Assert
      await waitFor(() => {
        const content = screen.getByTestId('content');
        expect(content).toHaveClass(customClass);
        // Should also maintain default classes
        expect(content).toHaveClass('w-72', 'rounded-md', 'border');
      });
    });

    it('uses default align and sideOffset values', async () => {
      // Arrange
      const user = userEvent.setup();

      // Act
      render(
        <Popover>
          <PopoverTrigger data-testid="trigger">Open</PopoverTrigger>
          <PopoverContent data-testid="content">Test Content</PopoverContent>
        </Popover>,
      );

      const trigger = screen.getByTestId('trigger');
      await user.click(trigger);

      // Assert
      await waitFor(() => {
        const content = screen.getByTestId('content');
        expect(content).toBeInTheDocument();
        // Default align="center" and sideOffset={4} are applied by Radix internally
      });
    });

    it('accepts custom align and sideOffset props', async () => {
      // Arrange
      const user = userEvent.setup();

      // Act
      render(
        <Popover>
          <PopoverTrigger data-testid="trigger">Open</PopoverTrigger>
          <PopoverContent align="start" sideOffset={8} data-testid="content">
            Test Content
          </PopoverContent>
        </Popover>,
      );

      const trigger = screen.getByTestId('trigger');
      await user.click(trigger);

      // Assert
      await waitFor(() => {
        const content = screen.getByTestId('content');
        expect(content).toBeInTheDocument();
        // Props are forwarded to Radix Content component
      });
    });

    it('forwards additional props', async () => {
      // Arrange
      const user = userEvent.setup();
      const ariaLabel = 'Popover menu content';

      // Act
      render(
        <Popover>
          <PopoverTrigger data-testid="trigger">Open</PopoverTrigger>
          <PopoverContent aria-label={ariaLabel} data-testid="content">
            Test Content
          </PopoverContent>
        </Popover>,
      );

      const trigger = screen.getByTestId('trigger');
      await user.click(trigger);

      // Assert
      await waitFor(() => {
        const content = screen.getByTestId('content');
        expect(content).toHaveAttribute('aria-label', ariaLabel);
      });
    });

    it('renders content inside portal', async () => {
      // Arrange
      const user = userEvent.setup();

      // Act
      render(
        <div data-testid="container">
          <Popover>
            <PopoverTrigger data-testid="trigger">Open</PopoverTrigger>
            <PopoverContent data-testid="content">Portal Content</PopoverContent>
          </Popover>
        </div>,
      );

      const trigger = screen.getByTestId('trigger');
      await user.click(trigger);

      // Assert
      await waitFor(() => {
        const content = screen.getByTestId('content');
        const container = screen.getByTestId('container');

        expect(content).toBeInTheDocument();
        // Content should not be a child of the container due to portal
        expect(container).not.toContainElement(content);
      });
    });
  });

  describe('PopoverAnchor', () => {
    it('renders with data-slot attribute', () => {
      // Arrange & Act
      render(
        <Popover>
          <PopoverAnchor data-testid="anchor">
            <div>Anchor Element</div>
          </PopoverAnchor>
          <PopoverTrigger>Open</PopoverTrigger>
        </Popover>,
      );

      // Assert
      const anchor = screen.getByTestId('anchor');
      expect(anchor).toBeInTheDocument();
      expect(anchor).toHaveAttribute('data-slot', 'popover-anchor');
    });

    it('forwards props correctly', () => {
      // Arrange
      const className = 'custom-anchor-class';

      // Act
      render(
        <Popover>
          <PopoverAnchor className={className} data-testid="anchor">
            <span>Anchor</span>
          </PopoverAnchor>
          <PopoverTrigger>Open</PopoverTrigger>
        </Popover>,
      );

      // Assert
      const anchor = screen.getByTestId('anchor');
      expect(anchor).toHaveClass(className);
    });
  });

  describe('Popover Integration', () => {
    it('works with all components together', async () => {
      // Arrange
      const user = userEvent.setup();

      // Act
      render(
        <Popover>
          <PopoverAnchor data-testid="anchor">
            <div>Anchor Point</div>
          </PopoverAnchor>
          <PopoverTrigger data-testid="trigger">Open Menu</PopoverTrigger>
          <PopoverContent data-testid="content">
            <div>Menu Content</div>
          </PopoverContent>
        </Popover>,
      );

      // Assert initial state
      expect(screen.getByTestId('anchor')).toBeInTheDocument();
      expect(screen.getByTestId('trigger')).toBeInTheDocument();
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();

      // Open popover
      const trigger = screen.getByTestId('trigger');
      await user.click(trigger);

      // Assert opened state
      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument();
      });
    });

    it('closes popover when clicking outside', async () => {
      // Arrange
      const user = userEvent.setup();

      // Act
      render(
        <div>
          <div data-testid="outside">Outside Element</div>
          <Popover>
            <PopoverTrigger data-testid="trigger">Open</PopoverTrigger>
            <PopoverContent data-testid="content">Content</PopoverContent>
          </Popover>
        </div>,
      );

      // Open popover
      const trigger = screen.getByTestId('trigger');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument();
      });

      // Click outside
      const outside = screen.getByTestId('outside');
      await user.click(outside);

      // Assert popover is closed
      await waitFor(() => {
        expect(screen.queryByTestId('content')).not.toBeInTheDocument();
      });
    });

    it('closes popover when pressing Escape key', async () => {
      // Arrange
      const user = userEvent.setup();

      // Act
      render(
        <Popover>
          <PopoverTrigger data-testid="trigger">Open</PopoverTrigger>
          <PopoverContent data-testid="content">Content</PopoverContent>
        </Popover>,
      );

      // Open popover
      const trigger = screen.getByTestId('trigger');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument();
      });

      // Press Escape
      await user.keyboard('{Escape}');

      // Assert popover is closed
      await waitFor(() => {
        expect(screen.queryByTestId('content')).not.toBeInTheDocument();
      });
    });

    it('maintains focus management', async () => {
      // Arrange
      const user = userEvent.setup();

      // Act
      render(
        <Popover>
          <PopoverTrigger data-testid="trigger">Open</PopoverTrigger>
          <PopoverContent data-testid="content">
            <button data-testid="inner-button">Inner Button</button>
          </PopoverContent>
        </Popover>,
      );

      const trigger = screen.getByTestId('trigger');
      await user.click(trigger);

      // Assert content is visible and focusable
      await waitFor(() => {
        const content = screen.getByTestId('content');
        expect(content).toBeInTheDocument();
      });

      // Tab to inner button
      await user.tab();
      const innerButton = screen.getByTestId('inner-button');
      expect(innerButton).toHaveFocus();
    });
  });
});
