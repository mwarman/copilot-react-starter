/**
 * Represents a task in the application
 */
export interface Task {
  id: string;
  title: string;
  detail?: string;
  isComplete: boolean;
  dueAt?: string; // ISO 8601 format, e.g. YYYY-MM-DDTHH:mm:ssZ
}
