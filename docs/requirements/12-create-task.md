# Requirement: Create a Task

## Overview

This document outlines the requirements for creating a new task in the application. The user should be able to enter the task details through a dedicated form page.

## User Story

As a user, I want to create a new task with a title, optional details, and optional due date so that I can track my work items.

## Form Fields

| Field  | Type       | Description                      | Validation                                |
| ------ | ---------- | -------------------------------- | ----------------------------------------- |
| title  | Text Input | Title of the task                | Required, min 2 characters                |
| detail | Textarea   | Detailed description of the task | Optional                                  |
| dueAt  | DatePicker | Due date for the task            | Optional, valid date in YYYY-MM-DD format |

## Requirements

### Functional Requirements

1. Create a dedicated page for the task creation form
2. Form should include the following fields:

- Title (required)
- Detail (optional, textarea)
- Due Date (optional, date picker)

3. Use Zod for form validation:

- Title: Required, minimum 2 characters
- Detail: Optional
- Due Date: Optional, valid date format YYYY-MM-DD

4. Submit the form data to the API endpoint `/tasks` (POST)
5. Handle API responses:

- On success (201): Navigate to the task list page
- On validation error (400): Display validation errors to user
- On other errors: Display appropriate error message

6. Provide a cancel button to return to the task list without creating a task

### Technical Requirements

1. Create form using React Hook Form with Zod validation
2. Use shadcn/ui components for the form elements
3. Implement the form with TypeScript, ensuring type safety
4. Create a custom hook for task creation API call using Axios and React Query
5. Use the Task interface defined in `/src/common/models/Task.ts`
6. Handle loading states and errors appropriately

## API Integration

The form should submit data to the `/tasks` endpoint as specified in the API spec:

```typescript
// Request body
interface CreateTaskRequest {
  title: string;
  detail?: string;
  dueAt?: string; // ISO 8601 date format
}

// Success response (201)
interface CreateTaskResponse {
  id: string;
  title: string;
  isComplete: boolean;
  // Other fields may be included
}

// Error response (400)
interface ErrorResponse {
  message: string;
}
```

## User Experience

1. Form should be intuitive and accessible
2. Validation errors should appear inline with the respective fields
3. API errors should be displayed prominently at the top of the form
4. Loading state should be indicated while the form is being submitted
5. Success navigation should be immediate upon successful creation

## Acceptance Criteria

- [ ] User can navigate to a dedicated "Create Task" page
- [ ] User can enter a task title (required)
- [ ] User can enter optional task details in a textarea
- [ ] User can select an optional due date via a date picker
- [ ] Form validates inputs using Zod before submission
- [ ] Validation errors are displayed appropriately
- [ ] Form submits to the correct API endpoint
- [ ] API errors are displayed to the user
- [ ] On successful task creation, user is redirected to the task list
- [ ] User can cancel task creation and return to the task list
