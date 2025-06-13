# Requirement: Task List Page

## Overview

The Task List page is the primary landing page of the application, displaying all user tasks in a list format. This component allows users to quickly scan their tasks, see completion status, due dates, and identify overdue items at a glance. The page implements proper loading, empty, and error states to enhance user experience.

## Requirements

### Functional Requirements

1. Display a list of all user tasks
2. Sort tasks by:

   1. incomplete tasks with a due date (earliest dates first)
   2. incomplete tasks without due dates
   3. complete tasks

3. Visually distinguish between completed and incomplete tasks
4. Highlight overdue tasks
5. Implement appropriate loading, empty, and error states
6. Ensure responsive design across all device sizes

### Technical Requirements

#### Data Model

```typescript
interface Task {
  id: string;
  title: string;
  detail?: string;
  isComplete: boolean;
  dueAt?: string; // ISO 8601 format, e.g. YYYY-MM-DDTHH:mm:ssZ
}
```

#### Environment Configuration

- API base URL should be configurable via environment variable: `VITE_API_BASE_URL`

#### Testing Requirements

- Unit tests for all components and hooks
- Coverage for all UI states (loading, empty, error, populated)

## User Experience / Design

### UI States

1. **Loading State**

   - Display a skeleton loader while fetching task data
   - Maintain consistent layout to minimize layout shifts

2. **Empty State**

   - Display an Alert component with a friendly message
   - Suggest creating a new task
   - Use appropriate iconography to reinforce the empty state

3. **Error State**

   - Display an Alert component with error details
   - Provide a retry action
   - Use appropriate error iconography

4. **Populated State**
   - Display tasks in a list format with the following information:
     - Completion status indicator (checkbox or icon)
     - Title
     - Detail if available; truncate text as needed
     - Due date (properly formatted)
     - Visual indicator for overdue tasks

### Task Display Logic

- Sort tasks by due date in ascending order
- Place incomplete tasks without due dates after tasks with due dates
- Place complete tasks at the end of the list
- Visually distinguish completed tasks (strikethrough, different background)
- Highlight overdue tasks with warning colors or icons

### Responsive Design

- Implement full responsiveness for mobile, tablet, and desktop
- Adjust layout density based on screen size
- Ensure touch targets are appropriately sized on mobile
- Use Tailwind CSS breakpoints for consistent responsive behavior

## Navigation

- The Task List page should be configured as the default route
- Set up routing to redirect from "/" to "/tasks"
- Use "/tasks" as the route path for the Task List page

## API Integration

The Task List page integrates with the `/tasks` GET endpoint from the API specification:

- **Endpoint**: `/tasks`
- **Method**: GET
- **Response**: 200 OK with JSON array of task objects
- **Implementation**: Use React Query with Axios for data fetching
- **Error Handling**: Handle 4xx/5xx responses appropriately

According to the API spec, the response contains an array of task objects with properties matching our data model.

### Data Fetching Strategy

1. Implement a custom `useGetTasks` hook using React Query
2. Configure appropriate caching and refetching strategies
3. Handle loading, error, and success states within the hook
4. Return the necessary state variables to the component

## Acceptance Criteria

1. Task List page is accessible at both "/" and "/tasks" routes
2. Tasks are fetched from the API using React Query
3. Loading state shows skeleton loaders while data is being fetched
4. Empty state displays an appropriate message when no tasks exist
5. Error state shows an alert with error details when API request fails
6. Tasks are displayed in a list format when available
7. Tasks are sorted by due date (ascending)
8. Tasks without due dates appear after tasks with due dates
9. Overdue tasks have a clear visual indicator
10. Completed tasks are visually distinguished from incomplete tasks
11. The UI is responsive across all viewport sizes
12. All components have corresponding unit tests
13. All tests pass successfully
