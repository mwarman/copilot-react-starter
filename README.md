# Task Hero

Task Hero is a modern web application that helps users create and manage their personal to-do lists. Built with React, TypeScript, and Vite, it provides a fast and responsive user experience for task management.

## Features

- Create, read, update, and delete tasks
- Search and filter tasks
- Mark tasks as complete
- Dark mode support
- Responsive design for mobile and desktop+ TypeScript + Vite

## Developer Setup

### Prerequisites

- Node.js (version 22.16.0 or later, check the .nvmrc file)
- Git

### Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/task-hero.git
   cd task-hero
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   This will open the application in your default browser at `http://localhost:5173`.

### Available Scripts

- `npm run dev` - Start the development server with auto-open
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint to check for code quality issues
- `npm run preview` - Preview the production build locally

### Project Structure

```
src
  /common
    /components
      /ui                     # UI components (shadcn/ui)
      /Header                 # App header
      /Footer                 # App footer
    /models                   # Type definitions
    /providers                # Context providers
    /hooks                    # Custom hooks
    /utils                    # Utility functions
  /pages
    /TaskList                 # Task list page
    /TaskDetail               # Task detail page
    /CreateTask               # Create task page
  App.tsx                     # Main application component
  main.tsx                    # Entry point
  index.css                   # Global styles

/infrastructure              # AWS CDK infrastructure code
```

### Technology Stack

- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and development server
- **Vitest** - Unit testing
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - UI component library
- **React Query** - Data fetching and state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **AWS CDK** - Infrastructure as code

## Developer Workflow

### Code Quality

- **TypeScript** - Write all code in TypeScript with proper type definitions
- **ESLint** - Follow the ESLint rules configured in `eslint.config.js`
- **Testing** - Write unit tests for components and utilities using Vitest and React Testing Library

### Branching Strategy

- `main` - Production-ready code
- `feature/*` - Feature branches for new development
- `bugfix/*` - Bug fix branches
- `release/*` - Release branches

### Deployment

The application is deployed using AWS CDK, which provisions an S3 bucket for file storage and a CloudFront distribution for content delivery. To deploy:

1. Install infrastructure dependencies (first time only):

   ```bash
   npm run cdk:install
   ```

2. Build and deploy the application:

   ```bash
   npm run cdk:deploy
   ```

   Or with custom parameters using environment variables:

   ```bash
   npm run build
   cd infrastructure
   CDK_ENV=prod CDK_DOMAIN_NAMES=yourdomain.com CDK_CERTIFICATE_ARN=your-certificate-arn npm run deploy
   ```

### AWS Infrastructure

The application is deployed to AWS using the following components:

- **S3 Bucket**: Stores the static files for the React application
- **CloudFront Distribution**: Global content delivery network for serving the application
  - Redirects HTTP to HTTPS
  - Handles SPA routing by redirecting 404/403 errors to index.html
  - Uses Price Class 100 for cost optimization (North America and Europe)

#### Infrastructure Management

Additional infrastructure commands:

- `npm run cdk:diff` - Show changes before deployment
- `npm run cdk:synth` - Generate CloudFormation template
- `npm run cdk:destroy` - Remove the infrastructure (use with caution)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
