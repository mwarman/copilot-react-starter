/**
 * Represents a task in the application.
 */
export interface Task {
  /**
   * Unique identifier for the task
   */
  id: string;

  /**
   * Title of the task
   */
  title: string;

  /**
   * Optional detailed description of the task
   */
  detail?: string;

  /**
   * Indicates if the task is completed
   */
  isComplete: boolean;

  /**
   * Optional due date in ISO 8601 format
   */
  dueAt?: string;
}
