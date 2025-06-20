import { z } from 'zod';

/**
 * Schema for validating task update form data
 */
export const updateTaskSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters long'),
  detail: z.string().optional(),
  dueAt: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(val), {
      message: 'Invalid date format. Use YYYY-MM-DDTHH:mm:ss.sssZ',
    }),
  isComplete: z.boolean(),
});

/**
 * Type for the task update form data
 */
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;
