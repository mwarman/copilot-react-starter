import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/common/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu';
import { ConfirmationDialog } from '@/common/components/ConfirmationDialog/ConfirmationDialog';
import { useDeleteTask } from '@/common/hooks/useDeleteTask';

interface TaskItemMenuProps {
  taskId: string;
  taskTitle: string;
}

/**
 * Dropdown menu for task list items with edit and delete functionality
 */
export const TaskItemMenu = ({ taskId, taskTitle }: TaskItemMenuProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const deleteTask = useDeleteTask();

  const handleEdit = () => {
    navigate(`/tasks/${taskId}/edit`, {
      state: { from: '/tasks' },
    });
  };

  const handleDelete = async () => {
    try {
      await deleteTask.mutateAsync({ taskId });
      toast.success('Task deleted', {
        description: 'The task has been successfully deleted.',
      });
      setShowDeleteDialog(false);
    } catch (_error) {
      toast.error('Error', {
        description: 'Failed to delete task. Please try again.',
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label={`More actions for ${taskTitle}`}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
