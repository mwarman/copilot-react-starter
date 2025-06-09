import { z } from 'zod';

/**
 * Zod schema for task creation form validation
 */
export const createTaskSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters long',
  }),
  detail: z.string().optional(),
  dueAt: z.string().optional(),
});

/**
 * Type for the form data, inferred from the Zod schema
 */
export type CreateTaskFormData = z.infer<typeof createTaskSchema>;

/**
 * Type for the create task request body sent to the API
 */
export interface CreateTaskRequest {
  title: string;
  detail?: string;
  dueAt?: string; // ISO 8601 date format
}

/**
 * Type for the API response when successfully creating a task
 */
export interface CreateTaskResponse {
  id: string;
  title: string;
  isComplete: boolean;
  detail?: string;
  dueAt?: string;
}

/**
 * Type for the API error response
 */
export interface ErrorResponse {
  message: string;
}
