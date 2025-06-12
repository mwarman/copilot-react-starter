# Requirement: Task List Page

## Overview

This document outlines the requirements for implementing a Task List page in our React application. The Task List page will serve as the default landing page and display a collection of tasks retrieved from the API.

## User Stories

- As a user, I want to see all my tasks in a list format so I can easily scan my responsibilities
- As a user, I want tasks sorted by due date so I can prioritize my work
- As a user, I want to see which tasks are completed and which are overdue at a glance
- As a user, I want to see an appropriate message when I have no tasks or when an error occurs

## Functional Requirements

### Routing

- The Task List page should be configured as the default route for the application
- The application should redirect from "/" to "/tasks"
- The task list route path should be "/tasks"

### Data Fetching

- The page should fetch task data from the `/tasks` API endpoint
- Use React Query with Axios for data fetching and state management
- Implement proper error handling for API request failures

### UI States

#### Loading State

- Display a loading indicator while the tasks are being fetched
- Consider using a **Skeleton** loader component for better UX

#### Empty State

- If the API returns an empty collection, display an **Alert** component with an appropriate message
- Message should inform the user they have no tasks and prompt them to create one

#### Error State

- If the API request fails, display an **Alert** component with an error message
- Provide a retry option if appropriate

#### Populated State

- If tasks are returned, display them in a list format
- Each task item should show:
  - Completion status indicator (e.g., checkbox or icon)
  - Task title
  - Due date (formatted appropriately)
  - Overdue status indicator for tasks past their due date

### Task Sorting and Display Logic

- Sort tasks by due date in ascending order (earliest dates first)
- Tasks without due dates should appear after tasks with due dates
- Overdue tasks should have a visual indicator (icon or color)
- Completed tasks should be visually distinguished (e.g., strikethrough text, different background color)

### Responsive Design

- The task list must be fully responsive and work on mobile, tablet, and desktop viewports
- On smaller screens, consider a more compact layout
- Ensure touch targets are appropriately sized for mobile interactions
- Use Tailwind CSS breakpoints for responsive design

## Technical Requirements

### Component Structure

```
/pages
  /TaskList
    /components
      TaskItem.tsx              # Component for individual task item
      TaskItem.test.tsx         # Unit test for TaskItem
      TaskList.tsx              # Component for the list container
      TaskList.test.tsx         # Unit test for TaskList
    /hooks
      useGetTasks.ts            # Hook for fetching tasks
      useGetTasks.test.ts       # Unit test for useGetTasks
    TaskListPage.tsx            # Main page component
    TaskListPage.test.tsx       # Unit test for TaskListPage
```

### Data Model

```typescript
interface Task {
  id: string;
  title: string;
  detail?: string;
  isComplete: boolean;
  dueAt?: string; // ISO 8601 format
}
```

### Environment Variables

- Store environment variables in a **.env** file
- Environment variables should use appropriate naming convention
- Use an environment variable for the API base URL (VITE_API_BASE_URL)

### Tests

- Unit tests for all components and hooks
- Test loading, empty, error, and populated states
- Test sorting logic
- Test responsive behavior
- Use **Mock Service Worker (`msw`)** to mock API endpoint behavior for unit tests

## Design Considerations

- Use shadcn/ui components where appropriate
- Consider accessibility for all UI states
- Ensure keyboard navigation works properly
- Implement proper focus management

## Acceptance Criteria

1. Task List page is set as the default route
2. Loading state is shown while fetching tasks
3. Empty state alert is shown when no tasks exist
4. Error state alert is shown when API request fails
5. Tasks are displayed in a list when available
6. Tasks are sorted by due date (ascending)
7. Tasks without due dates appear after tasks with due dates
8. Overdue tasks have a visual indicator
9. Completed tasks are visually distinguished
10. The list is responsive across all viewport sizes
11. All unit tests pass

## Future Enhancements (Not in current scope)

- Filtering tasks by status (completed/incomplete)
- Searching tasks by title or description
- Pagination for large task lists
- Task creation directly from the list page
