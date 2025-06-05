# Requirement: Dark Mode

## Overview

We need to implement a dark mode feature for our React Vite application using shadcn/ui components. This will enhance user experience by allowing users to switch between light, dark, and system themes.

---

## Requirements

### 1. Theme Provider Component

- Create a `ThemeProvider` component in `src/common/providers/ThemeProvider.tsx`
- The provider should:
  - Manage theme state (light, dark, system)
  - Store user preference in localStorage
  - Apply the appropriate CSS classes to the document
  - Expose a context API for theme control

### 2. Theme Toggle Component

- Create a `ThemeToggle` component in `src/common/components/ThemeToggle/ThemeToggle.tsx`
- The toggle should:
  - Display sun/moon icons that transition based on the current theme
  - Provide a button which toggles between Light and Dark themes
  - Use the `Button` component from shadcn/ui

### 3. Application Integration

- Wrap the application in the `ThemeProvider` in `App.tsx`
- Add the `ThemeToggle` component to the application header

### 4. Styling Requirements

- Ensure all components respond appropriately to theme changes
- Use Tailwind's dark mode classes (`dark:*`) for styling variations
- Implement smooth transitions when switching themes

### 5. Testing

- Add unit tests for the `ThemeProvider` component
- Verify theme persistence across page refreshes
- Test system theme detection
- Add unit tests for the `ThemeToggle` component

---

## Implementation Notes

- Use React Context API for theme state management
- Leverage localStorage for persistence with the key "task-ui-theme"
- Apply CSS classes to the document root element
- Follow the implementation pattern from shadcn/ui documentation

---

## Dependencies

- shadcn/ui components (Button)
- Lucide React for icons (Sun, Moon)

---

## Acceptance Criteria

- Users can switch between light and dark themes
- Theme preference persists across sessions
- Theme automatically matches system preference when set to "system"
- All UI components respond appropriately to theme changes
- Smooth visual transitions between themes
