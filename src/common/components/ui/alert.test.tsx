import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Alert, AlertTitle, AlertDescription } from './alert';
import { CheckCircle, XCircle } from 'lucide-react';

describe('Alert', () => {
  it('renders alert with default variant', () => {
    // Arrange
    render(<Alert>Test alert</Alert>);

    // Assert
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass('bg-card');
    expect(alert).toHaveClass('text-card-foreground');
    expect(alert).toHaveTextContent('Test alert');
    expect(alert).toHaveAttribute('data-slot', 'alert');
  });

  it('renders alert with destructive variant', () => {
    // Arrange
    render(<Alert variant="destructive">Test alert</Alert>);

    // Assert
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass('text-destructive');
    expect(alert).toHaveClass('bg-card');
    expect(alert).toHaveTextContent('Test alert');
  });

  it('renders alert with custom className', () => {
    // Arrange
    render(<Alert className="test-class">Test alert</Alert>);

    // Assert
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('test-class');
  });

  it('renders alert with icon', () => {
    // Arrange
    render(
      <Alert>
        <CheckCircle />
        Test alert
      </Alert>,
    );

    // Assert
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr]');

    const icon = alert.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('renders alert with different icons', () => {
    // Arrange
    const { rerender } = render(
      <Alert>
        <CheckCircle />
        Success alert
      </Alert>,
    );

    // Assert
    let icon = screen.getByRole('alert').querySelector('svg');
    expect(icon).toBeInTheDocument();

    // Act - change icon
    rerender(
      <Alert>
        <XCircle />
        Error alert
      </Alert>,
    );

    // Assert
    icon = screen.getByRole('alert').querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('forwards additional props to the alert div element', () => {
    // Arrange
    render(
      <Alert data-testid="custom-alert" aria-labelledby="alert-title">
        Test alert
      </Alert>,
    );

    // Assert
    const alert = screen.getByTestId('custom-alert');
    expect(alert).toHaveAttribute('aria-labelledby', 'alert-title');
  });
});

describe('AlertTitle', () => {
  it('renders alert title correctly', () => {
    // Arrange
    render(<AlertTitle>Important Alert</AlertTitle>);

    // Assert
    const title = screen.getByText('Important Alert');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('font-medium');
    expect(title).toHaveClass('col-start-2');
    expect(title).toHaveAttribute('data-slot', 'alert-title');
  });

  it('renders alert title with custom className', () => {
    // Arrange
    render(<AlertTitle className="test-class">Important Alert</AlertTitle>);

    // Assert
    const title = screen.getByText('Important Alert');
    expect(title).toHaveClass('test-class');
  });

  it('forwards additional props to the title div element', () => {
    // Arrange
    render(
      <AlertTitle data-testid="custom-title" id="alert-title">
        Important Alert
      </AlertTitle>,
    );

    // Assert
    const title = screen.getByTestId('custom-title');
    expect(title).toHaveAttribute('id', 'alert-title');
  });
});

describe('AlertDescription', () => {
  it('renders alert description correctly', () => {
    // Arrange
    render(<AlertDescription>This is a detailed description of the alert.</AlertDescription>);

    // Assert
    const description = screen.getByText('This is a detailed description of the alert.');
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('text-muted-foreground');
    expect(description).toHaveClass('col-start-2');
    expect(description).toHaveAttribute('data-slot', 'alert-description');
  });

  it('renders alert description with custom className', () => {
    // Arrange
    render(<AlertDescription className="test-class">This is a detailed description of the alert.</AlertDescription>);

    // Assert
    const description = screen.getByText('This is a detailed description of the alert.');
    expect(description).toHaveClass('test-class');
  });

  it('forwards additional props to the description div element', () => {
    // Arrange
    render(
      <AlertDescription data-testid="custom-description" id="alert-desc">
        This is a detailed description of the alert.
      </AlertDescription>,
    );

    // Assert
    const description = screen.getByTestId('custom-description');
    expect(description).toHaveAttribute('id', 'alert-desc');
  });
});

describe('Alert Component Integration', () => {
  it('renders a complete alert with title and description', () => {
    // Arrange
    render(
      <Alert>
        <CheckCircle />
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription>Your action was completed successfully.</AlertDescription>
      </Alert>,
    );

    // Assert
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();

    const icon = alert.querySelector('svg');
    expect(icon).toBeInTheDocument();

    const title = screen.getByText('Success!');
    expect(title).toBeInTheDocument();
    expect(title).toHaveAttribute('data-slot', 'alert-title');

    const description = screen.getByText('Your action was completed successfully.');
    expect(description).toBeInTheDocument();
    expect(description).toHaveAttribute('data-slot', 'alert-description');
  });

  it('renders a destructive alert with title and description', () => {
    // Arrange
    render(
      <Alert variant="destructive">
        <XCircle />
        <AlertTitle>Error!</AlertTitle>
        <AlertDescription>There was a problem with your submission.</AlertDescription>
      </Alert>,
    );

    // Assert
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('text-destructive');

    const title = screen.getByText('Error!');
    expect(title).toBeInTheDocument();

    const description = screen.getByText('There was a problem with your submission.');
    expect(description).toBeInTheDocument();
  });
});
