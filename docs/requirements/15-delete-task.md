# Requirement: Delete a Task

## Overview

This document outlines the requirements for implementing task deletion functionality in the Task UI application. Users should be able to delete tasks from both the task list and task detail views.

## User Stories

### Delete from List View

As a user, I want to delete a task directly from the task list view so that I can quickly remove completed or unwanted tasks without navigating to the detail page.

### Delete from Detail View

As a user, I want to delete a task from the task detail view so that I can review task details before deciding to delete it. After successful deletion, I should be returned to the task list view.

## API Integration

The application will use the DELETE endpoint at `/tasks/{taskId}` as defined in the API specification:

```
DELETE /tasks/{taskId}
```

### Response Codes

- 204: Success (No Content)
- 404: Task not found

## UI/UX Requirements

### Delete Button

- In list view: Add a delete icon button to each task item
- In detail view: Add a delete button in the actions area

### Loading States

- Show a loading indicator while deletion is in progress
- Disable the delete button during the deletion process

### Error Handling

- Display an error Alert if deletion fails
- Include retry functionality when appropriate

### Confirmation

- Show a confirmation Dialog before deleting a task
- Provide clear messaging about the permanent nature of deletion

## Technical Implementation

### React Query Mutation

Implement a `useDeleteTask` hook using React Query's mutation functionality:

```typescript
const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      await api.delete(`/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
```

### Component Implementation

Both list and detail views should implement:

- Delete confirmation dialog using shadcn/ui components
- Loading states for deletion in progress
- Error handling with appropriate user feedback
- Navigation back to list view after successful deletion from detail view

### Unit Tests

Comprehensive tests should include:

- Testing the `useDeleteTask` hook
- Testing delete functionality in both list and detail components
- Testing loading and error states
- Testing navigation after successful deletion

## Accessibility Requirements

- All buttons must have appropriate aria labels
- Confirmation dialog must be keyboard navigable
- Error messages must be announced to screen readers

## Implementation Checklist

1. Create `useDeleteTask` hook with React Query
2. Implement confirmation dialog component
3. Add delete functionality to task list items
4. Add delete functionality to task detail view
5. Implement loading states and error handling
6. Add navigation from detail to list after deletion
7. Write unit tests for all components and hooks
8. Verify accessibility compliance

## Design Notes

Use Lucide React for delete icons and shadcn/ui components for consistent styling across the application.
