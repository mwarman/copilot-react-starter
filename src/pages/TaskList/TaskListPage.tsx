import { useGetTasks } from './hooks/useGetTasks';
import { useFilterTasks } from './hooks/useFilterTasks';
import { TaskList } from './components/TaskList';
import { TaskFilterBar } from './components/TaskFilterBar';
import { Alert, AlertDescription, AlertTitle } from '@/common/components/ui/alert';
import { Skeleton } from '@/common/components/ui/skeleton';
import { AlertCircle, Info } from 'lucide-react';

/**
 * Main page component for displaying the list of tasks.
 * Handles loading, empty, and error states.
 * Supports filtering tasks by title and detail.
 */
export const TaskListPage = () => {
  const { data: tasks, isLoading, isError, error, refetch } = useGetTasks();

  // Initialize filtering with empty array if tasks aren't loaded yet
  const { filteredTasks, filterText, setFilterText, filteredCount, totalCount } = useFilterTasks(tasks || []);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Tasks</h1>
        <div className="space-y-3">
          <Skeleton className="h-[60px] w-full rounded-md" data-testid="skeleton-1" />
          <Skeleton className="h-[60px] w-full rounded-md" data-testid="skeleton-2" />
          <Skeleton className="h-[60px] w-full rounded-md" data-testid="skeleton-3" />
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Tasks</h1>
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error instanceof Error ? error.message : 'Failed to load tasks'}</AlertDescription>
          <button
            onClick={() => refetch()}
            className="mt-2 px-3 py-1 text-sm bg-destructive-foreground text-destructive rounded-md hover:bg-destructive-foreground/90"
          >
            Try Again
          </button>
        </Alert>
      </div>
    );
  }

  // Empty state
  if (!tasks || tasks.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Tasks</h1>
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>No tasks found</AlertTitle>
          <AlertDescription>You don't have any tasks yet. Create a new task to get started.</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Populated state
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Tasks</h1>
      <TaskFilterBar
        filterText={filterText}
        onFilterChange={setFilterText}
        filteredCount={filteredCount}
        totalCount={totalCount}
      />
      <TaskList tasks={filteredTasks} />
    </div>
  );
};

export default TaskListPage;
