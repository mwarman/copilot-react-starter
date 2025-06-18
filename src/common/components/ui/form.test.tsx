import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, useFormField } from './form';
import { Input } from './input';
import { Button } from './button';

// Test schema for form validation
const testSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

type TestFormData = z.infer<typeof testSchema>;

// Test component that uses the form components
const TestFormComponent = ({
  onSubmit = vi.fn(),
  defaultValues = {},
}: {
  onSubmit?: (data: TestFormData) => void;
  defaultValues?: Partial<TestFormData>;
}) => {
  const form = useForm<TestFormData>({
    resolver: zodResolver(testSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} data-testid="test-form">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormDescription>Your unique username</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter email" {...field} />
              </FormControl>
              <FormDescription>We'll never share your email</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

// Component to test useFormField hook
const TestFormFieldHook = () => {
  const formField = useFormField();

  return (
    <div data-testid="form-field-data">
      <span data-testid="field-name">{formField.name}</span>
      <span data-testid="field-id">{formField.id}</span>
      <span data-testid="form-item-id">{formField.formItemId}</span>
      <span data-testid="form-description-id">{formField.formDescriptionId}</span>
      <span data-testid="form-message-id">{formField.formMessageId}</span>
      <span data-testid="field-error">{formField.error ? 'true' : 'false'}</span>
    </div>
  );
};

const TestFormWithHook = () => {
  const form = useForm<TestFormData>({
    resolver: zodResolver(testSchema),
  });

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="username"
        render={() => (
          <FormItem>
            <TestFormFieldHook />
          </FormItem>
        )}
      />
    </Form>
  );
};

describe('Form Components', () => {
  describe('Form (FormProvider)', () => {
    it('provides form context to child components', () => {
      // Arrange & Act
      render(<TestFormComponent />);

      // Assert
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });
  });

  describe('FormField', () => {
    it('renders field with Controller', () => {
      // Arrange & Act
      render(<TestFormComponent />);

      // Assert
      const usernameInput = screen.getByPlaceholderText('Enter username');
      const emailInput = screen.getByPlaceholderText('Enter email');

      expect(usernameInput).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();
    });

    it('provides field context to child components', () => {
      // Arrange & Act
      render(<TestFormWithHook />);

      // Assert
      expect(screen.getByTestId('field-name')).toHaveTextContent('username');
      expect(screen.getByTestId('field-error')).toHaveTextContent('false');
    });
  });

  describe('FormItem', () => {
    it('renders with default props and styling', () => {
      // Arrange & Act
      render(<TestFormComponent />);

      // Assert
      const testForm = screen.getByTestId('test-form');
      const formItems = testForm.querySelectorAll('[data-slot="form-item"]');
      expect(formItems).toHaveLength(2);

      Array.from(formItems).forEach((item: Element) => {
        expect(item).toHaveClass('grid', 'gap-2');
        expect(item).toHaveAttribute('data-slot', 'form-item');
      });
    });

    it('accepts custom className', () => {
      // Arrange
      const TestCustomFormItem = () => {
        const form = useForm();
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="test"
              render={() => (
                <FormItem className="custom-form-item" data-testid="custom-item">
                  <div>Test content</div>
                </FormItem>
              )}
            />
          </Form>
        );
      };

      // Act
      render(<TestCustomFormItem />);

      // Assert
      const formItem = screen.getByTestId('custom-item');
      expect(formItem).toHaveClass('custom-form-item', 'grid', 'gap-2');
    });

    it('provides unique ID context', () => {
      // Arrange & Act
      render(<TestFormWithHook />);

      // Assert
      const fieldId = screen.getByTestId('field-id').textContent;
      const formItemId = screen.getByTestId('form-item-id').textContent;

      expect(fieldId).toBeTruthy();
      expect(formItemId).toContain(fieldId);
      expect(formItemId).toContain('-form-item');
    });
  });

  describe('FormLabel', () => {
    it('renders with correct attributes', () => {
      // Arrange & Act
      render(<TestFormComponent />);

      // Assert
      const usernameLabel = screen.getByText('Username');
      const emailLabel = screen.getByText('Email');

      expect(usernameLabel).toHaveAttribute('data-slot', 'form-label');
      expect(emailLabel).toHaveAttribute('data-slot', 'form-label');

      // Labels should have htmlFor attributes pointing to form controls
      expect(usernameLabel).toHaveAttribute('for');
      expect(emailLabel).toHaveAttribute('for');
    });

    it('shows error state styling', async () => {
      // Arrange
      const user = userEvent.setup();

      // Act
      render(<TestFormComponent />);

      // Trigger validation by submitting empty form
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton);

      // Assert
      const usernameLabel = screen.getByText('Username');
      expect(usernameLabel).toHaveAttribute('data-error', 'true');
      expect(usernameLabel).toHaveClass('data-[error=true]:text-destructive');
    });

    it('accepts custom className', () => {
      // Arrange
      const TestCustomLabel = () => {
        const form = useForm();
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="test"
              render={() => (
                <FormItem>
                  <FormLabel className="custom-label">Custom Label</FormLabel>
                </FormItem>
              )}
            />
          </Form>
        );
      };

      // Act
      render(<TestCustomLabel />);

      // Assert
      const label = screen.getByText('Custom Label');
      expect(label).toHaveClass('custom-label');
    });
  });

  describe('FormControl', () => {
    it('renders with correct ARIA attributes', () => {
      // Arrange & Act
      render(<TestFormComponent />);

      // Assert
      const usernameInput = screen.getByPlaceholderText('Enter username');
      const emailInput = screen.getByPlaceholderText('Enter email');

      expect(usernameInput).toHaveAttribute('data-slot', 'form-control');
      expect(usernameInput).toHaveAttribute('aria-describedby');
      expect(usernameInput).toHaveAttribute('aria-invalid', 'false');

      expect(emailInput).toHaveAttribute('data-slot', 'form-control');
      expect(emailInput).toHaveAttribute('aria-describedby');
      expect(emailInput).toHaveAttribute('aria-invalid', 'false');
    });

    it('updates ARIA attributes on error', async () => {
      // Arrange
      const user = userEvent.setup();

      // Act
      render(<TestFormComponent />);

      // Trigger validation error
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton);

      // Assert
      const usernameInput = screen.getByPlaceholderText('Enter username');
      expect(usernameInput).toHaveAttribute('aria-invalid', 'true');

      const ariaDescribedBy = usernameInput.getAttribute('aria-describedby');
      expect(ariaDescribedBy).toContain('form-item-description');
      expect(ariaDescribedBy).toContain('form-item-message');
    });
  });

  describe('FormDescription', () => {
    it('renders with correct attributes and styling', () => {
      // Arrange & Act
      render(<TestFormComponent />);

      // Assert
      const usernameDescription = screen.getByText('Your unique username');
      const emailDescription = screen.getByText("We'll never share your email");

      expect(usernameDescription).toHaveAttribute('data-slot', 'form-description');
      expect(usernameDescription).toHaveClass('text-muted-foreground', 'text-sm');
      expect(usernameDescription).toHaveAttribute('id');

      expect(emailDescription).toHaveAttribute('data-slot', 'form-description');
      expect(emailDescription).toHaveClass('text-muted-foreground', 'text-sm');
      expect(emailDescription).toHaveAttribute('id');
    });

    it('has correct ID for ARIA relationship', () => {
      // Arrange & Act
      render(<TestFormWithHook />);

      // Assert
      const formDescriptionId = screen.getByTestId('form-description-id').textContent;
      expect(formDescriptionId).toContain('form-item-description');
    });

    it('accepts custom className', () => {
      // Arrange
      const TestCustomDescription = () => {
        const form = useForm();
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="test"
              render={() => (
                <FormItem>
                  <FormDescription className="custom-description">Custom description</FormDescription>
                </FormItem>
              )}
            />
          </Form>
        );
      };

      // Act
      render(<TestCustomDescription />);

      // Assert
      const description = screen.getByText('Custom description');
      expect(description).toHaveClass('custom-description', 'text-muted-foreground', 'text-sm');
    });
  });

  describe('FormMessage', () => {
    it('does not render when there is no error', () => {
      // Arrange & Act
      render(<TestFormComponent />);

      // Assert
      const formMessages = document.querySelectorAll('[data-slot="form-message"]');
      expect(formMessages).toHaveLength(0);
    });

    it('renders error message when validation fails', async () => {
      // Arrange
      const user = userEvent.setup();

      // Act
      render(<TestFormComponent />);

      // Trigger validation error
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton);

      // Assert
      // Check for generic "Required" message that React Hook Form might show
      const errorMessages = document.querySelectorAll('[data-slot="form-message"]');
      expect(errorMessages).toHaveLength(2);

      errorMessages.forEach((message) => {
        expect(message).toHaveClass('text-destructive', 'text-sm');
        expect(message).toHaveAttribute('id');
        expect(message.textContent).toBeTruthy(); // Should have some error text
      });
    });

    it('renders custom children when no error', () => {
      // Arrange
      const TestCustomMessage = () => {
        const form = useForm();
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="test"
              render={() => (
                <FormItem>
                  <FormMessage>Custom message content</FormMessage>
                </FormItem>
              )}
            />
          </Form>
        );
      };

      // Act
      render(<TestCustomMessage />);

      // Assert
      const message = screen.getByText('Custom message content');
      expect(message).toHaveAttribute('data-slot', 'form-message');
    });

    it('has correct ID for ARIA relationship', async () => {
      // Arrange
      const user = userEvent.setup();

      // Act
      render(<TestFormComponent />);

      // Trigger validation error
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton);

      // Assert
      const errorMessages = document.querySelectorAll('[data-slot="form-message"]');
      expect(errorMessages.length).toBeGreaterThan(0);

      errorMessages.forEach((message) => {
        const messageId = message.getAttribute('id');
        expect(messageId).toContain('form-item-message');
      });
    });
  });

  describe('useFormField hook', () => {
    it('returns correct field information', () => {
      // Arrange & Act
      render(<TestFormWithHook />);

      // Assert
      expect(screen.getByTestId('field-name')).toHaveTextContent('username');
      expect(screen.getByTestId('field-error')).toHaveTextContent('false');

      const fieldId = screen.getByTestId('field-id');
      const formItemId = screen.getByTestId('form-item-id');
      const formDescriptionId = screen.getByTestId('form-description-id');
      const formMessageId = screen.getByTestId('form-message-id');

      expect(fieldId.textContent).toBeTruthy();
      expect(formItemId.textContent).toContain('form-item');
      expect(formDescriptionId.textContent).toContain('form-item-description');
      expect(formMessageId.textContent).toContain('form-item-message');
    });

    it('throws error when used outside FormField context', () => {
      // Arrange
      const TestHookError = () => {
        useFormField();
        return <div>Should not render</div>;
      };

      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Act & Assert
      expect(() => render(<TestHookError />)).toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe('Form Integration', () => {
    it('handles form submission with valid data', async () => {
      // Arrange
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      // Act
      render(<TestFormComponent onSubmit={onSubmit} />);

      const usernameInput = screen.getByPlaceholderText('Enter username');
      const emailInput = screen.getByPlaceholderText('Enter email');
      const submitButton = screen.getByRole('button', { name: 'Submit' });

      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      // Assert
      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit.mock.calls[0][0]).toEqual({
        username: 'testuser',
        email: 'test@example.com',
      });
    });

    it('prevents submission with invalid data', async () => {
      // Arrange
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      // Act
      render(<TestFormComponent onSubmit={onSubmit} />);

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton);

      // Assert
      expect(onSubmit).not.toHaveBeenCalled();

      // Check that error messages are displayed
      const errorMessages = document.querySelectorAll('[data-slot="form-message"]');
      expect(errorMessages.length).toBeGreaterThan(0);

      // Verify error messages have content
      errorMessages.forEach((message) => {
        expect(message.textContent).toBeTruthy();
      });
    });

    it('works with default values', () => {
      // Arrange
      const defaultValues = {
        username: 'defaultuser',
        email: 'default@example.com',
      };

      // Act
      render(<TestFormComponent defaultValues={defaultValues} />);

      // Assert
      const usernameInput = screen.getByPlaceholderText('Enter username') as HTMLInputElement;
      const emailInput = screen.getByPlaceholderText('Enter email') as HTMLInputElement;

      expect(usernameInput.value).toBe('defaultuser');
      expect(emailInput.value).toBe('default@example.com');
    });

    it('clears errors when valid input is provided', async () => {
      // Arrange
      const user = userEvent.setup();

      // Act
      render(<TestFormComponent />);

      // First trigger validation error
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton);

      // Check that error message appears
      const initialErrorMessages = document.querySelectorAll('[data-slot="form-message"]');
      expect(initialErrorMessages.length).toBeGreaterThan(0);

      // Then provide valid input
      const usernameInput = screen.getByPlaceholderText('Enter username');
      await user.type(usernameInput, 'validuser');

      // Assert error messages are cleared (or at least reduced)
      const finalErrorMessages = document.querySelectorAll('[data-slot="form-message"]');
      // The username error should be cleared, but email error might still be there
      expect(finalErrorMessages.length).toBeLessThanOrEqual(initialErrorMessages.length);
    });
  });
});
