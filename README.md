# React Starter Kit with GitHub Copilot

A serverless, progressive, responsive starter front end component with React at the core of the technology stack. Uses GitHub Copilot as an AI coding assistant.

## Getting Started

Begin by reviewing and updating the [Copilot Instructions](.github/copilot-instructions.md) to suit the needs and preferences for your React project.

Interact with Copilot using your favorite editor, we use [VS Code][vscode], to create your application.

## Tips and Tricks

There is a wealth of information available for using GitHub Copilot effectively. This official [Tips and Tricks guide](https://code.visualstudio.com/docs/copilot/copilot-tips-and-tricks) from VS Code provides an excellent summary of Copilot best practices.

[vscode]: https://code.visualstudio.com/ "Visual Studio Code"

## Prompts

Here are some prompts to get your project started. Place Copilot in **Agent** mode and give these a try.

### Node Version Manager

Update your project with a Node Version Manager control file.

```
add a node version manager control file to the project using the latest release of node 20
```

### Create Vite React application

Create a new Vite React TypeScript application. Arguably, this could also be completed by issuing a Vite CLI command, but Copilot modifies the generated template source code to your standards following the details in the instructions file much as you would after creating a new React app.

```
#fetch https://vite.dev/guide/ Follow these instructions exactly to use Vite to create a new React TypeScript application in the base directory of this project.
```

### Use path aliases

Update the TypeScript configuration to use path aliases.

```
Update the TypeScript and Vite configurations to use a path alias `@` for the `/src` directory.
```

### Rename the application

With the generated React app in place, ask Copilot to rename the application.

```
Update the project to be named "React Starter Kit".
```

### Add Vitest for unit tests

Add Vitest and React Testing Library for unit tests.

```
Install and configure Vitest with React Testing Library. Include support for `jest-dom` assertions. Include support for code coverage with v8. Be sure to include the default code coverage exclusions from Vitest.
```

### Install Tailwind CSS

Add Tailwind CSS to the project and update existing components to use Tailwind classes. Note that depending upon the model training date, the AI agent may try to install Tailwind the _"old"_ way. Tell the agent to follow the current installation documentation _"exactly"_.

```
Install Tailwind CSS with these instructions #fetch https://tailwindcss.com/docs/installation/using-vite  Follow these instructions exactly.
```

### Initialize shadcn/ui (Manual)

Initialize `shadcn/ui` in the project so that Copilot can more easily add shadcn components later.

```
npx shadcn@latest init
```

### General prompts

#### Update dependencies

Sometimes Copilot makes changes to `package.json` and does not run `npm install`.

```
Let's reinstall npm dependencies since package.json was updated.
```
