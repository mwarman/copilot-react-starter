# Requirements: Task Detail Page

## Overview

The Task Detail Page will display comprehensive information about a single task, providing users with a complete view of all task attributes. This page will allow users to inspect task details after clicking on a task in the task list view.

## User Stories

- As a user, I want to view all details of a single task so that I can get complete information about it
- As a user, I want to see appropriate loading indicators while the task data is being fetched
- As a user, I want to see clear error messages if the task cannot be loaded
- As a user, I want to easily identify if a task is overdue and incomplete
- As a user, I want to navigate back to the task list page after viewing the details

## Technical Requirements

### Routing and Navigation

- Implement a route for the task detail page: `/tasks/:taskId`
- When a user clicks anywhere on a task item in the task list, navigate to the task detail page
- Provide a clear "Back to Task List" button/link to return to the task list page

### Data Fetching

- Fetch task data from the API endpoint: `GET /tasks/{taskId}`
- Implement React Query to manage the API request state and data caching
- Display appropriate loading state while the data is being fetched
- Handle and display error states if the API request fails

### UI Components

- Display attributes of the Task model:
  - Title
  - Detail
  - Due date
  - Completion status
- Clearly highlight when a task is both incomplete and overdue (e.g., with warning colors or icons)
- Implement responsive design for various screen sizes

### UI States

1. **Loading State**: Display a skeleton loader while fetching task data
2. **Error State**: Show an error message if the task cannot be loaded
3. **Empty State**: Display an appropriate message if the task ID is invalid or no longer exists, e.g. the API returns status code 404
4. **Default State**: Show the complete task details when data is successfully loaded

## Design Considerations

- Use consistent styling with the rest of the application
- Ensure clear visual hierarchy of task information
- Make important task attributes (e.g., title, status, due date) more prominent
- Use color coding to indicate task status (overdue, completed, etc.)

## Implementation Guidelines

- Create a new page component in `/src/pages/TaskDetail`
- Implement a custom hook `useGetTask` in `/src/pages/TaskDetail/hooks` for data fetching
- Use React Query for efficient data fetching and state management
- Add proper type definitions using the Task model
- Write unit tests for the component and hook
