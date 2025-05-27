/**
 * Utility functions for CSS class operations.
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names and handles Tailwind CSS conflicts.
 * Uses clsx for combining and twMerge for resolving Tailwind conflicts.
 *
 * @param inputs - The class values to be combined
 * @returns The merged class name string
 */
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};
