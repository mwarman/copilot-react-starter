import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type CreateTaskFormData, createTaskSchema } from '../schema';
import { useCreateTask } from '../hooks/useCreateTask';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Textarea } from '@/common/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/common/components/ui/alert';
import { AlertCircle, CalendarIcon } from 'lucide-react';
import { Calendar } from '@/common/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/common/components/ui/popover';
import { format } from 'date-fns';
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

export const CreateTaskForm = () => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const navigate = useNavigate();
  const { mutate, isPending, isError, error } = useCreateTask();

  // Define form using shadcn/ui Form pattern
  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      detail: '',
      dueAt: '',
    },
  });

  const onSubmit = (data: CreateTaskFormData) => {
    console.log('Form submitted with data:', data);
    mutate(data, {
      onSuccess: () => {
        navigate('/tasks');
      },
    });
  };

  const handleCancel = () => {
    navigate('/tasks');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error instanceof Error ? error.message : 'An error occurred'}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Title <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" disabled={isPending} {...field} />
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
              <FormLabel>Detail</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter task details (optional)" rows={4} disabled={isPending} {...field} />
              </FormControl>
              <FormDescription>Provide any additional information about the task.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                      disabled={isPending}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(new Date(field.value), 'PPP') : <span>Select a due date (optional)</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        field.onChange(date ? date.toISOString() : '');
                        setCalendarOpen(false);
                      }}
                      disabled={isPending}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormDescription>Set a deadline for this task if needed.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Creating...' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateTaskForm;
