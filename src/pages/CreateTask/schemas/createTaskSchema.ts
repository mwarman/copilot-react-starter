import { z } from 'zod';

/**
 * Schema for validating task creation form data
 */
export const createTaskSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters long'),
  detail: z.string().optional(),
  dueAt: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(val), {
      message: 'Invalid date format. Use YYYY-MM-DDTHH:mm:ssZ',
    }),
});

/**
 * Type for the task creation form data
 */
export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
