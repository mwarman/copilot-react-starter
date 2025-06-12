import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useGetTask } from '@/pages/TaskDetail/hooks/useGetTask';
import { UpdateTaskForm } from './components/UpdateTaskForm';
import { Alert, AlertDescription, AlertTitle } from '@/common/components/ui/alert';
import { Skeleton } from '@/common/components/ui/skeleton';
import { Button } from '@/common/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { AlertCircle } from 'lucide-react';

/**
 * Update Task Page component.
 * Displays a form for updating an existing task.
 * Handles loading, error, and not found states.
 */
export const UpdateTaskPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the previous location from state
  const previousLocation = location.state?.from || '/tasks';

  // Get task data
  const { data: task, isLoading, isError, error } = useGetTask(taskId ?? '');

  // Navigate back to tasks list or previous page
  const goBack = () => {
    navigate(previousLocation);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Update Task</h1>
        <Card>
          <CardHeader>
            <CardTitle>Loading Task...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-12 w-full" data-slot="skeleton" />
            <Skeleton className="h-32 w-full" data-slot="skeleton" />
            <Skeleton className="h-12 w-full" data-slot="skeleton" />
            <Skeleton className="h-12 w-full" data-slot="skeleton" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Update Task</h1>
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error?.message || 'An unexpected error occurred while loading the task.'}
          </AlertDescription>
        </Alert>
        <Button onClick={goBack} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  // Not found state
  if (!task) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Task Not Found</h1>
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Task Not Found</AlertTitle>
          <AlertDescription>The task you're looking for doesn't exist or has been deleted.</AlertDescription>
        </Alert>
        <Button onClick={goBack} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  // Main content - Task update form
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Update Task</h1>
      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <UpdateTaskForm task={task} taskId={taskId ?? ''} previousLocation={previousLocation} />
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateTaskPage;
