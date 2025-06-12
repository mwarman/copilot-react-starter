import { z } from 'zod';
import { type Task } from '@/common/models/Task';

/**
 * Zod schema for task update form validation
 */
export const updateTaskSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters long',
  }),
  detail: z.string().optional(),
  dueAt: z.string().optional(),
  isComplete: z.boolean(),
});

/**
 * Type for the form data, inferred from the Zod schema
 */
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;

/**
 * Type for the update task request body sent to the API
 */
export interface UpdateTaskRequest {
  title: string;
  detail?: string;
  dueAt?: string; // ISO 8601 date format
  isComplete: boolean;
}

/**
 * Type for the API response when successfully updating a task
 */
export type UpdateTaskResponse = Task;

/**
 * Type for the API error response
 */
export interface ErrorResponse {
  message: string;
}
