import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/common/components/ui/button';
import { ConfirmationDialog } from '@/common/components/ConfirmationDialog/ConfirmationDialog';
import { useDeleteTask } from '@/common/hooks/useDeleteTask';

interface DeleteTaskButtonProps {
  taskId: string;
  taskTitle: string;
}

/**
 * Delete button component for task detail view
 */
export const DeleteTaskButton = ({ taskId, taskTitle }: DeleteTaskButtonProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const deleteTask = useDeleteTask();

  const handleDelete = async () => {
    try {
      await deleteTask.mutateAsync({ taskId });
      toast.success('Task deleted', {
        description: 'The task has been successfully deleted.',
      });
      navigate('/tasks'); // Redirect to task list
    } catch (_error) {
      toast.error('Error', {
        description: 'Failed to delete task. Please try again.',
      });
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setShowDeleteDialog(true)}
        disabled={deleteTask.isPending}
        aria-label={`Delete ${taskTitle}`}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>

      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Task"
        description={`Are you sure you want to delete "${taskTitle}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        isLoading={deleteTask.isPending}
      />
    </>
  );
};
