# Task Hero

A React SPA front end application component for managing tasks like a hero.

## Features

- **React 18** with TypeScript
- **Vite** for fast development and build tooling
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for high-quality UI components
- **Dark Mode** support with system preference detection
- **Vitest** for unit testing
- **ESLint** for code quality

## Dark Mode

The application includes a dark mode feature that allows users to:

- Toggle between light and dark themes
- Automatically detect system preferences
- Persist theme preferences in localStorage

The dark mode implementation is based on Tailwind CSS and uses the following components:

- `ThemeProvider` - Manages theme state and preferences
- `ThemeToggle` - UI component for switching themes
