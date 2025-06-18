import { describe, it, expect } from 'vitest';
import { createTaskSchema } from './createTaskSchema';

describe('createTaskSchema', () => {
  it('should validate a valid task creation form', () => {
    // Arrange
    const validForm = {
      title: 'Test Task',
      detail: 'This is a test task',
      dueAt: '2025-06-17T12:00:00Z',
    };

    // Act & Assert
    expect(() => createTaskSchema.parse(validForm)).not.toThrow();
  });

  it('should validate a form with only required fields', () => {
    // Arrange
    const validForm = {
      title: 'Test Task',
    };

    // Act & Assert
    expect(() => createTaskSchema.parse(validForm)).not.toThrow();
  });

  it('should throw an error for a title with less than 2 characters', () => {
    // Arrange
    const invalidForm = {
      title: 'T',
    };

    // Act & Assert
    expect(() => createTaskSchema.parse(invalidForm)).toThrow();
  });

  it('should throw an error for an invalid date format', () => {
    // Arrange
    const invalidForm = {
      title: 'Test Task',
      dueAt: '2025-06-17', // Missing time component
    };

    // Act & Assert
    expect(() => createTaskSchema.parse(invalidForm)).toThrow();
  });
});
