import { type Task } from '@/common/models/Task';
import { format, isPast, isValid } from 'date-fns';
import { CheckCircle2, AlertCircle, CircleIcon } from 'lucide-react';
import { cn } from '@/common/utils/css';
import { useNavigate } from 'react-router-dom';

interface TaskItemProps {
  task: Task;
}

/**
 * Component to display an individual task item.
 * Shows task title, completion status, and due date.
 * Navigates to task detail page when clicked.
 */
export const TaskItem = ({ task }: TaskItemProps) => {
  const navigate = useNavigate();

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
        'p-4 border rounded-md mb-2 transition-colors cursor-pointer hover:border-primary/50',
        task.isComplete
          ? 'bg-muted/50 border-muted'
          : isOverdue
          ? 'border-destructive/30 bg-destructive/5'
          : 'border-border bg-background',
      )}
      onClick={() => navigate(`/tasks/${task.id}`)}
      data-testid="task-item"
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
        <div className="flex-grow min-w-0">
          <h3 className={cn('text-md font-medium', task.isComplete && 'line-through text-muted-foreground')}>
            {task.title}
          </h3>
          {task.detail && <div className="text-sm text-muted-foreground mt-1 truncate">{task.detail}</div>}
        </div>
        {formattedDueDate && (
          <div
            className={cn(
              'text-xs px-2 py-1 rounded-full min-w-24 text-center',
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
