import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { CalendarIcon, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { type AxiosError } from 'axios';

// UI Components from shadcn
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/common/components/ui/form';
import { Input } from '@/common/components/ui/input';
import { Textarea } from '@/common/components/ui/textarea';
import { Button } from '@/common/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/common/components/ui/alert';
import { Checkbox } from '@/common/components/ui/checkbox';
import { Label } from '@/common/components/ui/label';
import { AlertTriangle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/common/components/ui/popover';
import { Calendar } from '@/common/components/ui/calendar';

// Local imports
import { updateTaskSchema, type UpdateTaskFormData } from './schemas/updateTaskSchema';
import { useUpdateTask } from './hooks/useUpdateTask';
import { useGetTask } from '../TaskDetail/hooks/useGetTask';
import { toast } from 'sonner';
import type { JSX } from 'react';

const UpdateTaskPage = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const { taskId } = useParams<{ taskId: string }>();
  const { mutate, isPending, error } = useUpdateTask();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Get task data to pre-populate form
  const { data: task, isLoading: isLoadingTask, isError: isTaskError, error: taskError } = useGetTask(taskId || '');

  const form = useForm<UpdateTaskFormData>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: '',
      detail: '',
      dueAt: undefined,
      isComplete: false,
    },
  });

  // Pre-populate form when task data is loaded
  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        detail: task.detail || '',
        dueAt: task.dueAt,
        isComplete: task.isComplete,
      });

      // Set date picker date if dueAt exists
      if (task.dueAt) {
        setDate(new Date(task.dueAt));
      }
    }
  }, [task, form]);

  useEffect(() => {
    if (!isPending && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isPending]);

  const onSubmit = (data: UpdateTaskFormData) => {
    if (!taskId) return;

    const formattedData = {
      ...data,
      detail: data.detail?.trim() || undefined,
      dueAt: date ? date.toISOString() : undefined,
    };

    mutate(
      { taskId, data: formattedData },
      {
        onSuccess: () => {
          toast.success('Task updated', {
            description: 'The task has been successfully updated.',
          });

          // Navigate back to previous page or default to task list
          const previousPath = location.state?.from || '/tasks';
          navigate(previousPath, { replace: true });
        },
        onError: () => {
          toast.error('Error', {
            description: 'Failed to update task. Please try again.',
          });
        },
      },
    );
  };

  const handleBack = () => {
    const previousPath = location.state?.from || '/tasks';
    navigate(previousPath);
  };

  // Loading task data
  if (isLoadingTask) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBack} className="p-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded-md mb-4"></div>
            <div className="h-32 bg-muted rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error loading task
  if (isTaskError || !task) {
    const isNotFound = taskError && 'response' in taskError && (taskError as AxiosError).response?.status === 404;

    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBack} className="p-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{isNotFound ? 'Task Not Found' : 'Error'}</AlertTitle>
          <AlertDescription>
            {isNotFound
              ? 'The task you are trying to edit does not exist or may have been deleted.'
              : taskError instanceof Error
              ? taskError.message
              : 'Failed to load task data'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={handleBack} className="p-0">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <h1 className="text-2xl font-bold mb-6">Edit Task</h1>

      <div className="bg-card rounded-md p-6 border">
        <h2 className="text-xl font-semibold mb-4">Task Details</h2>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error instanceof Error ? error.message : 'Failed to update task'}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" role="form">
            <FormField
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Title <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      ref={(e) => {
                        field.ref(e);
                        titleInputRef.current = e;
                      }}
                      placeholder="Enter task title..."
                      disabled={isPending}
                      autoFocus={!isPending}
                      aria-invalid={fieldState.invalid}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="detail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter task details (optional)"
                      {...field}
                      disabled={isPending}
                      className="min-h-24"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueAt"
              render={() => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-base">Due Date</FormLabel>
                  <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={`w-full justify-start font-normal ${!date && 'text-muted-foreground'}`}
                          disabled={isPending}
                        >
                          <CalendarIcon className="h-4 w-4" />
                          {date ? format(date, 'PPP') : 'Select a due date (optional)'}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(selectedDate) => {
                          if (selectedDate) {
                            // Set time to end of day (23:59:59.999)
                            const endOfDay = new Date(selectedDate);
                            endOfDay.setHours(23, 59, 59, 999);
                            setDate(endOfDay);
                          } else {
                            setDate(selectedDate);
                          }
                          setIsDatePickerOpen(false);
                        }}
                        disabled={(date) => date < new Date('1900-01-01')}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isComplete"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <Label className="text-base">Mark as complete</Label>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleBack} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Updating...' : 'Update Task'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateTaskPage;
