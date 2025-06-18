import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Textarea } from './textarea';

describe('Textarea', () => {
  it('renders with default props', () => {
    // Arrange & Act
    render(<Textarea data-testid="textarea" />);

    // Assert
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('data-slot', 'textarea');
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('applies default CSS classes', () => {
    // Arrange & Act
    render(<Textarea data-testid="textarea" />);

    // Assert
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveClass(
      'border-input',
      'placeholder:text-muted-foreground',
      'focus-visible:border-ring',
      'focus-visible:ring-ring/50',
      'aria-invalid:ring-destructive/20',
      'dark:aria-invalid:ring-destructive/40',
      'aria-invalid:border-destructive',
      'dark:bg-input/30',
      'flex',
      'field-sizing-content',
      'min-h-16',
      'w-full',
      'rounded-md',
      'border',
      'bg-transparent',
      'px-3',
      'py-2',
      'text-base',
      'shadow-xs',
      'transition-[color,box-shadow]',
      'outline-none',
      'focus-visible:ring-[3px]',
      'disabled:cursor-not-allowed',
      'disabled:opacity-50',
      'md:text-sm',
    );
  });

  it('accepts and applies custom className', () => {
    // Arrange
    const customClass = 'custom-textarea-class';

    // Act
    render(<Textarea className={customClass} data-testid="textarea" />);

    // Assert
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveClass(customClass);
    // Should also maintain default classes
    expect(textarea).toHaveClass('w-full', 'rounded-md', 'border');
  });

  it('forwards all props to the textarea element', () => {
    // Arrange
    const placeholder = 'Enter your message';
    const name = 'message';
    const id = 'message-input';
    const rows = 5;

    // Act
    render(<Textarea placeholder={placeholder} name={name} id={id} rows={rows} data-testid="textarea" />);

    // Assert
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveAttribute('placeholder', placeholder);
    expect(textarea).toHaveAttribute('name', name);
    expect(textarea).toHaveAttribute('id', id);
    expect(textarea).toHaveAttribute('rows', rows.toString());
  });

  it('handles user input correctly', async () => {
    // Arrange
    const user = userEvent.setup();
    const testValue = 'This is a test message';

    // Act
    render(<Textarea data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    await user.type(textarea, testValue);

    // Assert
    expect(textarea).toHaveValue(testValue);
  });

  it('handles controlled input with value prop', () => {
    // Arrange
    const controlledValue = 'Controlled value';

    // Act
    render(<Textarea value={controlledValue} data-testid="textarea" readOnly />);

    // Assert
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveValue(controlledValue);
  });

  it('handles onChange events', async () => {
    // Arrange
    const user = userEvent.setup();
    const onChange = vi.fn();
    const testInput = 'New input';

    // Act
    render(<Textarea onChange={onChange} data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    await user.type(textarea, testInput);

    // Assert
    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledTimes(testInput.length);
  });

  it('renders with placeholder text', () => {
    // Arrange
    const placeholderText = 'Type your message here...';

    // Act
    render(<Textarea placeholder={placeholderText} />);

    // Assert
    const textarea = screen.getByPlaceholderText(placeholderText);
    expect(textarea).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    // Arrange & Act
    render(<Textarea disabled data-testid="textarea" />);

    // Assert
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
  });

  it('handles required attribute', () => {
    // Arrange & Act
    render(<Textarea required data-testid="textarea" />);

    // Assert
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toBeRequired();
  });

  it('handles maxLength attribute', () => {
    // Arrange
    const maxLength = 100;

    // Act
    render(<Textarea maxLength={maxLength} data-testid="textarea" />);

    // Assert
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveAttribute('maxLength', maxLength.toString());
  });

  it('handles readOnly attribute', () => {
    // Arrange & Act
    render(<Textarea readOnly data-testid="textarea" />);

    // Assert
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveAttribute('readOnly');
  });

  it('handles aria attributes', () => {
    // Arrange
    const ariaLabel = 'Message input';
    const ariaDescribedBy = 'message-help';

    // Act
    render(<Textarea aria-label={ariaLabel} aria-describedby={ariaDescribedBy} data-testid="textarea" />);

    // Assert
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveAttribute('aria-label', ariaLabel);
    expect(textarea).toHaveAttribute('aria-describedby', ariaDescribedBy);
  });

  it('handles focus and blur events', async () => {
    // Arrange
    const user = userEvent.setup();
    const onFocus = vi.fn();
    const onBlur = vi.fn();

    // Act
    render(<Textarea onFocus={onFocus} onBlur={onBlur} data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');

    await user.click(textarea);
    await user.tab(); // Move focus away

    // Assert
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('merges className with default classes correctly', () => {
    // Arrange
    const customClasses = 'h-32 resize-none border-red-500';

    // Act
    render(<Textarea className={customClasses} data-testid="textarea" />);

    // Assert
    const textarea = screen.getByTestId('textarea');
    // Should have both default and custom classes
    expect(textarea).toHaveClass('w-full', 'rounded-md'); // default
    expect(textarea).toHaveClass('h-32', 'resize-none', 'border-red-500'); // custom
  });

  it('handles form integration with name attribute', () => {
    // Arrange
    const formName = 'feedback-form';
    const textareaName = 'comments';

    // Act
    render(
      <form data-testid={formName}>
        <Textarea name={textareaName} data-testid="textarea" />
      </form>,
    );

    // Assert
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveAttribute('name', textareaName);
  });

  it('applies data-slot attribute consistently', () => {
    // Arrange & Act
    render(
      <>
        <Textarea data-testid="textarea-1" />
        <Textarea data-testid="textarea-2" />
      </>,
    );

    // Assert
    expect(screen.getByTestId('textarea-1')).toHaveAttribute('data-slot', 'textarea');
    expect(screen.getByTestId('textarea-2')).toHaveAttribute('data-slot', 'textarea');
  });

  it('handles defaultValue prop', () => {
    // Arrange
    const defaultValue = 'Default textarea content';

    // Act
    render(<Textarea defaultValue={defaultValue} data-testid="textarea" />);

    // Assert
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveValue(defaultValue);
  });
});
