# Requirement: Task List Search

## Overview

The Task List Search feature enables users to quickly find specific tasks by filtering the task list based on search text. This feature improves usability by allowing users to narrow down large task lists to find relevant items without manual scanning.

## Requirements

### Functional Requirements

1. Provide a search input field that filters tasks in real-time
2. Filter tasks based on text matches in both title and detail fields
3. Implement case-insensitive filtering
4. Display the count of filtered items versus total items
5. Include a clear button to reset the filter
6. Apply debounce to prevent excessive filtering during rapid typing

### Technical Requirements

1. Create a new `TaskFilterBar` component in the TaskList page structure
2. Implement a custom `useFilterTasks` hook for filtering logic
3. Use React state to manage the filter text
4. Integrate with the existing task list display logic
5. Include appropriate unit tests for all new components and hooks

## User Experience / Design

### UI Components

- Search bar positioned above the task list
- Ensure responsive design (search bar elements stack on smaller screens)
- Clear button (X) that appears when text is entered
- Counter showing "X of Y items" next to the search field
- Real-time filtering as the user types
- Visual feedback when no matches are found

### Implementation Details

- Use shadcn/ui components:
  - `Input` for the filter field
  - `Button` for the clear functionality
- Style with Tailwind CSS for consistent appearance
- Apply debounce timing of 300ms for optimal typing experience
- Ensure keyboard navigation works properly throughout the filter process

## Acceptance Criteria

- Search input field renders in a styled bar above the task list
- Clear button (X) appears when text is entered and clears the filter when clicked
- Task list updates automatically as the user types with appropriate debouncing
- Filtering matches against both task title and detail fields
- Filtering is case-insensitive
- Count indicator shows "X of Y items" and updates as filtering occurs
- All tasks are displayed when filter is cleared
- Component passes accessibility tests for keyboard and screen reader users
- Unit tests verify filtering logic, UI behavior, and edge cases
- Performance remains smooth when filtering large task lists
