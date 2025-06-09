import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent } from './card';
import { cn } from '@/common/utils/css';

// Mock the cn utility
vi.mock('@/common/utils/css', () => ({
  cn: vi.fn((...inputs) => inputs.join(' ')),
}));

describe('Card Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Card', () => {
    it('renders with default and custom classes', () => {
      // Arrange
      const testId = 'card-test-id';
      const customClass = 'custom-class';
      const children = 'Card Content';

      // Act
      render(
        <Card className={customClass} data-testid={testId}>
          {children}
        </Card>,
      );

      // Assert
      const cardElement = screen.getByTestId(testId);
      expect(cardElement).toBeInTheDocument();
      expect(cardElement).toHaveTextContent(children);
      expect(cardElement).toHaveAttribute('data-slot', 'card');
      expect(cn).toHaveBeenCalledWith(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
        customClass,
      );
    });
  });

  describe('CardHeader', () => {
    it('renders with default and custom classes', () => {
      // Arrange
      const testId = 'card-header-test-id';
      const customClass = 'custom-header-class';
      const children = 'Header Content';

      // Act
      render(
        <CardHeader className={customClass} data-testid={testId}>
          {children}
        </CardHeader>,
      );

      // Assert
      const headerElement = screen.getByTestId(testId);
      expect(headerElement).toBeInTheDocument();
      expect(headerElement).toHaveTextContent(children);
      expect(headerElement).toHaveAttribute('data-slot', 'card-header');
      expect(cn).toHaveBeenCalledWith(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        customClass,
      );
    });
  });

  describe('CardTitle', () => {
    it('renders with default and custom classes', () => {
      // Arrange
      const testId = 'card-title-test-id';
      const customClass = 'custom-title-class';
      const children = 'Card Title';

      // Act
      render(
        <CardTitle className={customClass} data-testid={testId}>
          {children}
        </CardTitle>,
      );

      // Assert
      const titleElement = screen.getByTestId(testId);
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveTextContent(children);
      expect(titleElement).toHaveAttribute('data-slot', 'card-title');
      expect(cn).toHaveBeenCalledWith('leading-none font-semibold', customClass);
    });
  });

  describe('CardDescription', () => {
    it('renders with default and custom classes', () => {
      // Arrange
      const testId = 'card-description-test-id';
      const customClass = 'custom-description-class';
      const children = 'Card Description';

      // Act
      render(
        <CardDescription className={customClass} data-testid={testId}>
          {children}
        </CardDescription>,
      );

      // Assert
      const descriptionElement = screen.getByTestId(testId);
      expect(descriptionElement).toBeInTheDocument();
      expect(descriptionElement).toHaveTextContent(children);
      expect(descriptionElement).toHaveAttribute('data-slot', 'card-description');
      expect(cn).toHaveBeenCalledWith('text-muted-foreground text-sm', customClass);
    });
  });

  describe('CardAction', () => {
    it('renders with default and custom classes', () => {
      // Arrange
      const testId = 'card-action-test-id';
      const customClass = 'custom-action-class';
      const children = 'Card Action';

      // Act
      render(
        <CardAction className={customClass} data-testid={testId}>
          {children}
        </CardAction>,
      );

      // Assert
      const actionElement = screen.getByTestId(testId);
      expect(actionElement).toBeInTheDocument();
      expect(actionElement).toHaveTextContent(children);
      expect(actionElement).toHaveAttribute('data-slot', 'card-action');
      expect(cn).toHaveBeenCalledWith('col-start-2 row-span-2 row-start-1 self-start justify-self-end', customClass);
    });
  });

  describe('CardContent', () => {
    it('renders with default and custom classes', () => {
      // Arrange
      const testId = 'card-content-test-id';
      const customClass = 'custom-content-class';
      const children = 'Card Content';

      // Act
      render(
        <CardContent className={customClass} data-testid={testId}>
          {children}
        </CardContent>,
      );

      // Assert
      const contentElement = screen.getByTestId(testId);
      expect(contentElement).toBeInTheDocument();
      expect(contentElement).toHaveTextContent(children);
      expect(contentElement).toHaveAttribute('data-slot', 'card-content');
      expect(cn).toHaveBeenCalledWith('px-6', customClass);
    });
  });

  describe('CardFooter', () => {
    it('renders with default and custom classes', () => {
      // Arrange
      const testId = 'card-footer-test-id';
      const customClass = 'custom-footer-class';
      const children = 'Card Footer';

      // Act
      render(
        <CardFooter className={customClass} data-testid={testId}>
          {children}
        </CardFooter>,
      );

      // Assert
      const footerElement = screen.getByTestId(testId);
      expect(footerElement).toBeInTheDocument();
      expect(footerElement).toHaveTextContent(children);
      expect(footerElement).toHaveAttribute('data-slot', 'card-footer');
      expect(cn).toHaveBeenCalledWith('flex items-center px-6 [.border-t]:pt-6', customClass);
    });
  });

  describe('Composability', () => {
    it('composes card components together correctly', () => {
      // Arrange
      const cardTestId = 'card-test';
      const headerTestId = 'header-test';
      const titleTestId = 'title-test';
      const descriptionTestId = 'description-test';
      const contentTestId = 'content-test';
      const footerTestId = 'footer-test';

      // Act
      render(
        <Card data-testid={cardTestId}>
          <CardHeader data-testid={headerTestId}>
            <CardTitle data-testid={titleTestId}>Card Title</CardTitle>
            <CardDescription data-testid={descriptionTestId}>Card Description</CardDescription>
          </CardHeader>
          <CardContent data-testid={contentTestId}>Main content goes here</CardContent>
          <CardFooter data-testid={footerTestId}>Footer content</CardFooter>
        </Card>,
      );

      // Assert
      expect(screen.getByTestId(cardTestId)).toBeInTheDocument();
      expect(screen.getByTestId(headerTestId)).toBeInTheDocument();
      expect(screen.getByTestId(titleTestId)).toBeInTheDocument();
      expect(screen.getByTestId(descriptionTestId)).toBeInTheDocument();
      expect(screen.getByTestId(contentTestId)).toBeInTheDocument();
      expect(screen.getByTestId(footerTestId)).toBeInTheDocument();

      // Check correct nesting structure
      expect(screen.getByTestId(cardTestId)).toContainElement(screen.getByTestId(headerTestId));
      expect(screen.getByTestId(headerTestId)).toContainElement(screen.getByTestId(titleTestId));
      expect(screen.getByTestId(headerTestId)).toContainElement(screen.getByTestId(descriptionTestId));
      expect(screen.getByTestId(cardTestId)).toContainElement(screen.getByTestId(contentTestId));
      expect(screen.getByTestId(cardTestId)).toContainElement(screen.getByTestId(footerTestId));
    });
  });
});
