# Requirement: Task List Filter Buttons

## Overview

Add filter buttons to the existing task filter bar to allow users to quickly filter tasks by their completion and due date status. The filters will include options for showing "Complete", "Incomplete", and "Overdue" tasks.

## Requirements

### Functional Requirements

1. Add three toggle buttons to the task filter bar:

- **Complete**: Show only completed tasks
- **Incomplete**: Show only incomplete tasks
- **Overdue**: Show only tasks past their due date

2. Button Behavior:

- Buttons should function as toggles (on/off state)
- Multiple filters can be active simultaneously (e.g., show incomplete AND overdue tasks)
- When no filters are active, all tasks should be displayed
- When a filter is active, the button should have a visual indicator of its "selected" state

3. Filter Logic:

- **Complete**: Tasks where `isComplete === true`
- **Incomplete**: Tasks where `isComplete === false`
- **Overdue**: Tasks where `dueDate < currentDate` and `isComplete === false`

4. Filters should combine with existing search functionality:

- If a user has entered search text, the filters should apply only to the tasks that match the search text
- When filters are applied, they should narrow down the current search results

### UI/UX Requirements

1. Button Design:

- Use existing `Button` component from shadcn/ui
- Apply consistent styling with the existing task filter bar
- Use appropriate variant (outline when inactive, default/filled when active)
- Include appropriate icons from Lucide React:
  - Complete: `CheckCircle` or similar
  - Incomplete: `Circle` or similar
  - Overdue: `Clock` or similar

2. Layout:

- Add buttons to the existing filter bar, after the search input
- Ensure responsive design (buttons stack appropriately on smaller screens)
- Add appropriate spacing between buttons

### Technical Requirements

1. State Management:

- Use the `useFilterTasks` hook, extending it to support the new filter parameters
- Filter state should be maintained when navigating away and returning to the task list

2. Performance:

- Filtering should happen on the client side for immediate feedback
- Consider debouncing if filter toggling causes performance issues

3. Testing:

- Add unit tests for the filter logic
- Add component tests for the filter buttons
- Update existing tests to account for the new filtering capabilities

## Acceptance Criteria

1. Users can toggle each filter independently
2. Filter state is visually indicated
3. Task list updates immediately when filters are toggled
4. Multiple filters work correctly in combination
5. Filters work correctly with existing search functionality
6. UI is responsive and consistent with existing design
7. All tests pass

## Mockup

```
+------------------------------------------------+
|                  Task List                      |
+------------------------------------------------+
| [Search tasks...]  [Complete] [Incomplete] [Overdue] |
+------------------------------------------------+
| Task 1                                  [Edit] |
| Task 2                                  [Edit] |
| ...                                            |
+------------------------------------------------+
```

## Implementation Notes

- Update the `TaskFilterBar` component to include the new filter buttons
- Extend the `useFilterTasks` hook to support filtering by completion status and due date
- Consider adding a `FilterButton` component that encapsulates the toggle behavior
