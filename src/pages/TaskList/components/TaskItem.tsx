import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate, isTaskOverdue } from '../utils/taskUtils';
import { TaskCompleteToggle } from './TaskCompleteToggle';
import type { Task } from '../../../common/models/Task';
import { cn } from '../../../common/utils/css';

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { id, title, detail, isComplete, dueAt } = task;
  const isOverdue = isTaskOverdue(task);
  const navigate = useNavigate();

  const handleTaskClick = (event: React.MouseEvent) => {
    // Don't navigate if clicking on the checkbox
    if ((event.target as HTMLElement).closest('[role="checkbox"]')) {
      return;
    }
    navigate(`/tasks/${id}`);
  };

  return (
    <div
      className={cn(
        'p-4 mb-4 rounded-md border transition-colors cursor-pointer hover:bg-muted/50',
        isComplete ? 'bg-muted border-muted' : isOverdue ? 'border-amber-500 dark:border-amber-600' : 'border-border',
      )}
      onClick={handleTaskClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          navigate(`/tasks/${id}`);
        }
      }}
    >
      <div className="flex items-start gap-3">
        <TaskCompleteToggle task={task} className="mt-1" />

        <div className="flex-1">
          {/* Mobile: Due date appears at the top on small screens */}
          <div
            className={cn(
              'text-sm md:hidden mb-1',
              isOverdue && !isComplete ? 'text-amber-600 dark:text-amber-500' : 'text-muted-foreground',
            )}
          >
            {formatDate(dueAt)}
          </div>

          {/* Desktop: Title and due date side by side */}
          <div className="flex justify-between items-start">
            <h3 className={cn('text-lg font-medium line-clamp-2', isComplete && 'line-through text-muted-foreground')}>
              {title}
            </h3>

            {/* Desktop: Due date appears to the right on medium screens and up */}
            <div
              className={cn(
                'text-sm whitespace-nowrap ml-2 hidden md:block',
                isOverdue && !isComplete ? 'text-amber-600 dark:text-amber-500' : 'text-muted-foreground',
              )}
            >
              {formatDate(dueAt)}
            </div>
          </div>

          {detail && (
            <p
              className={cn(
                'mt-1 text-sm line-clamp-2',
                isComplete ? 'line-through text-muted-foreground' : 'text-foreground',
              )}
            >
              {detail}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
