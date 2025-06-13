# Task Detail Page

## Overview

The Task Detail Page displays comprehensive information about a single task. Users can view complete task details after selecting a task from the task list view. This page provides a focused view of all task attributes including its status, due date, and description.

## Requirements

### Functional Requirements

- Display comprehensive information for a single task
- Support viewing of all task attributes (title, detail, due date, completion status)
- Provide clear indication of task status (especially for overdue incomplete tasks)
- Allow navigation back to the task list

### Technical Requirements

- Create a new page component in `/src/pages/TaskDetail`
- Implement a custom hook `useGetTask` in `/src/pages/TaskDetail/hooks` for data fetching
- Use React Query for efficient data fetching and state management
- Add proper type definitions using the Task model
- Write unit tests for the component and hook
- Implement responsive design for various screen sizes

## User Experience / Design

### UI Components

- Task actions bar that will contain all relevant actions that may be taken on this Task.
  - Contains a "Back to Task List" button/link.
- Task title with appropriate emphasis
- Task detail/description area
- Due date display with formatting
- Completion status indicator
- Visual indicator for overdue tasks (if incomplete)
- The task list item currently hovered should show a visual indication

### UI States

1. **Loading State:** Display a skeleton loader while fetching task data
2. **Error State:** Show an error message if the task cannot be loaded
3. **Empty State:** Display an appropriate message if the task ID is invalid or no longer exists (API returns 404)
4. **Default State:** Show the complete task details when data is successfully loaded

### Design Considerations

- Use consistent styling with the rest of the application
- Ensure clear visual hierarchy of task information
- Make important task attributes (title, status, due date) more prominent
- Use color coding to indicate task status (overdue, completed, etc.)

## Navigation

- Implement a route for the task detail page: `/tasks/:taskId`
- When a user clicks anywhere on a task item in the task list, navigate to the task detail page
- Provide a clear "Back to Task List" button/link to return to the task list page

## API Integration

- Endpoint: `GET /tasks/{taskId}`
- Use React Query to manage the API request state and data caching
- Handle loading, error, and success states appropriately
- Special handling for 404 responses (task not found)

## Acceptance Criteria

1. **Task Information Display**

   - User can view the task title, detail, due date, and completion status
   - Overdue incomplete tasks are visually highlighted

2. **Navigation**

   - User can navigate to the task detail page by clicking on a task in the list
   - User can return to the task list via a clearly visible back button/link

3. **State Handling**

   - Loading indicators are shown while data is being fetched
   - Error messages are displayed when the task cannot be loaded
   - Appropriate message is shown when a task ID is invalid or no longer exists

4. **Responsive Design**
   - Page displays correctly on mobile, tablet, and desktop screen sizes
