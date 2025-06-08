# Requirement: Task List Search Filter

## Overview

This document outlines the requirements for implementing a filtering functionality for the Task List component, allowing users to filter tasks based on input criteria.

## User Story

As a user, I want to filter the list of tasks by entering text criteria so that I can quickly find relevant tasks.

## Functional Requirements

### Filter Input

1. Add a filter input field in a styled bar above the list of tasks
2. The input should include a clear button (X) that appears when text is entered
3. The clear button should reset the filter when clicked

### Filtering Logic

1. Filter tasks based on matching text in the "title" or "detail" fields
2. The filter should be case-insensitive
3. The list should update automatically as the user types
4. Use debouncing to prevent excessive updates during rapid typing

### UI Indicators

1. Display a count showing "X of Y items" where:

- X = number of filtered/displayed items
- Y = total number of items

2. This count should appear near the filter input

## Technical Implementation

### Component Structure

```
/pages
  /TaskList
   /components
    TaskFilterBar.tsx           # New component for filter input and count
    TaskFilterBar.test.tsx      # Unit test for filter component
   /hooks
    useFilterTasks.ts           # New hook for filtering logic
    useFilterTasks.test.ts      # Unit test for filter hook
```

### State Management

- Use React state to manage the filter text
- Implement filtering logic in a custom hook that:
  - Takes the full list of tasks and filter text as inputs
  - Returns the filtered list of tasks
  - Handles debouncing of filter operations

### UI Components

- Use shadcn/ui components:
  - `Input` for the filter field
  - `Button` for the clear functionality
- Style the filter bar using Tailwind CSS

## Acceptance Criteria

- [ ] Filter input appears in a styled bar above the task list
- [ ] Input includes a clear button that appears when text is entered
- [ ] List filters in real-time as the user types
- [ ] Both task title and detail fields are searched for matches
- [ ] Count of filtered items vs. total items is displayed
- [ ] Filter is case-insensitive
- [ ] Clearing the filter shows all tasks again
- [ ] Keyboard interaction and accessibility features work correctly

## Design Mock

```
┌─────────────────────────────────────────────────────────┐
│ Filter: [_____________________] [X]   12 of 25 items    │
├─────────────────────────────────────────────────────────┤
│ Task Item 1                                             │
│ Task Item 2                                             │
│ ...                                                     │
└─────────────────────────────────────────────────────────┘
```

## Testing Considerations

- Test filtering with various inputs including partial matches
- Test clear button functionality
- Test debounce behavior with rapid typing
- Test edge cases (empty list, all items filtered out)
- Test accessibility for keyboard and screen reader users
