import { describe, it, expect } from 'vitest';
import { cn } from './css';

describe('css utility', () => {
  describe('cn function', () => {
    it('should merge class names correctly', () => {
      const result = cn('font-bold', 'text-red-500');
      expect(result).toBe('font-bold text-red-500');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const isDisabled = false;
      const result = cn('font-bold', isActive && 'text-red-500', isDisabled && 'text-blue-500');
      expect(result).toBe('font-bold text-red-500');
    });

    it('should merge Tailwind classes properly, removing duplicates', () => {
      const result = cn('p-4 text-red-500', 'p-6 text-blue-500');
      // twMerge should keep the last conflicting class and remove the earlier ones
      expect(result).toBe('p-6 text-blue-500');
    });

    it('should handle arrays of classes', () => {
      const result = cn(['font-bold', 'text-red-500'], 'p-4');
      expect(result).toBe('font-bold text-red-500 p-4');
    });

    it('should handle object notation for conditional classes', () => {
      const result = cn({ 'font-bold': true, 'text-red-500': false, 'p-4': true });
      expect(result).toBe('font-bold p-4');
    });

    it('should handle empty or falsy inputs', () => {
      const result = cn('', null, undefined, 'text-red-500', false, 0);
      expect(result).toBe('text-red-500');
    });

    it('should handle complex combinations of inputs', () => {
      const isError = true;
      const isPrimary = false;

      const result = cn(
        'base-class',
        { 'error-class': isError, 'primary-class': isPrimary },
        isError && 'active-error',
        ['nested-class-1', 'nested-class-2'],
      );

      expect(result).toBe('base-class error-class active-error nested-class-1 nested-class-2');
    });
  });
});
