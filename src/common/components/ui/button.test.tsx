import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('renders a button with default styling', () => {
    // Arrange
    render(<Button>Click me</Button>);

    // Act
    const button = screen.getByRole('button', { name: /click me/i });

    // Assert
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
    expect(button).toHaveClass('text-primary-foreground');
  });

  it('applies custom className when provided', () => {
    // Arrange
    render(<Button className="test-class">Click me</Button>);

    // Act
    const button = screen.getByRole('button', { name: /click me/i });

    // Assert
    expect(button).toHaveClass('test-class');
  });

  it('renders different variants correctly', () => {
    // Arrange
    const { rerender } = render(<Button variant="destructive">Destructive</Button>);

    // Act & Assert
    let button = screen.getByRole('button', { name: /destructive/i });
    expect(button).toHaveClass('bg-destructive');
    expect(button).toHaveClass('text-destructive-foreground');

    // Test secondary variant
    rerender(<Button variant="secondary">Secondary</Button>);
    button = screen.getByRole('button', { name: /secondary/i });
    expect(button).toHaveClass('bg-secondary');
    expect(button).toHaveClass('text-secondary-foreground');

    // Test outline variant
    rerender(<Button variant="outline">Outline</Button>);
    button = screen.getByRole('button', { name: /outline/i });
    expect(button).toHaveClass('border');
    expect(button).toHaveClass('border-input');
    expect(button).toHaveClass('bg-background');

    // Test ghost variant
    rerender(<Button variant="ghost">Ghost</Button>);
    button = screen.getByRole('button', { name: /ghost/i });
    expect(button).toHaveClass('hover:bg-accent');
    expect(button).toHaveClass('hover:text-accent-foreground');

    // Test link variant
    rerender(<Button variant="link">Link</Button>);
    button = screen.getByRole('button', { name: /link/i });
    expect(button).toHaveClass('text-primary');
    expect(button).toHaveClass('hover:underline');
  });

  it('renders different sizes correctly', () => {
    // Arrange
    const { rerender } = render(<Button size="sm">Small</Button>);

    // Act & Assert
    let button = screen.getByRole('button', { name: /small/i });
    expect(button).toHaveClass('h-9');
    expect(button).toHaveClass('rounded-md');
    expect(button).toHaveClass('px-3');

    // Test large size
    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole('button', { name: /large/i });
    expect(button).toHaveClass('h-11');
    expect(button).toHaveClass('rounded-md');
    expect(button).toHaveClass('px-8');

    // Test icon size
    rerender(<Button size="icon">Icon</Button>);
    button = screen.getByRole('button', { name: /icon/i });
    expect(button).toHaveClass('h-10');
    expect(button).toHaveClass('w-10');
  });

  it('renders as a child component when asChild is true', () => {
    // Arrange
    render(
      <Button asChild>
        <a href="https://example.com">Link Button</a>
      </Button>,
    );

    // Act
    const link = screen.getByRole('link', { name: /link button/i });

    // Assert
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveClass('bg-primary');
    expect(link).toHaveClass('text-primary-foreground');
  });

  it('passes additional props to the button element', () => {
    // Arrange
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled data-testid="test-button">
        Click me
      </Button>,
    );

    // Act
    const button = screen.getByTestId('test-button');

    // Assert
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('data-testid', 'test-button');
  });

  it('handles click events', async () => {
    // Arrange
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    // Act
    const button = screen.getByRole('button', { name: /click me/i });
    await user.click(button);

    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
