import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Textarea } from './textarea';

describe('Textarea component', () => {
  it('renders with default styles', () => {
    // Arrange
    render(<Textarea data-testid="test-textarea" />);

    // Act
    const textarea = screen.getByTestId('test-textarea');

    // Assert
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveClass('border-input');
    expect(textarea).toHaveClass('rounded-md');
    expect(textarea).toHaveAttribute('data-slot', 'textarea');
  });

  it('applies custom className when provided', () => {
    // Arrange
    const customClass = 'text-red-500 h-40';

    // Act
    render(<Textarea data-testid="test-textarea" className={customClass} />);
    const textarea = screen.getByTestId('test-textarea');

    // Assert
    expect(textarea).toHaveClass(customClass);
    expect(textarea).toHaveClass('border-input'); // Verify default styles are still applied
    expect(textarea).toHaveClass('rounded-md');
  });

  it('forwards ref to the underlying textarea element', () => {
    // Arrange
    const ref = React.createRef<HTMLTextAreaElement>();

    // Act
    render(<Textarea data-testid="test-textarea" ref={ref} />);

    // Assert
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('TEXTAREA');
  });

  it('handles user input correctly', async () => {
    // Arrange
    const user = userEvent.setup();
    const testValue = 'Hello, world!';

    // Act
    render(<Textarea data-testid="test-textarea" />);
    const textarea = screen.getByTestId('test-textarea');
    await user.type(textarea, testValue);

    // Assert
    expect(textarea).toHaveValue(testValue);
  });

  it('passes additional props to textarea element', () => {
    // Arrange
    const placeholder = 'Enter text here';
    const rows = 5;

    // Act
    render(<Textarea data-testid="test-textarea" placeholder={placeholder} rows={rows} aria-label="Test textarea" />);
    const textarea = screen.getByTestId('test-textarea');

    // Assert
    expect(textarea).toHaveAttribute('placeholder', placeholder);
    expect(textarea).toHaveAttribute('rows', rows.toString());
    expect(textarea).toHaveAttribute('aria-label', 'Test textarea');
  });
});
