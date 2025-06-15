import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// This utility function merges class names using clsx and tailwind-merge
// to ensure that Tailwind CSS classes are correctly combined and deduplicated.
// It can be used to conditionally apply classes in a React component.
// Example usage:
// const className = cn('bg-red-500', { 'text-white': isActive }, 'p-4');
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
