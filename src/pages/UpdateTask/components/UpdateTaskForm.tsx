import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { type UpdateTaskFormData, updateTaskSchema } from '../schema';
import { useUpdateTask } from '../hooks/useUpdateTask';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Textarea } from '@/common/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/common/components/ui/alert';
import { AlertCircle, CalendarIcon } from 'lucide-react';
import { Calendar } from '@/common/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/common/components/ui/popover';
import { format, isValid, parseISO } from 'date-fns';
import { cn } from '@/common/utils/css';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/common/components/ui/form';
import { Checkbox } from '@/common/components/ui/checkbox';
import { type Task } from '@/common/models/Task';

interface UpdateTaskFormProps {
  task: Task;
  taskId: string;
  previousLocation?: string;
}

/**
 * Form component for updating an existing task.
 * Uses React Hook Form with Zod validation.
 */
export const UpdateTaskForm = ({ task, taskId, previousLocation }: UpdateTaskFormProps) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const navigate = useNavigate();
  const { mutate, isPending, isError, error } = useUpdateTask();

  // Initialize form with data from the task
  const form = useForm<UpdateTaskFormData>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: task.title,
      detail: task.detail || '',
      dueAt: task.dueAt || '',
      isComplete: task.isComplete,
    },
  });

  // Reset form when task changes
  useEffect(() => {
    form.reset({
      title: task.title,
      detail: task.detail || '',
      dueAt: task.dueAt || '',
      isComplete: task.isComplete,
    });
  }, [form, task]);

  // Handle form submission
  const onSubmit = async (data: UpdateTaskFormData) => {
    mutate(
      {
        taskId,
        taskData: {
          title: data.title,
          detail: data.detail,
          dueAt: data.dueAt,
          isComplete: data.isComplete,
        },
      },
      {
        onSuccess: () => {
          // If we came from a specific location, go back to it, otherwise go to the task detail page
          if (previousLocation) {
            navigate(previousLocation);
          } else {
            navigate(`/tasks/${taskId}`);
          }
        },
      },
    );
  };

  // Handle cancel button click
  const handleCancel = () => {
    if (previousLocation) {
      navigate(previousLocation);
    } else {
      navigate(`/tasks/${taskId}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {isError && (
          <Alert variant="destructive" className="mb-6 mx-6 mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'An error occurred while updating the task'}
            </AlertDescription>
          </Alert>
        )}

        {/* Title field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Title <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" {...field} data-testid="title-input" disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Detail field */}
        <FormField
          control={form.control}
          name="detail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detail</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter task details (optional)"
                  className="min-h-[120px]"
                  {...field}
                  data-testid="detail-input"
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription className="text-xs">Provide any additional information about the task.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Due Date field */}
        <FormField
          control={form.control}
          name="dueAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date</FormLabel>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                    data-testid="due-date-button"
                    disabled={isPending}
                  >
                    {field.value && isValid(parseISO(field.value)) ? (
                      format(parseISO(field.value), 'PPP')
                    ) : (
                      <span>Select a due date (optional)</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? parseISO(field.value) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        // Set to end of day in local timezone
                        const localDate = new Date(date);
                        localDate.setHours(23, 59, 59, 999);
                        field.onChange(localDate.toISOString());
                      } else {
                        field.onChange('');
                      }
                      setCalendarOpen(false);
                    }}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription className="text-xs">Set a deadline for this task if needed.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Completion Status field */}
        <FormField
          control={form.control}
          name="isComplete"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  data-testid="is-complete-checkbox"
                  disabled={isPending}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Completed</FormLabel>
                <FormDescription className="text-xs">Mark the task as completed</FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4 pt-6 mt-6 border-t">
          <Button
            variant="outline"
            type="button"
            onClick={handleCancel}
            data-testid="cancel-button"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} data-testid="update-button" className="min-w-[100px]">
            {isPending ? 'Updating...' : 'Update Task'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateTaskForm;
