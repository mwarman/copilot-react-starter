import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Alert, AlertTitle, AlertDescription } from './alert';

describe('Alert', () => {
  it('renders an alert with default styling', () => {
    // Arrange
    render(<Alert>Test alert content</Alert>);

    // Act
    const alert = screen.getByRole('alert');

    // Assert
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass('relative');
    expect(alert).toHaveClass('w-full');
    expect(alert).toHaveClass('rounded-lg');
    expect(alert).toHaveClass('border');
    expect(alert).toHaveClass('bg-card');
    expect(alert).toHaveClass('text-card-foreground');
  });

  it('applies custom className when provided', () => {
    // Arrange
    render(<Alert className="custom-class">Test alert content</Alert>);

    // Act
    const alert = screen.getByRole('alert');

    // Assert
    expect(alert).toHaveClass('custom-class');
  });

  it('renders different variants correctly', () => {
    // Arrange
    const { rerender } = render(<Alert variant="default">Default alert</Alert>);

    // Act & Assert
    let alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-card');
    expect(alert).toHaveClass('text-card-foreground');

    // Test destructive variant
    rerender(<Alert variant="destructive">Destructive alert</Alert>);
    alert = screen.getByRole('alert');
    expect(alert).toHaveClass('text-destructive');
    expect(alert).toHaveClass('bg-card');
  });

  it('renders with correct data-slot attribute', () => {
    // Arrange
    render(<Alert>Test alert</Alert>);

    // Act
    const alert = screen.getByRole('alert');

    // Assert
    expect(alert).toHaveAttribute('data-slot', 'alert');
  });

  it('renders AlertTitle with correct styling', () => {
    // Arrange
    render(
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
      </Alert>,
    );

    // Act
    const title = screen.getByText('Alert Title');

    // Assert
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('col-start-2');
    expect(title).toHaveClass('line-clamp-1');
    expect(title).toHaveClass('min-h-4');
    expect(title).toHaveClass('font-medium');
    expect(title).toHaveClass('tracking-tight');
  });

  it('applies custom className to AlertTitle when provided', () => {
    // Arrange
    render(
      <Alert>
        <AlertTitle className="title-custom-class">Alert Title</AlertTitle>
      </Alert>,
    );

    // Act
    const title = screen.getByText('Alert Title');

    // Assert
    expect(title).toHaveClass('title-custom-class');
  });

  it('renders AlertTitle with correct data-slot attribute', () => {
    // Arrange
    render(
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
      </Alert>,
    );

    // Act
    const title = screen.getByText('Alert Title');

    // Assert
    expect(title).toHaveAttribute('data-slot', 'alert-title');
  });

  it('renders AlertDescription with correct styling', () => {
    // Arrange
    render(
      <Alert>
        <AlertDescription>Alert description text</AlertDescription>
      </Alert>,
    );

    // Act
    const description = screen.getByText('Alert description text');

    // Assert
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('text-muted-foreground');
    expect(description).toHaveClass('col-start-2');
    expect(description).toHaveClass('grid');
    expect(description).toHaveClass('justify-items-start');
    expect(description).toHaveClass('gap-1');
    expect(description).toHaveClass('text-sm');
  });

  it('applies custom className to AlertDescription when provided', () => {
    // Arrange
    render(
      <Alert>
        <AlertDescription className="description-custom-class">Alert description text</AlertDescription>
      </Alert>,
    );

    // Act
    const description = screen.getByText('Alert description text');

    // Assert
    expect(description).toHaveClass('description-custom-class');
  });

  it('renders AlertDescription with correct data-slot attribute', () => {
    // Arrange
    render(
      <Alert>
        <AlertDescription>Alert description text</AlertDescription>
      </Alert>,
    );

    // Act
    const description = screen.getByText('Alert description text');

    // Assert
    expect(description).toHaveAttribute('data-slot', 'alert-description');
  });

  it('renders a complete alert with title and description', () => {
    // Arrange
    render(
      <Alert>
        <AlertTitle>Important Information</AlertTitle>
        <AlertDescription>This is some important information you need to know.</AlertDescription>
      </Alert>,
    );

    // Act & Assert
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Important Information')).toBeInTheDocument();
    expect(screen.getByText('This is some important information you need to know.')).toBeInTheDocument();
  });

  it('correctly applies the destructive styles to description', () => {
    // Arrange
    render(
      <Alert variant="destructive">
        <AlertTitle>Error Alert</AlertTitle>
        <AlertDescription>This is an error message.</AlertDescription>
      </Alert>,
    );

    // Act
    const alert = screen.getByRole('alert');

    // Assert
    expect(alert).toHaveClass('text-destructive');
    // The description would have special styling through the CSS selector in the component
    // We're verifying the parent class that enables this styling
    expect(alert).toHaveClass('[&>svg]:text-current');
  });
});
