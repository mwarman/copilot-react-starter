# Requirement: Create a Task

## Overview

This document outlines the requirements for implementing a task creation feature within the application. Users need to be able to create new tasks by providing a title and optional details through a dedicated form interface. This feature will enable users to track their work items effectively.

## Requirements

### Functional Requirements

1. Create a dedicated page with a form for task creation that includes:

   - Title field (text input, required)
   - Details field (textarea, optional)
   - Due date field (date picker, optional)

2. Implement form validation with Zod:

   - Title: Required with a minimum of 2 characters
   - Details: Optional
   - Due Date: Optional, must be in a valid YYYY-MM-DDTHH:mm:ssZ format

3. Add a submit button to create the task and a cancel button to return to the task list

4. Support optimistic updates to the task list cache when a new task is created, with rollback if a failure occurs

### Technical Requirements

1. Use React Hook Form with Zod validation by following the [shadcn UI form guide](https://ui.shadcn.com/docs/components/form)
2. Utilize shadcn/ui components for all form elements
3. Implement TypeScript typing for all form fields and API responses
4. Create a custom React Query hook for the task creation API call using Axios
5. Reference the **Task** interface
6. Implement proper loading state management and error handling

## User Experience / Design

1. Form Layout and Interaction:

   - Organize form fields in a logical vertical layout
     - title
     - detail
     - due date
     - action buttons: cancel, create task
   - Ensure the form is intuitive and accessible
   - Provide clear labels for each field
   - Display inline validation feedback for each field
   - Automatically focus on the title field when the form loads

2. Error Handling:

   - Show validation errors directly below the respective field
   - Display API errors prominently at the top of the form using a shadcn **Alert**
   - Provide visual indication of form submission status

3. Loading States:
   - Disable all form controls during form submission
   - Show a loading indicator while the form is being submitted
   - Provide immediate feedback upon successful submission

## Navigation

1. Add a "Create Task" button on the task list page that navigates to the task creation form
2. After successful task creation, automatically redirect the user to the task list page
3. Provide a cancel button that returns the user to the page they were viewing when they navigated to the create task page

## API Integration

The form will submit data to the `/tasks` endpoint using a POST request.

Response handling:

- On success (201): Update the task list cache and navigate to the task list page
- On validation error (400): Display validation errors to the user
- On other errors: Display an appropriate error message and roll back updates to the cache

## Acceptance Criteria

- User can navigate to a dedicated "Create Task" page from the task list
- Form includes a required title field with validation (min 2 characters)
- Form includes an optional details field (textarea)
- Form includes an optional due date field (date picker in YYYY-MM-DD format)
- Form performs client-side validation using Zod before submission
- Validation errors are displayed inline with their respective fields
- Form submits to the correct API endpoint (/tasks)
- API errors are displayed prominently to the user
- Loading states are properly indicated during form submission
- On successful task creation, the user is redirected to the task list
- Task list is updated with the newly created task
- User can cancel task creation and return to the task list
- The implementation uses React Hook Form, shadcn/ui components, and React Query

## References

- [shadcn React Hook Form guide](https://ui.shadcn.com/docs/components/form)
- [API Specification](../api-spec.json)
