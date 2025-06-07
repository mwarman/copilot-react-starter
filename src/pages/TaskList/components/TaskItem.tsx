import { type Task } from '@/common/models/Task';
import { format, isPast, isValid } from 'date-fns';
import { CheckCircle2, AlertCircle, CircleIcon } from 'lucide-react';
import { cn } from '@/common/utils/css';

interface TaskItemProps {
  task: Task;
}

/**
 * Component to display an individual task item.
 * Shows task title, completion status, and due date.
 */
export const TaskItem = ({ task }: TaskItemProps) => {
  // Format the due date if it exists
  const formattedDueDate = task.dueAt
    ? isValid(new Date(task.dueAt))
      ? format(new Date(task.dueAt), 'MMM d, yyyy')
      : 'Invalid date'
    : undefined;

  // Check if the task is overdue (due date is in the past and task is not complete)
  const isOverdue = task.dueAt
    ? !task.isComplete && isPast(new Date(task.dueAt)) && isValid(new Date(task.dueAt))
    : false;

  return (
    <div
      className={cn(
        'p-4 border rounded-md mb-2 transition-colors',
        task.isComplete
          ? 'bg-muted/50 border-muted'
          : isOverdue
          ? 'border-destructive/30 bg-destructive/5'
          : 'border-border bg-background',
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          {task.isComplete ? (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          ) : isOverdue ? (
            <AlertCircle className="h-5 w-5 text-destructive" />
          ) : (
            <CircleIcon className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex-grow">
          <h3 className={cn('text-md font-medium', task.isComplete && 'line-through text-muted-foreground')}>
            {task.title}
          </h3>
          {task.detail && <p className="text-sm text-muted-foreground mt-1 max-w-sm truncate">{task.detail}</p>}
        </div>
        {formattedDueDate && (
          <div
            className={cn(
              'text-xs px-2 py-1 rounded-full',
              isOverdue ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground',
            )}
          >
            {formattedDueDate}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
