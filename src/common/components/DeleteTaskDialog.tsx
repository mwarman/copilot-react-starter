import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/common/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/common/components/ui/alert';
import { Button } from '@/common/components/ui/button';
import { Trash, AlertCircle } from 'lucide-react';
import { useDeleteTask } from '@/common/hooks/useDeleteTask';
import { useNavigate, useLocation } from 'react-router-dom';

interface DeleteTaskDialogProps {
  taskId: string;
  taskTitle: string;
  variant?: 'icon' | 'button';
  onDeleted?: () => void;
  navigateToListOnDelete?: boolean;
}

/**
 * Component for confirming task deletion.
 * Displays a button or icon that opens a confirmation dialog.
 *
 * Navigation behavior:
 * - If called from a task detail page, navigates back to task list on successful deletion
 * - If navigateToListOnDelete is true, navigates to task list on successful deletion
 * - If navigateBackOnCancel is true, navigates back to previous page on cancel
 * - Provides error handling with retry functionality
 */
export const DeleteTaskDialog = ({
  taskId,
  taskTitle,
  variant = 'icon',
  onDeleted,
  navigateToListOnDelete = false,
}: DeleteTaskDialogProps) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const deleteTask = useDeleteTask();
  const navigate = useNavigate();
  const location = useLocation();
  const fromTaskDetail = location.pathname.includes(`/tasks/${taskId}`);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('handleDelete called for taskId:', taskId);
    try {
      setError(null);
      await deleteTask.mutateAsync(taskId);
      setOpen(false);

      // If we're on the task detail page for the deleted task, always navigate back to the list
      if (fromTaskDetail) {
        navigate('/tasks');
      } else if (navigateToListOnDelete) {
        navigate('/tasks');
      }

      if (onDeleted) {
        onDeleted();
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete task');
      // Keep the dialog open so the user can see the error
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('handleCancel called');
    setOpen(false);
  };

  // Stop propagation to prevent navigation when clicking the delete button in the list view
  const handleTriggerClick = (e: React.MouseEvent) => {
    console.log('handleTriggerClick called');
    e.stopPropagation();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild onClick={handleTriggerClick}>
        {variant === 'icon' ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            data-testid="delete-task-button"
            aria-label={`Delete task: ${taskTitle}`}
          >
            <Trash className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="destructive" size="sm" className="flex items-center gap-2" data-testid="delete-task-button">
            <Trash className="h-4 w-4" />
            Delete Task
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Task</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{taskTitle}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <Alert
            variant="destructive"
            className="mt-2"
            data-testid="delete-error-message"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle className="h-4 w-4" />
            <div className="flex justify-between items-center w-full">
              <AlertDescription>{error}</AlertDescription>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="ml-2"
                data-testid="retry-delete-button"
                aria-label="Retry deleting task"
              >
                Retry
              </Button>
            </div>
          </Alert>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteTask.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            data-testid="confirm-delete-button"
          >
            {deleteTask.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTaskDialog;
