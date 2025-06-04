# Initial Application Setup: Creating a Vite React TypeScript Project

This document outlines the requirements and steps for initializing our application using Vite, React, and TypeScript.

## Overview

We will create a new Vite-powered React application with TypeScript support following the official Vite installation instructions. This will establish the foundation for our project.

## Requirements

- Node.js 22.x - Use **.nvmrc** file to set node version manager if available

```bash
nvm use
```

## Installation Steps

1. Navigate to the project directory:

```bash
cd copilot-react-starter
```

2. Initialize a new Vite project using the official scaffolding command:

```bash
npm create vite@latest . -- --template react-ts
```

3. When prompted, select the following options:

- Framework: React
- Variant: TypeScript

4. Install the dependencies:

```bash
npm install
```

5. Verify the installation by running the development server:

```bash
npm run dev
```

## Expected Project Structure

After installation, the project should have the following basic structure:

```
copilot-react-starter/
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .eslintrc.cjs
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Configuration Files

The installation will generate several configuration files:

- **tsconfig.json**: TypeScript configuration
- **vite.config.ts**: Vite build tool configuration
- **.eslint.config.js**: ESLint configuration for code quality
- **package.json**: Project dependencies and scripts

## Next Steps

After successful installation:

1. Review and potentially customize the generated configuration files

## Resources

- [Vite Official Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
