import { Checkbox } from '../../../common/components/ui/checkbox';
import { Label } from '../../../common/components/ui/label';
import { useToggleTaskComplete } from '../hooks/useToggleTaskComplete';
import type { Task } from '../../../common/models/Task';
import { cn } from '@/common/utils/css';

interface TaskCompleteToggleProps {
  task: Task;
  showLabel?: boolean;
  className?: string;
}

/**
 * Reusable component for toggling task completion status
 * Can be used with or without a label for different UI contexts
 */
export const TaskCompleteToggle = ({ task, showLabel = false, className = '' }: TaskCompleteToggleProps) => {
  const { mutate } = useToggleTaskComplete();

  const handleToggle = (checked: boolean) => {
    mutate({
      taskId: task.id,
      isComplete: checked,
    });
  };

  if (showLabel) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Checkbox
          id={`complete-${task.id}`}
          checked={task.isComplete}
          onCheckedChange={handleToggle}
          className="size-6"
        />
        <Label
          htmlFor={`complete-${task.id}`}
          className="text-lg font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Mark Complete
        </Label>
      </div>
    );
  }

  return (
    <Checkbox
      id={`complete-${task.id}`}
      checked={task.isComplete}
      onCheckedChange={handleToggle}
      className={cn('size-6', className)}
    />
  );
};
