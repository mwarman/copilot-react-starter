import { useParams, useNavigate } from 'react-router-dom';
import { useGetTask } from './hooks/useGetTask';
import { Button } from '@/common/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/common/components/ui/alert';
import { Skeleton } from '@/common/components/ui/skeleton';
import { AlertCircle, ArrowLeft, CheckCircle, Info } from 'lucide-react';
import { formatDistanceToNow, format, isPast, isValid } from 'date-fns';
import { cn } from '@/common/utils/css';

/**
 * Task Detail Page component.
 * Displays detailed information about a single task.
 * Handles loading, error, and not found states.
 */
export const TaskDetailPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { data: task, isLoading, isError, error } = useGetTask(taskId || '');

  // Helper function to navigate back to task list
  const goBackToList = () => {
    navigate('/tasks');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button onClick={goBackToList} variant="ghost" className="mb-4 inline-flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tasks
        </Button>
        <Skeleton className="h-8 w-48 mb-6" />

        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    // Handle 404 not found errors specifically
    const errorDetails = error as { status?: number; message: string };
    const is404 = errorDetails?.status === 404;

    return (
      <div className="container mx-auto px-4 py-8">
        <Button onClick={goBackToList} variant="ghost" className="mb-4 inline-flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tasks
        </Button>
        <h1 className="text-2xl font-bold mb-6">Task Not Found</h1>

        <Alert variant={is404 ? 'default' : 'destructive'}>
          {is404 ? <Info className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{is404 ? 'Task Not Found' : 'Error'}</AlertTitle>
          <AlertDescription>
            {is404
              ? "The task you're looking for doesn't exist or has been deleted."
              : errorDetails?.message || 'An unexpected error occurred while loading the task.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // If task data is missing (shouldn't happen with the error handling above, but just in case)
  if (!task) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button onClick={goBackToList} variant="ghost" className="mb-4 inline-flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tasks
        </Button>
        <h1 className="text-2xl font-bold mb-6">Task Not Found</h1>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>No Task Data</AlertTitle>
          <AlertDescription>Could not find the requested task.</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Format due date
  let formattedDueDate = null;
  let dueDateRelative = null;
  const dueDate = task.dueAt ? new Date(task.dueAt) : null;
  const isOverdue = dueDate && !task.isComplete && isPast(dueDate) && isValid(dueDate);

  if (dueDate && isValid(dueDate)) {
    formattedDueDate = format(dueDate, 'MMMM d, yyyy');
    dueDateRelative = formatDistanceToNow(dueDate, { addSuffix: true });
  }

  // Main content - Task detail view
  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={goBackToList} variant="ghost" className="mb-4 inline-flex items-center">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Tasks
      </Button>
      <h1 className="text-2xl font-bold mb-6">{task.title}</h1>

      <div className="bg-card rounded-lg border border-border p-6 mb-6">
        {/* Status Badge */}
        <div className="flex justify-between items-center mb-4">
          <div
            className={cn(
              'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
              task.isComplete
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : isOverdue
                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            )}
          >
            {task.isComplete ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Completed
              </>
            ) : isOverdue ? (
              <>
                <AlertCircle className="h-4 w-4 mr-2" />
                Overdue
              </>
            ) : (
              <>
                <Info className="h-4 w-4 mr-2" />
                In Progress
              </>
            )}
          </div>

          {/* Due Date - only shown for incomplete tasks */}
          {formattedDueDate && !task.isComplete && (
            <div className={cn('text-sm', isOverdue ? 'text-destructive' : 'text-muted-foreground')}>
              Due: {formattedDueDate} ({dueDateRelative})
            </div>
          )}
        </div>

        {/* Task Details */}
        <div className="mt-4">
          <h2 className="text-lg font-medium mb-2">Details</h2>
          <div className="bg-muted/40 p-4 rounded-md text-foreground/90 min-h-[100px]">
            {task.detail || <span className="text-muted-foreground italic">No details provided</span>}
          </div>
        </div>

        {/* Task ID for reference */}
        <div className="mt-6 text-xs text-muted-foreground">Task ID: {task.id}</div>
      </div>
    </div>
  );
};

export default TaskDetailPage;
