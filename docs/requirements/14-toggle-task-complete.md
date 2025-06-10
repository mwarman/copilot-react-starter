# Toggle Task Completion Feature

## Overview

This feature allows users to toggle the completion status of a task by marking it as complete or incomplete. The toggle functionality will be available both in the task list view and in the task detail view.

## Requirements

### User Interface

1. In the task list view:

- Display a checkbox next to each task
- Checkbox should reflect the current completion status of the task
- Clicking the checkbox should toggle the task's completion status

2. In the task detail view:

- Display a prominent checkbox or toggle control
- Control should reflect the current completion status of the task
- Clicking the control should toggle the task's completion status

### API Integration

1. Implement a custom hook to update task completion status:

- Hook name: `useToggleTaskComplete`
- The hook should use React Query's mutation functionality
- It should call the PUT `/tasks/{taskId}` endpoint with updated isComplete status

### Behavior

1. After toggling a task's completion status:

- UI should immediately reflect the new status (optimistic update)
- Task list and task detail should stay in sync if both are visible
- Any errors should be properly handled with user feedback

## Acceptance Criteria

1. Users can toggle task completion status from the task list view
2. Users can toggle task completion status from the task detail view
3. Changes are persisted to the backend via the API
4. Changes are reflected immediately in the UI (optimistic updates)
5. All unit tests pass with good coverage
6. No lint errors
