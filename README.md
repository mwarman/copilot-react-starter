# Task Hero

A React SPA front end application component for managing tasks like a hero.

## Features

- **React 18** with TypeScript
- **Vite** for fast development and build tooling
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for high-quality UI components
- **React Query** for data fetching and state management
- **Dark Mode** support with system preference detection
- **Vitest** for unit testing
- **ESLint** for code quality
- **AWS CDK** for infrastructure as code deployment

## Task List Page

The application includes a Task List page that allows users to:

- View all tasks in a list format sorted by due date
- See which tasks are completed and which are overdue
- Easily identify tasks without due dates
- View a loading state while tasks are being fetched
- See appropriate messages for empty states and errors

## Dark Mode

The application includes a dark mode feature that allows users to:

- Toggle between light and dark themes
- Automatically detect system preferences
- Persist theme preferences in localStorage

The dark mode implementation is based on Tailwind CSS and uses the following components:

- `ThemeProvider` - Manages theme state and preferences
- `ThemeToggle` - UI component for switching themes

## Infrastructure

The application is deployed using AWS CDK (Cloud Development Kit) with the following architecture:

- **S3 Bucket**: Hosts the static React application files
- **CloudFront**: Content delivery network for global distribution

### Deployment

To deploy the infrastructure:

```bash
# Navigate to the infrastructure directory
cd infrastructure

# Install dependencies
npm install

# Deploy the stack
npm run deploy
```

The deployment will:

1. Create an S3 bucket to store the application files
2. Set up a CloudFront distribution with optimal settings for a SPA
3. Deploy the built application files from the `../dist` directory
4. Configure proper redirects for SPA routing

### Infrastructure Code

The AWS CDK infrastructure is implemented in TypeScript and located in the `/infrastructure` directory:

- `/infrastructure/stacks/frontend-stack.ts` - S3 and CloudFront resources
- `/infrastructure/app.ts` - CDK app entry point
