import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from './form';
import { Input } from './input';

// Test schema for form validation
const testSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

// Mock component that uses the form components
const TestForm = () => {
  const form = useForm<z.infer<typeof testSchema>>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      username: '',
      email: '',
    },
  });

  const onSubmit = vi.fn();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormDescription>Your display name</FormDescription>
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
                <Input placeholder="Enter email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </Form>
  );
};

describe('Form Components', () => {
  describe('Form Integration', () => {
    it('should render form elements correctly', async () => {
      // Arrange
      render(<TestForm />);

      // Act - No specific action needed for this test

      // Assert
      expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByText(/Your display name/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
    });

    it('should display validation errors when form is submitted with invalid data', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<TestForm />);

      // Act
      await user.click(screen.getByRole('button', { name: /Submit/i }));

      // Assert
      expect(screen.getByText(/Username must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
    });

    it('should not display errors when valid data is entered', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<TestForm />);

      // Act
      await user.type(screen.getByLabelText(/Username/i), 'testuser');
      await user.type(screen.getByLabelText(/Email/i), 'test@example.com');
      await user.click(screen.getByRole('button', { name: /Submit/i }));

      // Assert
      expect(screen.queryByText(/Username must be at least 2 characters/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Invalid email address/i)).not.toBeInTheDocument();
    });
  });

  describe('FormItem', () => {
    it('should render with custom className', () => {
      // Arrange
      const TestComponent = () => (
        <Form {...useForm()}>
          <FormItem className="custom-class">Test content</FormItem>
        </Form>
      );

      // Act
      render(<TestComponent />);

      // Assert
      const formItem = screen.getByText('Test content').closest('[data-slot="form-item"]');
      expect(formItem).toHaveClass('custom-class');
    });
  });

  describe('FormLabel', () => {
    it('should render with error state when field has error', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<TestForm />);

      // Act
      await user.click(screen.getByRole('button', { name: /Submit/i }));

      // Assert
      // Find the label element by its data-slot attribute
      const usernameLabel = screen.getByText(/Username/i, { selector: '[data-slot="form-label"]' });
      expect(usernameLabel).toHaveAttribute('data-error', 'true');
    });
  });

  describe('FormDescription', () => {
    it('should render description text', () => {
      // Arrange
      render(<TestForm />);

      // Act - No specific action needed for this test

      // Assert
      expect(screen.getByText(/Your display name/i)).toBeInTheDocument();
      expect(screen.getByText(/Your display name/i)).toHaveAttribute('data-slot', 'form-description');
    });
  });

  describe('FormMessage', () => {
    it('should display error message when validation fails', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<TestForm />);

      // Act
      await user.click(screen.getByRole('button', { name: /Submit/i }));

      // Assert
      const errorMessage = screen.getByText(/Username must be at least 2 characters/i);
      expect(errorMessage).toHaveAttribute('data-slot', 'form-message');
      expect(errorMessage).toHaveClass('text-destructive');
    });

    it('should not render when there is no error', () => {
      // Arrange
      const TestComponent = () => {
        const form = useForm();
        return (
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="test"
                render={() => (
                  <FormItem>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      };

      // Act
      const { container } = render(<TestComponent />);

      // Assert
      expect(container.querySelector('[data-slot="form-message"]')).toBeNull();
    });
  });
});
