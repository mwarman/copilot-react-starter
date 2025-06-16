import React from 'react';
import { useGetTasks } from './hooks/useGetTasks';
import { TaskItem } from './components/TaskItem';
import { sortTasks } from './utils/taskUtils';
import { Alert, AlertDescription, AlertTitle } from '../../common/components/ui/alert';
import { AlertTriangle, InfoIcon } from 'lucide-react';
import { Button } from '@/common/components/ui/button';

const TaskListPage: React.FC = () => {
  const { data: tasks, isLoading, isError, error, refetch } = useGetTasks();

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">My Tasks</h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-16 bg-muted rounded-md mb-4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">My Tasks</h1>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            <div>{error instanceof Error ? error.message : 'Failed to load tasks'}</div>
            <Button variant="outline" onClick={() => refetch()} className="mt-2">
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Empty state
  if (!tasks || tasks.length === 0) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">My Tasks</h1>
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>No tasks found</AlertTitle>
          <AlertDescription>You don't have any tasks yet. Create a new task to get started.</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Sort tasks by the required order
  const sortedTasks = sortTasks(tasks);

  // Populated state
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">My Tasks</h1>
      <div className="space-y-1">
        {sortedTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default TaskListPage;
