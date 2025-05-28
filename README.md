# React Starter Kit with GitHub Copilot

A serverless, progressive, responsive starter front end component with React at the core of the technology stack. Uses GitHub Copilot as an AI coding assistant.

## Getting started

Begin by reviewing and updating the [Copilot Instructions](.github/copilot-instructions.md) to suit the needs and preferences for your React project.

Interact with Copilot using your favorite editor to create your application. We strongly recommend [VS Code][vscode].

## Additional reading

The [official guide for GitHub Copilot in VS Code][vscode-copilot-docs] provides a lot of information and is very useful for those who are just starting to use Copilot in VS Code.

The VS Code YouTube channel has a playlist with many interesting videos and tutorials for [GitHub Copilot in VS Code](https://youtube.com/playlist?list=PLj6YeMhvp2S7rQaCLRrMnzRdkNdKnMVwg&si=KIRHyFKYyMcUssQ3).

This official [tips and tricks guide](https://code.visualstudio.com/docs/copilot/copilot-tips-and-tricks) from VS Code provides an excellent summary of Copilot best practices.

## Project Structure

The project structure follows the best practicies for Copilot assistance. This project is ready to begin iterative development with a Copilot AI agent.

Note that the React application does not exist, not yet anyway. This base project structure is primed for building a React application from the very beginning using Copilot agent mode.

```
.github/                                   # GitHub configuration
  copilot-instructions.md                  # Copilot instructions for the project
  prompts/                                 # Helpful Copilot prompts
docs/                                      # Project documentation
  api/                                     # API documentation to assist Copilot
  requirements/                            # Features and stories to assist Copilot
.editorconfig                              # Editor configuration for consistent formatting
.nvmrc                                     # Node version manager configuration
README.md                                  # This document
```

## Prompts

### Building the foundation

Here are some prompts to start your React application. Place Copilot in **Agent** mode and give these a try. It is a good idea to commit the changes after each step is complete and you are satisfied with the outcome. This allows you to roll back changes for a single step, modify the prompt, and retry if necessary without losing any changes from a prior step.

#### Use node version manager

Update your project with a Node Version Manager control file.

```
Add a node version manager control file to the project using the latest release of node 20
```

#### Create the React application

Create a new Vite React TypeScript application. Arguably, this could also be completed by issuing a Vite CLI command, but Copilot modifies the generated template source code to your standards following the details in the instructions file much as you would after creating a new React app.

```
#fetch https://vite.dev/guide/ Follow these instructions exactly to use Vite to create a new React TypeScript application in the base directory of this project.
```

> **NOTE:** This will install React v19 dependencies. Some of the libraries in the technology stack (see the Copilot instructions) do not yet officially support React 19. You may choose to proceed with React 19 or install some of the other dependencies using the `--force` parameter.

#### Use path aliases

Update the TypeScript configuration to use path aliases.

```
Update the TypeScript and Vite configurations to use a path alias `@` for the `/src` directory.
```

#### Rename the application

With the generated React app in place, ask Copilot to rename the application.

```
Update the project to be named "React Starter Kit".
```

#### Add Vitest for unit tests

Add Vitest and React Testing Library for unit tests.

```
Install and configure Vitest with React Testing Library. Include support for `jest-dom` assertions. Include support for code coverage with v8. Configure the default code coverage exclusions from Vitest.
```

#### Install Tailwind CSS

Add Tailwind CSS to the project and update existing components to use Tailwind classes. Note that depending upon the model training date, the AI agent may try to install Tailwind the _"old"_ way. Tell the agent to follow the current installation documentation _"exactly"_.

```
Install Tailwind CSS with these instructions #fetch https://tailwindcss.com/docs/installation/using-vite  Follow these instructions exactly.
```

#### Initialize shadcn/ui (Manual)

Initialize [`shadcn/ui`](https://ui.shadcn.com/docs/installation/vite) in the project so that Copilot can more easily add shadcn components later. From the base project directory run the following command:

```
npx shadcn@latest init
```

### Adding features

You may ask Copilot to build a story or multiple related stories, i.e. a feature, or even all of the features in an application. When learning to use Copilot, it is best to begin small, with a story. By starting with a story, you may watch Copilot make a relatively small number of changes and additions to the code base. If and when Copilot implements something in an unexpected way, you can update the way that the requirements are written so that Copilot better understands what the agent should do.

**NOTE:** While it is not necessary to do so, I find that Copilot works best when I have built the foundation of the project first and _then_ I ask Copilot to begin implementing stories. Sometimes there are specific instructions for adding and configuring libraries to a project and those instructions may have changed since the AI model training date.

#### Implement a story

To ask Copilot to implement a story, follow these steps:

1. Close all editors.
2. Commit any uncommitted work so that you are able to roll back Copilot's changes if necessary.
3. Open Copilot and switch to _Agent_ mode.
4. Find the markdown file containing the story you wish to implement and drag that file into the Copilot chat.
5. Ask Copilot to implement the story with a prompt like: `Update the application with the requirements described in this document.`
6. Copilot will use the requirements document and the information in your `copilot-instructions.md` file to make changes to the application. The more detailed and specific the requirements are, the better the outcome will be.
7. Depending upon the complexity of the requirements, you may need to work with Copilot to refine the initial implementation.

```
Update the application with the requirements described in this document.
```

#### Follow best practices

When implementing requirements, sometimes Copilot does not follow all of the rules specified in the `copilot-instructions.md` document. You can ask the agent to review the changed files to ensure they match the project standards.

```
Review the changed files to ensure that they match the project standards.
```

OR

```
Review the changed files to ensure that they follow the project best practices.
```

#### Moving a component

Sometimes Copilot creates a source member in a location which does not match the project structure specified in the `copilot-instructions.md` document. You may ask the agent to move that component to the desired location. Copilot will move that component and related files, such as tests. The agent will ensure that all references are updated and ensure that both the app and the unit tests are functioning after the files are moved.

```
Move the `button` component from `src/components/ui` to `src/common/components`. Match the project structure and naming conventions.
```

### General prompts

The following sections describe general use projects that may be useful throughout various stages of development.

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
