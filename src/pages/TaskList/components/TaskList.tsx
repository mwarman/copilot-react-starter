import { type Task } from '@/common/models/Task';
import { TaskItem } from './TaskItem';
import { isValid, parseISO } from 'date-fns';

interface TaskListProps {
  tasks: Task[];
}

/**
 * Component that renders a list of tasks.
 * Sorts tasks by due date (earliest first), with tasks without due dates at the end.
 */
export const TaskList = ({ tasks }: TaskListProps) => {
  // Sort tasks by due date (tasks with due dates first, then tasks without due dates)
  const sortedTasks = [...tasks].sort((a, b) => {
    // If both tasks have due dates, sort by due date
    if (a.dueAt && b.dueAt) {
      const dateA = parseISO(a.dueAt);
      const dateB = parseISO(b.dueAt);

      // If both dates are valid, compare them
      if (isValid(dateA) && isValid(dateB)) {
        return dateA.getTime() - dateB.getTime();
      }
    }

    // If only one task has a due date, prioritize it
    if (a.dueAt && !b.dueAt) return -1;
    if (!a.dueAt && b.dueAt) return 1;

    // If neither has a due date, keep original order
    return 0;
  });

  return (
    <div className="space-y-2">
      {sortedTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
