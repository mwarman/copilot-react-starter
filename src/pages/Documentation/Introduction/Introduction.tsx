/**
 * TableOfContents component for the Introduction page
 */
const TableOfContents = (): JSX.Element => {
  return (
    <div className="bg-card p-4 rounded-lg border border-border">
      <h3 className="text-lg font-semibold mb-3">Table of Contents</h3>
      <ul className="space-y-2 text-sm">
        <li>
          <a href="#about-application" className="text-primary hover:underline">
            About this application
          </a>
        </li>
        <li>
          <a href="#starter-kit" className="text-primary hover:underline">
            What is a starter kit
          </a>
        </li>
        <li>
          <a href="#copilot-vscode" className="text-primary hover:underline">
            About using Copilot with VS Code
          </a>
        </li>
        <li>
          <a href="#react-copilot" className="text-primary hover:underline">
            About creating a React application with Copilot
          </a>
        </li>
      </ul>
    </div>
  );
};

/**
 * The `Introduction` component serves as the landing page for the documentation section.
 * It provides an overview of the application, explains what a starter kit is,
 * and provides information about using Copilot with VS Code and for React development.
 */
const Introduction = (): JSX.Element => {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Introduction</h2>

      <div className="mb-8">
        <TableOfContents />
      </div>

      <section id="about-application" className="mb-8 scroll-mt-16">
        <h3 className="text-xl font-semibold mb-4">About this application</h3>
        <p className="text-base md:text-lg leading-relaxed mb-4">
          This React Starter Kit is a modern web application built with Vite for optimal performance and developer
          experience. It follows best practices for code organization, readability, and maintainability while minimizing
          abstraction and complexity.
        </p>
        <p className="text-base md:text-lg leading-relaxed mb-4">
          The application is designed to serve as a foundation for building robust React applications with a focus on
          developer productivity and code quality. It includes a carefully selected set of libraries and tools that work
          well together to provide a seamless development experience.
        </p>
      </section>

      <section id="starter-kit" className="mb-8 scroll-mt-16">
        <h3 className="text-xl font-semibold mb-4">What is a starter kit</h3>
        <p className="text-base md:text-lg leading-relaxed mb-4">
          A starter kit is a pre-configured project template that provides a foundation for building applications. It
          includes a set of tools, libraries, and configurations that are commonly used in a specific type of project.
        </p>
        <p className="text-base md:text-lg leading-relaxed mb-4">This React Starter Kit includes:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li className="text-base md:text-lg">React for building user interfaces</li>
          <li className="text-base md:text-lg">TypeScript for type safety</li>
          <li className="text-base md:text-lg">Vite for fast development and build times</li>
          <li className="text-base md:text-lg">React Router for routing</li>
          <li className="text-base md:text-lg">shadcn/ui for pre-built components</li>
          <li className="text-base md:text-lg">Tailwind CSS for utility-first styling</li>
          <li className="text-base md:text-lg">React Query for data fetching and caching</li>
          <li className="text-base md:text-lg">Vitest and Testing Library for testing</li>
        </ul>
      </section>

      <section id="copilot-vscode" className="mb-8 scroll-mt-16">
        <h3 className="text-xl font-semibold mb-4">About using Copilot with VS Code</h3>
        <p className="text-base md:text-lg leading-relaxed mb-4">
          GitHub Copilot is an AI pair programmer that helps you write code faster and with less effort. It works
          directly in your editor, suggesting whole lines or blocks of code as you type.
        </p>
        <p className="text-base md:text-lg leading-relaxed mb-4">When used with VS Code, Copilot provides:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li className="text-base md:text-lg">Code suggestions as you type</li>
          <li className="text-base md:text-lg">Full-function suggestions</li>
          <li className="text-base md:text-lg">Natural language to code conversion</li>
          <li className="text-base md:text-lg">Contextual understanding of your codebase</li>
          <li className="text-base md:text-lg">Support for dozens of programming languages</li>
        </ul>
        <p className="text-base md:text-lg leading-relaxed mb-4">
          To use Copilot in VS Code, you need to install the GitHub Copilot extension and sign in with your GitHub
          account.
        </p>
      </section>

      <section id="react-copilot" className="mb-8 scroll-mt-16">
        <h3 className="text-xl font-semibold mb-4">About creating a React application with Copilot</h3>
        <p className="text-base md:text-lg leading-relaxed mb-4">
          GitHub Copilot can significantly accelerate React development by helping with various tasks:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li className="text-base md:text-lg">
            <span className="font-medium">Component Creation:</span> Quickly generate React components based on your
            needs
          </li>
          <li className="text-base md:text-lg">
            <span className="font-medium">State Management:</span> Suggest state and effect hooks implementation
          </li>
          <li className="text-base md:text-lg">
            <span className="font-medium">Form Handling:</span> Generate form validation logic and state management
          </li>
          <li className="text-base md:text-lg">
            <span className="font-medium">API Integration:</span> Help with data fetching code using React Query or
            other libraries
          </li>
          <li className="text-base md:text-lg">
            <span className="font-medium">CSS and Styling:</span> Suggest Tailwind CSS classes and styling approaches
          </li>
          <li className="text-base md:text-lg">
            <span className="font-medium">Testing:</span> Generate test cases for your components
          </li>
        </ul>
        <p className="text-base md:text-lg leading-relaxed mb-4">
          Copilot understands the context of your project and can provide suggestions that align with your coding style
          and project structure. This makes it particularly valuable for React development, where there are many
          patterns and best practices to follow.
        </p>
      </section>
    </div>
  );
};

export default Introduction;
