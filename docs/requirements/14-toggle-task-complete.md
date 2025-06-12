# Requirement: Toggle Task Completion

## Overview

This feature allows users to toggle the completion status of a task by marking it as complete or incomplete. The toggle functionality will be available both in the task list view and in the task detail view.

## Requirements

- Users should be able to mark tasks as complete or incomplete
- The completion status should be reflected visually in the UI
- Changes to completion status should be persisted to the backend
- Updates should be optimistic to provide immediate feedback
- Both task list view and task detail view should support toggling

## User Experience / Design

### Task List View

- Display a checkbox next to each task
- Checkbox should reflect the current completion status of the task
- Clicking the checkbox should toggle the task's completion status
- Visual indication should change immediately upon toggle

### Task Detail View

- Display a prominent checkbox or toggle control in the actions bar
- Control should reflect the current completion status of the task
- Clicking the control should toggle the task's completion status
- Visual indication should change immediately upon toggle

## API Integration

- Implement a custom hook named `useToggleTaskComplete`
- The hook should use React Query's mutation functionality
- It should call the PUT `/tasks/{taskId}` endpoint with updated isComplete status
- Handle optimistic updates for immediate UI feedback
- Implement error handling with user feedback if the API call fails
- Ensure task list and task detail views stay in sync when both are visible

## Acceptance Criteria

1. Users can toggle task completion status from the task list view
2. Users can toggle task completion status from the task detail view
3. Changes are persisted to the backend via the API
4. Changes are reflected immediately in the UI (optimistic updates)
5. If both task list and detail views are visible, both should reflect the changes
6. Appropriate error handling is implemented with user feedback
7. All unit tests pass with good coverage
8. No lint errors
