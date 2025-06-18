import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

// UI Components from shadcn
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/common/components/ui/form';
import { Input } from '@/common/components/ui/input';
import { Textarea } from '@/common/components/ui/textarea';
import { Button } from '@/common/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/common/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/common/components/ui/popover';
import { Calendar } from '@/common/components/ui/calendar';

// Local imports
import { createTaskSchema, type CreateTaskFormData } from './schemas/createTaskSchema';
import { useCreateTask } from './hooks/useCreateTask';

const CreateTaskPage = () => {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useCreateTask();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      detail: '',
      dueAt: undefined,
    },
  });

  useEffect(() => {
    if (!isPending && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isPending]);

  const onSubmit = (data: CreateTaskFormData) => {
    // Format dueAt as ISO string if present
    const formattedData = {
      ...data,
      isComplete: false,
      detail: data.detail?.trim() || undefined,
      dueAt: date ? date.toISOString() : undefined,
    };

    mutate(formattedData);
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Add a Task</h1>

      <div className="bg-card rounded-md p-6 border">
        <h2 className="text-xl font-semibold mb-4">Task Details</h2>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error instanceof Error ? error.message : 'Failed to create task'}</AlertDescription>
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
                        onSelect={(date) => {
                          setDate(date);
                          setIsDatePickerOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/tasks')} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Creating...' : 'Create Task'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateTaskPage;
