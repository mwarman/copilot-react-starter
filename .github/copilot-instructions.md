# Copilot Instructions for a React Frontend Component (Vite + TypeScript)

This guide provides instructions for using **GitHub Copilot** and onboarding developers working on this React front end project written in **TypeScript** with the **Vite** framework and **Vitest co-located unit tests**, and using the **AWS CDK** for infrastructure as code.

---

## Role

You are a **Senior TypeScript developer** working on a React front end project. Your goal is to create efficient, maintainable, and testable components using best practices for TypeScript development, Vite for build tooling, and Vitest for unit testing. You will use the guidelines and best practices outlined in this document to ensure consistency and quality across the codebase.

---

## Project Overview

- **Component:** Task UI (task-ui)
- **Description:** This component provides a user interface for managing tasks, including creating, retrieving, updating, and deleting tasks. It uses React for the frontend, with state management handled by React Query and form validation managed by React Hook Form and Zod. The project follows best practices for TypeScript development, Vite for build tooling, and unit testing with Vitest.

---

## Technology Stack

### Primary Technologies

- **Language:** TypeScript
- **React** for building user interfaces
- **React Router** for routing
- **Vite** as the build tool and development server

### Forms and Validation

- **React Hook Form** for form state
- **Zod** for schema validation and type inference
- **@hookform/resolvers** for integrating Zod with React Hook Form

### State Management and Data Fetching

- **Tanstack Query (React Query)** for remote data management
- **Axios** for HTTP requests

### UI and Styling

- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for reusable UI components
- **Radix UI** for accessible UI primitives
- **clsx** and **class-variance-authority** for conditional class names
- **Lucide React** for icons

### Utilities

- **Lodash** for utility functions
- **date-fns** for date manipulation

### Testing

- **Vitest** for unit testing
- **Vitest V8** for code coverage
- **@testing-library/react** for testing React components

### Development Tools

- **ESLint** for linting TypeScript code
- **Prettier** for code formatting
- **npm** for package management
- **nvm** for Node.js version management

### Infrastructure

- **AWS CDK** for defining cloud infrastructure as code
- **GitHub Actions** for CI/CD workflows

---

## Project Structure

This project follows a structure that separates application-wide **common** components, hooks, and utils from **feature-level** components, hooks, and utils with co-located tests. This promotes modularity and maintainability.

```
src
  /common
    /components
      /ui                               # shadcn/ui components
        button.tsx                      # Reusable button component from shadcn/ui
        input.tsx                       # Reusable input component from shadcn/ui
        label.tsx                       # Reusable label component from shadcn/ui
      /Header
        Header.tsx                      # Application header component
        Header.test.tsx                 # Unit test for Header
      /Router
        Router.tsx                      # Application router component
        Router.test.tsx                 # Unit test for Router
    /models
      Team.ts                           # Type definitions Team
    /providers
      ThemeProvider.tsx                 # Theme provider for styling
      ThemeProvider.test.tsx            # Unit test for ThemeProvider
    /hooks
      useDebounce.ts                    # Custom hook for debouncing values
      useDebounce.test.ts               # Unit test for useDebounce
    /utils
      api.ts                            # Axios instance and API utilities
      config.ts                         # Application configuration
      constants.ts                      # Shared constants
  /features                             # Feature-specific components, hooks, and utils
    /task                               # Task feature
      /components                       # Shared components related to tasks
        TaskListItem.tsx                # Component for individual task item
        TaskListItem.test.tsx           # Unit test for TaskListItem
      /create                           # Components and hooks for creating tasks
        CreateTask.tsx                  # Component for creating a new task
        CreateTask.test.tsx             # Unit test for CreateTask
      /delete
        DeleteTask.tsx                  # Component for deleting a task
        DeleteTask.test.tsx             # Unit test for DeleteTask
      /hooks
        useGetTasks.ts                  # Hook for fetching tasks
        useGetTasks.test.ts             # Unit test for useGetTasks
      /update
        UpdateTask.tsx                  # Component for updating a task
        UpdateTask.test.tsx             # Unit test for UpdateTask
      /utils
        taskUtils.ts                    # Utility functions for task logic
        taskUtils.test.ts               # Unit test for taskUtils
      TaskListPage.tsx                  # Page component for displaying tasks
      TaskListPage.test.tsx             # Unit test for TaskListPage
  /test
    /test-utils.tsx                     # Common test utilities and setup
    /setup.ts                           # Test setup file for Vitest
  App.tsx                               # Main application component
  App.test.tsx                          # Unit test for App
  main.tsx                              # Application entry point
  index.css                             # Global styles (Tailwind CSS)

/infrastructure
  /stacks
    cdnStack.ts                         # AWS CDK stack for CDN resources
  app.ts                                # AWS CDK app entry point
  cdk.json                              # AWS CDK configuration
  tsconfig.json                         # TypeScript configuration for AWS CDK
  package.json                          # Dependencies and scripts for AWS CDK infrastructure

.editorconfig                           # Editor configuration for consistent coding style
.env                                    # Environment variables
.nvmrc                                  # npm config for package management
.prettierrc                             # Prettier configuration
tsconfig.json                           # Main project TypeScript config
vite.config.ts                          # Vite config
eslint.config.js                        # ESLint config
components.json                         # shadcn/ui components config
package.json                            # Project dependencies and scripts
```

---

## Development Guidelines

### TypeScript Development

- Use **TypeScript** for all source code.
- Use **strict mode** in `tsconfig.json` for type safety.
- Use **interfaces** for defining types, especially for props and state.
- Use **type aliases** for utility types and complex types.
- Use **enums** for fixed sets of values.
- Use **destructuring** for props and state in components.
- Use **async/await** for asynchronous operations.
- Use **optional chaining** and **nullish coalescing** for safer property access.
- Use **type guards** for narrowing types.
- Use **generics** for reusable components and functions.
- Use **type assertions** sparingly and only when necessary.
- Use **type inference** where possible to reduce redundancy.
- Use **type-safe imports** to ensure correct types are used.
- Use **ESLint** with TypeScript rules for linting.
- Use **Prettier** for code formatting.
- Do not use barrel files (index.ts).

### React Component Development

- Use **functional components** with hooks.
- Return **JSX.Element** or **false** from components.
- Use arrow functions for components.
- Use default exports for components.
- Use the `data-testid` attribute to assist with testing.
- Use a **testId** prop for components that need to be tested, defaulting to the component name in kebab-case.

#### Example Component

```tsx
import React from 'react';
import { Button } from '@/common/components/ui/button';

interface ExampleComponentProps {
  testId?: string; // Optional prop for testing
}

const ExampleComponent = ({ testId = 'example-component' }: ExampleComponentProps): JSX.Element => {
  return (
    <div data-testid={testId}>
      <h1>Hello World</h1>
      <Button>Click Me</Button>
    </div>
  );
};

export default ExampleComponent;
```

### Performance and Optimization

- Split code via route-level `lazy()` and `Suspense` for code splitting.

### Styling Guidelines

- Use **Tailwind CSS** for styling.
- Apply base styles in `src/index.css`
- Use CSS variables for theming (index.css).

### Configuration

- Use **.env** for environment variables prefixed with `VITE_` for Vite compatibility.
- Do not commit `.env` files; use `.env.example` to document required variables.

### Maintainability

- Keep components small and focused on a single responsibility.
- Use comments to explain complex logic, but avoid obvious comments.
- Organize imports logically: external libraries first, then internal components, hooks, and utils.

---

## Testing Guidelines

- Use **Vitest**.
- Place test files next to the source file, with `.test.ts{x}` suffix.
- Use Arrange - Act - Assert (AAA) pattern for test structure:
  - **Arrange:** Set up the test environment and inputs.
  - **Act:** Call the function being tested.
  - **Assert:** Verify the output and side effects.
- Use `src/test/test-utils.tsx` for common test functions and helpers.
- Use `describe` and `it` blocks for organization.
- Mock dependencies using `vi.mock` or similar.
- Use `beforeEach` for setup and `afterEach` for cleanup as needed.
- Use `expect` assertions for results.
- Use the `data-testid` attribute for selecting elements in tests.
- Use `screen` from `@testing-library/react` for querying elements.
- Use `userEvent` from `@testing-library/user-event` for simulating user interactions.
- Prefer unit tests over integration tests in this repo.
- 80% code coverage is the minimum requirement for all components and features.

---

## UI Component Setup (shadcn/ui)

After installing shadcn/ui:

- Reusable UI components like `<Button />`, `<Input />`, `<Label />` live in `src/common/components/ui/`
- You can override and customize each component’s styles with Tailwind and variants
- Recommended: use the CLI to scaffold new components:

  ```bash
  npx shadcn@latest add button input label
  ```

---

## AWS CDK Guidelines

- Self-contained infrastructure code in the `infrastructure` directory.
- Define one CDK stack per major grouping of resources (e.g., CDN).
- Use `/infrastructure/.env` for environment variables prefixed with `CDK_`, but avoid committing this file.
- Use Zod for schema validation of configuration values.
- Tag all CDK resources appropriately (`App`, `Env`, `OU`, `Owner`).
- Deploy separate environments (dev/qa/prd) using configuration values.

### Example AWS CDK Stack

```ts
// S3 bucket for the application
const bucket = new s3.Bucket(this, 'CloudFrontSpaBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

// S3 bucket deployment
const deployment = new s3_deployment.BucketDeployment(this, 'CloudFrontSpaDeployment', {
  sources: [s3_deployment.Source.asset('../dist')],
  destinationBucket: bucket,
});

// CloudFront distribution
const distribution = new cloudfront.Distribution(this, 'CloudFrontSpaDistribution', {
  certificate: certificate,
  comment: 'CDK Playground CloudFront SPA',
  defaultBehavior: {
    origin: cloudfront_origins.S3BucketOrigin.withOriginAccessControl(bucket),
    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
  },
  defaultRootObject: 'index.html',
  domainNames: ['cdk-playground.dev.leanstacks.net'],
  errorResponses: [
    {
      httpStatus: 403,
      responsePagePath: '/index.html',
      ttl: cdk.Duration.seconds(0),
      responseHttpStatus: 200,
    },
    {
      httpStatus: 404,
      responsePagePath: '/index.html',
      ttl: cdk.Duration.seconds(0),
      responseHttpStatus: 200,
    },
  ],
  priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
});
```
