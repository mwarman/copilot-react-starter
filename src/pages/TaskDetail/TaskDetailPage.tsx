import { useParams, useNavigate } from 'react-router-dom';
import { useGetTask } from './hooks/useGetTask';
import { formatDate, formatDateRelative, isTaskOverdue } from '../TaskList/utils/taskUtils';
import { TaskCompleteToggle } from '../TaskList/components/TaskCompleteToggle';
import { DeleteTaskButton } from './components/DeleteTaskButton';
import { Alert, AlertDescription, AlertTitle } from '../../common/components/ui/alert';
import { Button } from '../../common/components/ui/button';
import { Badge } from '../../common/components/ui/badge';
import { AlertTriangle, ArrowLeft, CheckCircle, Circle, InfoIcon } from 'lucide-react';
import { cn } from '../../common/utils/css';
import type { JSX } from 'react';

/**
 * TaskDetailPage component that displays comprehensive information about a single task
 */
const TaskDetailPage = (): JSX.Element => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { data: task, isLoading, isError, error, refetch } = useGetTask(taskId || '');

  const handleBackToTasks = () => {
    navigate('/tasks');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded-md w-32 mb-6"></div>
          <div className="h-10 bg-muted rounded-md w-3/4 mb-4"></div>
          <div className="h-6 bg-muted rounded-md w-48 mb-6"></div>
          <div className="h-6 bg-muted rounded-md w-32 mb-2"></div>
          <div className="h-20 bg-muted rounded-md w-full mb-4"></div>
          <div className="h-6 bg-muted rounded-md w-24"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    const isNotFound = error instanceof Error && error.message.includes('404');

    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBackToTasks} className="p-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tasks
          </Button>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{isNotFound ? 'Task Not Found' : 'Error'}</AlertTitle>
          <AlertDescription>
            <div>
              {isNotFound
                ? 'The task you are looking for does not exist or may have been deleted.'
                : error instanceof Error
                ? error.message
                : 'Failed to load task details'}
            </div>
            {!isNotFound && (
              <Button variant="outline" onClick={() => refetch()} className="mt-2">
                Try again
              </Button>
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Empty state (should not happen with proper routing, but just in case)
  if (!task) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBackToTasks} className="p-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tasks
          </Button>
        </div>

        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Task Not Found</AlertTitle>
          <AlertDescription>The task you are looking for does not exist.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const isOverdue = isTaskOverdue(task);

  // Success state - display task details
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      {/* Header with back navigation */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={handleBackToTasks} className="p-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tasks
          </Button>

          {/* Actions area */}
          <div className="flex items-center gap-2">
            <DeleteTaskButton taskId={task.id} taskTitle={task.title} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Completion status icon */}
          {task.isComplete ? (
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-500" />
          ) : (
            <Circle className="h-6 w-6 text-muted-foreground" />
          )}

          {/* Task title */}
          <h1 className={cn('text-3xl font-bold flex-1', task.isComplete && 'line-through text-muted-foreground')}>
            {task.title}
          </h1>
        </div>
      </div>

      {/* Task attributes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Status section */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Status</h2>
          <div className="flex items-center gap-2">
            <Badge variant={task.isComplete ? 'secondary' : 'outline'}>
              {task.isComplete ? 'Completed' : 'Incomplete'}
            </Badge>
            {isOverdue && !task.isComplete && (
              <Badge variant="destructive">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Overdue
              </Badge>
            )}
          </div>
        </div>

        {/* Due date section */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Due Date</h2>
          <p
            className={cn(
              'text-base',
              isOverdue && !task.isComplete
                ? 'text-amber-600 dark:text-amber-500 font-medium'
                : 'text-muted-foreground',
            )}
          >
            {formatDate(task.dueAt)} {task.dueAt && `(${formatDateRelative(task.dueAt)})`}
          </p>
        </div>

        {/* Task completion toggle */}
        <TaskCompleteToggle task={task} showLabel />
      </div>

      {/* Task detail */}
      {task.detail && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Details</h2>
          <div className="rounded-md border p-4 bg-muted/50">
            <p className={cn('text-base leading-relaxed whitespace-pre-wrap')}>{task.detail}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetailPage;
