import { CreateTaskForm } from './components/CreateTaskForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';

/**
 * Page component for creating a new task.
 * Contains the task creation form in a card layout.
 */
export const CreateTaskPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Task</h1>
      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateTaskForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTaskPage;
