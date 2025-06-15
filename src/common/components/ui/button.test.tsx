import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button, buttonVariants } from './button';

describe('Button', () => {
  it('renders a button with default variant and size', () => {
    // Arrange
    render(<Button>Click me</Button>);

    // Assert
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });

  it('renders a button with custom className', () => {
    // Arrange
    render(<Button className="test-class">Click me</Button>);

    // Assert
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('test-class');
  });

  it('renders different variants correctly', () => {
    // Arrange
    const { rerender } = render(<Button variant="destructive">Destructive</Button>);

    // Assert
    let button = screen.getByRole('button', { name: /destructive/i });
    expect(button).toHaveClass('bg-destructive');

    // Act - change variant
    rerender(<Button variant="outline">Outline</Button>);

    // Assert
    button = screen.getByRole('button', { name: /outline/i });
    expect(button).toHaveClass('border');
    expect(button).toHaveClass('bg-background');

    // Act - change variant
    rerender(<Button variant="secondary">Secondary</Button>);

    // Assert
    button = screen.getByRole('button', { name: /secondary/i });
    expect(button).toHaveClass('bg-secondary');

    // Act - change variant
    rerender(<Button variant="ghost">Ghost</Button>);

    // Assert
    button = screen.getByRole('button', { name: /ghost/i });
    expect(button).toHaveClass('hover:bg-accent');

    // Act - change variant
    rerender(<Button variant="link">Link</Button>);

    // Assert
    button = screen.getByRole('button', { name: /link/i });
    expect(button).toHaveClass('text-primary');
    expect(button).toHaveClass('hover:underline');
  });

  it('renders different sizes correctly', () => {
    // Arrange
    const { rerender } = render(<Button size="default">Default</Button>);

    // Assert
    let button = screen.getByRole('button', { name: /default/i });
    expect(button).toHaveClass('h-9');

    // Act - change size
    rerender(<Button size="sm">Small</Button>);

    // Assert
    button = screen.getByRole('button', { name: /small/i });
    expect(button).toHaveClass('h-8');

    // Act - change size
    rerender(<Button size="lg">Large</Button>);

    // Assert
    button = screen.getByRole('button', { name: /large/i });
    expect(button).toHaveClass('h-10');

    // Act - change size
    rerender(<Button size="icon">Icon</Button>);

    // Assert
    button = screen.getByRole('button', { name: /icon/i });
    expect(button).toHaveClass('size-9');
  });

  it('renders as a custom element when asChild is true', () => {
    // Arrange
    render(
      <Button asChild>
        <a href="#test">Link Button</a>
      </Button>,
    );

    // Assert
    const link = screen.getByRole('link', { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '#test');
    expect(link).toHaveClass('bg-primary'); // Should still have button styling
  });

  it('applies data-slot attribute', () => {
    // Arrange
    render(<Button>Click me</Button>);

    // Assert
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveAttribute('data-slot', 'button');
  });

  it('forwards additional props to the button element', () => {
    // Arrange
    render(
      <Button disabled aria-label="Test button">
        Click me
      </Button>,
    );

    // Assert
    const button = screen.getByRole('button', { name: 'Test button' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-label', 'Test button');
    expect(button).toHaveTextContent('Click me');
  });

  it('handles click events', async () => {
    // Arrange
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    // Act
    const button = screen.getByRole('button', { name: /click me/i });
    await user.click(button);

    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('buttonVariants function generates correct class names', () => {
    // Arrange & Act
    const defaultClasses = buttonVariants({});
    const customClasses = buttonVariants({
      variant: 'destructive',
      size: 'lg',
      className: 'test-class',
    });

    // Assert
    expect(defaultClasses).toContain('bg-primary');
    expect(defaultClasses).toContain('h-9');

    expect(customClasses).toContain('bg-destructive');
    expect(customClasses).toContain('h-10');
    expect(customClasses).toContain('test-class');
  });
});
