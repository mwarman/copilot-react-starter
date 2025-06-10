# Requirement: Update a Task

## Overview

This document outlines the requirements for the Task Update feature. Users will be able to edit existing tasks through a dedicated form page, modifying properties such as title, details, due date, and completion status.

## User Interface

### Update Task Page

- Create a dedicated page at route `/tasks/:taskId/edit`
- Include a form with the following fields:
  - Title (text input)
  - Detail (text area)
  - Due Date (date picker)
  - Completion Status (checkbox)
- Display current task values in form fields when the page loads
- Include action buttons:
  - Save/Update button (primary)
  - Cancel button (returns to previous page)
- Show loading state during form submission
- Display validation errors inline with form fields

## Functionality

### Navigation

- Access the Update Task page from:
  - Task List page (via edit button on each task)
  - Task Detail page (via edit button)
- After successful update, return user to the page they were previously on (Task List or Task Detail)
- Track previous location to enable proper navigation after successful update

### Data Flow

1. On page load, fetch current task data using the task ID from the URL (useGetTask)
2. Populate form fields with current task data
3. When form is submitted:
   - Validate form input on client side
   - Disable all form controls during submission
   - Display loading indicator during API call
   - Call the Update Task API endpoint (PUT `/tasks/:taskId`)

### API Integration

- Endpoint: `PUT /tasks/:taskId`
- Request body format:
  ```json
  {
    "title": "string",
    "detail": "string",
    "dueAt": "YYYY-MM-DDTHH:mm:ssZ",
    "isComplete": boolean
  }
  ```
- Handle response codes:
  - 200: Success - navigate back to previous page
  - 400: Validation Error - display error message to user
  - 404: Not Found - display error message that task doesn't exist
  - Other errors: Display generic error message

## User Experience

### Loading States

- Disable all form controls during API calls
- Display a loading spinner or message during submission
- Return controls to enabled state after API response

### Error Handling

- Display validation errors below respective form fields
- Show an error alert at the top of the form for API errors
- Include retry capability for network errors

### Accessibility

- Ensure form is fully keyboard navigable
- Include proper ARIA attributes for screen readers
- Maintain focus management during form submission and error states

## Dependencies

- React Router for navigation
- React Hook Form for form state management
- Zod for validation
- React Query for API integration
- shadcn/ui components for UI elements
