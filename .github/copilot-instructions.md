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

## Language & Stack

- **Language:** TypeScript
- **Vite** for fast dev/build tooling
- **Tanstack Query (React Query)** for remote data management
- **Axios** for HTTP requests
- **React Hook Form** for form state
- **Zod** for schema validation and type inference
- **@hookform/resolvers** for integrating Zod with React Hook Form
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for prebuilt UI components
- **clsx** and **class-variance-authority** for conditional class names
- **Lucide React** for icons
- **Radix UI** for accessible UI primitives
- **Lodash** for utility functions
- **Vitest** for unit testing
- **@testing-library/react** for testing React components
- **jsdom** for simulating a browser environment in tests
- **IaC Deployment** using **AWS CDK** for infrastructure as code (`cdk deploy`)
- **Package Manager:** npm

---

## Coding Guidelines

- Use **TypeScript** for all source and infrastructure code.
- Prefer arrow functions for components and hooks.
- Split code via route-level `lazy()` and `Suspense` for code splitting.
- Extract Axios instance config to `src/common/utils/axios.ts`
- Apply base styles in `src/index.css`
- Use **.env** for environment variables prefixed with `VITE_` for Vite compatibility.
- Use JSDoc comments for public APIs and complex logic.

---

## Project Structure

This project follows a structure that separates application-wide **common** components, hooks, and utils from page-level components, hooks, and utils with co-located tests. This promotes modularity and maintainability.

```
src
  /common
    /components
      /ui                         # shadcn/ui components
        Button.tsx                # Reusable button component
        Input.tsx                 # Reusable input component
        Label.tsx                 # Reusable label component
      /Header
        Header.tsx                # Application header component
        Header.test.tsx           # Unit test for Header
      /Router
        Router.tsx                # Application router component
        Router.test.tsx           # Unit test for Router
    /models
      Task.ts                     # Type definitions for Task model
    /providers
      ThemeProvider.tsx           # Theme provider for styling
      ThemeProvider.test.tsx      # Unit test for ThemeProvider
    /hooks
      useDebounce.ts              # Custom hook for debouncing values
      useDebounce.test.ts         # Unit test for useDebounce
    /utils
      api.ts                      # Axios instance and API utilities
      constants.ts                # Shared constants
  /pages
    /TaskList
      /components
        TaskItem.tsx              # Component for individual task item
        TaskItem.test.tsx         # Unit test for TaskItem
      /hooks
        useGetTasks.ts            # Hook for fetching tasks specific to TaskList
        useGetTasks.test.ts       # Unit test for useGetTasks in TaskList
      TaskListPage.tsx            # Page component for listing tasks
      TaskListPage.test.tsx       # Unit test for TaskListPage
  App.tsx                         # Main application component
  App.test.tsx                    # Unit test for App
  main.tsx                        # Application entry point
  index.css                       # Global styles (Tailwind CSS)

/infrastructure
  /stacks
    ApiStack.ts             # CDK stack for REST API + Lambdas
  app.ts                    # CDK app entry point

cdk.json                    # CDK config
tsconfig.json               # TypeScript config
vite.config.ts              # Vite config
eslint.config.js            # ESLint config
components.json             # shadcn/ui components config
.nvmrc                      # npm config for package management
package.json                # Project dependencies and scripts
.env                        # Environment variables
```

---

## React Component Guidelines

### File: `MyComponent.tsx`

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/common/components/ui/input';
import { Button } from '@/common/components/ui/button';
import { Label } from '@/common/components/ui/label';

const myComponentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
});

type FormData = z.infer<typeof myComponentSchema>;

export const MyComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(myComponentSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register('name')} placeholder="Enter your name" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <Button type="submit">Submit</Button>
    </form>
  );
};
```

---

## API Integration with Axios and React Query

### File: `useGetTask.ts`

```ts
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

export const api = axios.create({
  baseURL: 'https://api.example.com',
});

export function useTask(id: string) {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: async () => {
      const { data } = await api.get(`/tasks/${id}`);
      return data;
    },
  });
}
```

---

## Testing with Vitest

- Use **Vitest**.
- Place test files next to the source file, with `.test.ts` suffix.
- Use `describe` and `it` blocks for organization.
- Mock dependencies using `vi.mock` or similar.
- Use `beforeEach` for setup and `afterEach` for cleanup.
- Use `expect` assertions for results.
- Use Arrange - Act - Assert (AAA) pattern for test structure:
  - **Arrange:** Set up the test environment and inputs.
  - **Act:** Call the function being tested.
  - **Assert:** Verify the output and side effects.
- Use **msw** to mock API calls in tests.
- Prefer unit tests over integration tests in this repo.

### File: `MyComponent.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders input field and button', async () => {
    // Arrange
    const user = userEvent.setup();
    const screen = render(<MyComponent />);

    // Act
    const button = screen.getByRole('button', { name: /submit/i });
    user.click(button);

    // Assert
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });
});
```

Add to `vite.config.ts`:

```ts
test: {
  globals: true,
  environment: "jsdom"
}
```

---

## UI Component Setup (shadcn/ui)

After installing shadcn/ui:

- Reusable UI components like `<Button />`, `<Input />`, `<Label />` live in `src/common/components/ui/`
- You can override and customize each component’s styles with Tailwind and variants
- Recommended: use the CLI to scaffold new components:

  ```bash
  npx shadcn-ui@latest add button input label
  ```

---

## AWS CDK Guidelines

- Define one CDK stack per major grouping of resources (e.g., S3 bucket, CloudFront Distribution).

### Example: S3 Bucket and CloudFront Distribution

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
