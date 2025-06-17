import { useState, type JSX } from 'react';
import { useGetTasks } from './hooks/useGetTasks';
import { TaskItem } from './components/TaskItem';
import { sortTasks } from './utils/taskUtils';
import { Alert, AlertDescription, AlertTitle } from '../../common/components/ui/alert';
import { AlertTriangle, InfoIcon } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { TaskFilterBar, type FilterOptions } from './components/TaskFilterBar/TaskFilterBar';
import { useFilterTasks } from './hooks/useFilterTasks';
import { useLocalStorage } from '@/common/hooks/useLocalStorage';

const TaskListPage = (): JSX.Element => {
  const [filterText, setFilterText] = useState('');
  const [filterOptions, setFilterOptions] = useLocalStorage<FilterOptions>('taskFilterOptions', {
    showComplete: false,
    showIncomplete: false,
    showOverdue: false,
  });

  const { data: tasks, isLoading, isError, error, refetch } = useGetTasks();

  // Sort and filter tasks
  const sortedTasks = tasks ? sortTasks(tasks) : [];
  const { filteredTasks, filteredCount, totalCount } = useFilterTasks(sortedTasks, filterText, filterOptions);

  const handleFilterChange = (value: string) => {
    setFilterText(value);
  };

  const handleFilterOptionsChange = (options: FilterOptions) => {
    setFilterOptions(options);
  };

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
  if (totalCount === 0) {
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

  // No results state
  const noResults = totalCount > 0 && filteredCount === 0;

  // Populated state
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">My Tasks</h1>

      <div className="mb-6">
        <TaskFilterBar
          onFilterChange={handleFilterChange}
          onFilterOptionsChange={handleFilterOptionsChange}
          filterOptions={filterOptions}
          filteredCount={filteredCount}
          totalCount={totalCount}
        />
      </div>

      {noResults ? (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>No matches found</AlertTitle>
          <AlertDescription>No tasks match your current filter. Try adjusting your search criteria.</AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-1">
          {filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskListPage;
