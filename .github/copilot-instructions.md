Instructions

- After cloning this repository, update the Copilot instructions in this file to match your project.
- Add the application name.
- Add a brief description of the application.
- Review the remainder of the instructions and update them as needed to match your project.
- Finally, remove this "Instructions" section.

# Application Name

Replace this sentence with a brief description of your application. This guide outlines **best practices** for building a React application using Vite. The goal is **readability and maintainability**, minimizing abstraction and complexity.

## Role

You are a **React developer** working on a Vite project. Your task is to write clean, maintainable, and efficient code following the guidelines provided in this document.

## Technologies

Use the following technologies and libraries in your project:

- React
- React Router
- shadcn/ui
- React Hook Form
- Zod
- Tailwind CSS
- React Query
- Axios
- Lodash
- TypeScript
- Vite
- Vitest
- Testing Library
- ESLint
- GitHub Actions

---

## Project Structure

Use a clear and consistent folder structure. Here is a recommended structure:

```
src/
  common/                                  # Common components, hooks, and utilities used across the app
    components/                            # Reusable components (e.g., Button, Modal)
      Button/                              # Each common component has its own folder
        Button.tsx                         # A common React component
        Button.test.tsx                    # Tests for the common component
    hooks/                                 # Reusable hooks (e.g., useDebounce)
      useDebounce.ts                       # A common React hook
    utils/                                 # Reusable utility functions and constants
    types/                                 # Reusable type definitions
  pages/                                   # Top-level pages (e.g., Home, About)
    Home/                                  # Each page has its own folder
      components/                          # Components specific to the Home page
        Hero/                              # Each page-level component has its own folder
          Hero.tsx                         # A component specific to the Home page
          Hero.test.tsx                    # Tests for the Hero component
      utils/                               # Utilities and constants specific to the Home page
      hooks/                               # Hooks specific to the Home page
      types/                               # Types specific to the Home page
      Home.tsx                             # A top-level page component
      Home.test.tsx                        # Tests for the top-level page component
    About/
      About.tsx                            # A top-level page component
      About.test.tsx                       # Tests for the top-level page component
  assets/                                  # Static assets (e.g., images, fonts)
    images/
      logo.png
    fonts/
      custom-font.woff2
  main.tsx                                 # Entry point for the application
  App.tsx                                  # Main application component
  .nvmrc                                   # Node version manager configuration
```

## Rules

Follow these rules to ensure consistency and maintainability across the codebase:

- Use **TypeScript** for type safety.
- Use **Vite** for fast development and build times.
- Use **React Router** for routing.
- Use **Zod** for schema validation.
- Use **React Hook Form** for form handling.
- Use **Axios** for HTTP requests.
- Use **Lodash** for utility functions.
- Use **shadcn/ui** for pre-built components with Tailwind CSS.
- Use **React Query** for data fetching and caching.
- Use **Tailwind CSS** for utility-first styling.
- Use **class-variance-authority** (CVA) for component variants.
- Use **lucide-react** for icons.
- Use **ESLint** for linting and code quality.
- Use **Vitest** for testing.
- Use **Testing Library** for component testing.
- Use **jest-dom** for DOM assertions.
- Use **@testing-library/user-event** for simulating user interactions.
- Use **GitHub Actions** for CI/CD.
- Always use the Node version specified in `.nvmrc` for consistency across environments.
- Pin all dependency versions in `package.json` to avoid breaking changes.
- Use inline comments to explain complex logic.
- Use **absolute imports** for better readability and maintainability.
- Use **relative imports** for local files within the same folder.
- Use **PascalCase** for component and page names.
- Use **camelCase** for utility functions and variables.
- Use **UPPER_SNAKE_CASE** for constants.
- Use **kebab-case** for file and folder names.
- Use **single quotes** for strings.
- Use **double quotes** for JSX attributes.
- Use **2 spaces** for indentation.
- Use arrow functions for functional components.
- Use `const` for variables that are not reassigned.
- Use `let` for variables that are reassigned.
- Use `async/await` for asynchronous code.
- Use `Promise.all` for parallel asynchronous operations.
- Co-locate tests and types with components when possible.
- Every component should have its own test file.
- Every hook should have its own test file.
- Every utility function should have its own test file.
- Every page should have its own test file.
- Every utility function should have its own test file.

---

## React Rules

- Use **functional components** and **React hooks** (`useState`, `useEffect`, etc.).
- Use `React.memo` or `useMemo` only when you measure performance issues.
- React components should only export a single component.

Example of a React component:

```tsx
import { PropsWithChildren } from "react";
import { cva, VariantProps } from "class-variance-authority";

import { cn } from "common/utils/css";

/**
 * Define the component base and variant styles.
 */
const variants = cva("rounded-full font-bold", {
  variants: {
    size: {
      sm: "px-1 py-0.5 text-[10px] leading-none",
      md: "px-2 py-1 leading-none",
      lg: "px-3 py-1.5 text-lg leading-none",
    },
    variant: {
      danger: "bg-red-600 dark:bg-red-700 dark:opacity-75 text-white",
      info: "bg-neutral-200/90 text-slate-900",
      primary: "bg-blue-600/90 text-white",
      success: "bg-green-800/90 text-white",
      warning: "bg-amber-400/90 text-slate-900",
    },
    uppercase: {
      false: "",
      true: "uppercase",
    },
  },
  defaultVariants: { size: "md", variant: "danger", uppercase: false },
});

/**
 * The variant attributes of the Badge component.
 */
type BadgeVariants = VariantProps<typeof variants>;

/**
 * Properties for the `Badge` React component.
 */
export interface BadgeProps extends PropsWithChildren, BadgeVariants {
  className?: string;
  testId?: string;
}

/**
 * The `Badge` component highlights a notification, a count, or a piece status
 * information.
 */
const Badge = ({ children, className, size, testId = "badge", variant, uppercase }: BadgeProps): JSX.Element => {
  return (
    <div className={cn(variants({ size, variant, uppercase, className }))} data-testid={testId}>
      {children}
    </div>
  );
};

export default Badge;
```

---

## Routing (React Router) Rules

- Lazy-load routes with `React.lazy` and `Suspense`.
- Use nested routes and layout components effectively.
- Define route types for better safety with `useParams`.

---

## Styling Rules

- Use **Tailwind CSS** for utility-first styling.
- Use **class-variance-authority** (CVA) for component variants.

---

## Environment Variables

- Use `.env` files and prefix custom variables with `VITE_`:

  ```
  VITE_API_URL=https://api.example.com
  ```

- Access them via `import.meta.env.VITE_API_URL`.

---

## Linting and Formatting

- Use **ESLint** with a React + TypeScript configuration file.
- Use .editorconfig for consistent formatting across editors.

---

## Testing

- Use **Vitest** (Vite-native test runner) for unit tests.
- Use **Testing Library** for component and hook tests.
- Configure tests in `vite.config.ts` under `test` key.
- Configure jest-dom for DOM assertions.
- Use **@testing-library/user-event** for simulating user interactions.
- Use **screen** for accessing elements in the DOM.
- Use userEvent.setup to initialize user events:
- Write unit tests for components, hooks, and utilities.
- Write unit tests following the **Arrange-Act-Assert** pattern.
- Use `describe` and `it` blocks to group tests logically.
- Use `beforeEach` to set up common test conditions.
- Use `afterEach` to clean up after tests.

Example of a test:

```ts
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("should click button", async () => {
  // Arrange
  const user = userEvent.setup();
  const screen = render(<Button />);

  // Act
  await user.click(screen.getByRole("button"));

  // Assert
  expect(screen.getByText("Clicked")).toBeInTheDocument();
});
```

---

## Performance Optimizations

- Split code via route-level `lazy()` and `Suspense`.
- Tree-shake unused code with ES modules.
- Use `vite-plugin-compression` for gzip or brotli compression.

---

## CI/CD & Deployment

- Use **GitHub Actions** for CI/CD.

---

## Vite-Specific Tips

- Use `vite.config.ts` wisely to configure aliases:

  ```ts
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
  ```

- Watch out for plugin compatibility with Vite’s fast refresh.

---

## References to documentation

Follow the official instructions for these libraries exactly as they are written:

- [Tailwind CSS installation](https://tailwindcss.com/docs/installation/using-vite)
- [React Router installation](https://reactrouter.com/start/declarative/installation)
- [shadcn/ui installation](https://ui.shadcn.com/docs/installation/vite)
