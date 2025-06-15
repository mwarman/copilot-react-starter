import { describe, it, expect } from 'vitest';
import { cn } from './css';

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    // Arrange
    const classNames = ['text-red-500', 'bg-blue-200', 'p-4'];

    // Act
    const result = cn(...classNames);

    // Assert
    expect(result).toBe('text-red-500 bg-blue-200 p-4');
  });

  it('should handle conditional class names', () => {
    // Arrange
    const isActive = true;
    const baseClass = 'bg-gray-100';
    const conditionalClasses = { 'text-blue-500': isActive, 'text-gray-500': !isActive };

    // Act
    const result = cn(baseClass, conditionalClasses);

    // Assert
    expect(result).toBe('bg-gray-100 text-blue-500');
  });

  it('should handle falsy values', () => {
    // Arrange
    const baseClass = 'base-class';
    const falsyValues = [false, null, undefined, 0, ''];

    // Act
    const result = cn(baseClass, ...falsyValues);

    // Assert
    expect(result).toBe('base-class');
  });

  it('should deduplicate tailwind classes', () => {
    // Arrange
    const paddingXY = 'px-4 py-2';
    const padding = 'p-2';

    // Act
    const result = cn(paddingXY, padding);

    // Assert
    // Tailwind-merge should prioritize p-2 over px-4 py-2
    expect(result).toBe('p-2');
  });

  it('should handle complex tailwind class merges', () => {
    // Arrange
    const baseClasses = 'text-sm font-medium text-slate-700';
    const hoverClasses = 'hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100';
    const overrideClasses = 'text-slate-900';

    // Act
    const result = cn(baseClasses, hoverClasses, overrideClasses);

    // Assert
    // Should override text-slate-700 with text-slate-900
    expect(result).toBe(
      'text-sm font-medium hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 text-slate-900',
    );
  });

  it('should handle array inputs', () => {
    // Arrange
    const flexClasses = ['flex', 'items-center'];
    const justifyClass = 'justify-between';

    // Act
    const result = cn(flexClasses, justifyClass);

    // Assert
    expect(result).toBe('flex items-center justify-between');
  });

  it('should handle nested arrays and objects', () => {
    // Arrange
    const baseClass = 'base';
    const complexClasses = ['flex', { 'justify-center': true, 'items-end': false }, ['p-4', { 'm-2': true }]];

    // Act
    const result = cn(baseClass, complexClasses);

    // Assert
    expect(result).toBe('base flex justify-center p-4 m-2');
  });
});
