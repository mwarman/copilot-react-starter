# React Starter Kit with GitHub Copilot

A serverless, progressive, responsive starter front end component with React at the core of the technology stack. Uses GitHub Copilot as an AI coding assistant.

## Getting started

Begin by reviewing and updating the [Copilot Instructions](.github/copilot-instructions.md) to suit the needs and preferences for your React project.

Interact with Copilot using your favorite editor, we use [VS Code][vscode], to create your application.

## Additional reading

The [official guide for GitHub Copilot in VS Code][vscode-copilot-docs] provides a lot of information and is very useful for those who are just starting to use Copilot in VS Code.

The VS Code YouTube channel has a playlist with many interesting videos and tutorials for [GitHub Copilot in VS Code](https://youtube.com/playlist?list=PLj6YeMhvp2S7rQaCLRrMnzRdkNdKnMVwg&si=KIRHyFKYyMcUssQ3).

This official [tips and tricks guide](https://code.visualstudio.com/docs/copilot/copilot-tips-and-tricks) from VS Code provides an excellent summary of Copilot best practices.

## Prompts

Here are some prompts to get your project started. Place Copilot in **Agent** mode and give these a try.

### Use node version manager

Update your project with a Node Version Manager control file.

```
Add a node version manager control file to the project using the latest release of node 20
```

### Create the React application

Create a new Vite React TypeScript application. Arguably, this could also be completed by issuing a Vite CLI command, but Copilot modifies the generated template source code to your standards following the details in the instructions file much as you would after creating a new React app.

```
#fetch https://vite.dev/guide/ Follow these instructions exactly to use Vite to create a new React TypeScript application in the base directory of this project.
```

> **NOTE:** This will install React v19 dependencies. Some of the libraries in the technology stack (see the Copilot instructions) do not yet officially support React 19. You may choose to proceed with React 19 or install some of the other dependencies using the `--force` parameter.

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

OR

```
Let's make sure the package lock file is up to date.
```

#### Pin dependencies

Even though there is a rule that all dependency versions should be "pinned", Copilot installs `^` and `~` relative versions.

```
Let's update package.json to pin the dependency versions.
```

[vscode]: https://code.visualstudio.com/ "Visual Studio Code"
[vscode-copilot-docs]: https://code.visualstudio.com/docs/copilot/overview "GitHub Copilot in VS Code"
