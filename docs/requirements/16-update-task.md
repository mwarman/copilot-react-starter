# Requirement: Update a Task

## Overview

The Task Update feature allows users to modify existing tasks through a dedicated form page. Users can edit properties including title, details, due date, and completion status. This feature ensures users can keep their task information current and relevant.

## Requirements

1. Provide a form interface for editing task properties
2. Pre-populate form with existing task data
3. Validate user input before submission
4. Submit changes to the backend API
5. Handle success and error states appropriately
6. Return user to their previous location after successful update
7. Provide clear feedback during the update process

## User Experience / Design

### Form Components

- **Title** - Text input field (required)
- **Detail** - Text area for longer descriptions
- **Due Date** - Date picker for selecting deadline
- **Completion Status** - Checkbox to mark task as complete

### Interaction States

- **Initial Load** - Form displays with current task values
- **Validation** - Show inline errors for invalid inputs
- **Loading** - Disable form controls during submission with visual indicator
- **Success** - Display confirmation message before navigation
- **Error** - Show appropriate error message with recovery options

## Navigation

- **Access Points**:
  - Edit button on Task List page
  - Edit button on Task Detail page in the actions bar area
- **Route**: `/tasks/:taskId/edit`
- **Post-Update Navigation**:
  - Return to originating page (Task List or Task Detail)
  - Track previous location to enable proper return navigation

## API Integration

- Handle optimistic updates for immediate UI feedback

### Endpoint

- **Method**: PUT
- **URL**: `/tasks/:taskId`

### Request Body

```json
{
  "title": "string",
  "detail": "string",
  "dueAt": "YYYY-MM-DDTHH:mm:ssZ",
  "isComplete": boolean
}
```

### Response Handling

- **200 OK**: Successful update - navigate back to previous page
- **400 Bad Request**: Validation error - display specific validation messages
- **404 Not Found**: Task doesn't exist - show appropriate message
- **Other errors**: Display generic error message with retry option

## Acceptance Criteria

1. **Data Loading**

   - User can navigate to the Update Task page from Task List or Task Detail
   - Form loads with fields pre-populated with current task data

2. **Form Validation**

   - Title field is required and validated
   - Due date must be in valid format
   - Form prevents submission with validation errors

3. **Update Process**

   - Form submission shows loading state
   - All form controls are disabled during submission
   - Successful updates return user to previous page
   - Error states provide clear feedback with recovery options

4. **Accessibility**
   - Form is fully keyboard navigable
   - ARIA attributes present for screen readers
   - Focus management maintained during form submission
   - Color contrast meets WCAG AA standards
