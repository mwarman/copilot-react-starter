import type { PropsWithChildren } from "react";

/**
 * Properties for the `Home` React component.
 */
export interface HomeProps extends PropsWithChildren {
  /**
   * Optional test ID for testing purposes.
   */
  testId?: string;
}

/**
 * The `Home` component serves as the landing page for the application.
 * It provides information about the React Starter Kit including its purpose,
 * key features, and guidance for getting started.
 */
const Home = ({ testId = "home-page" }: HomeProps = {}): JSX.Element => {
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8" data-testid={testId}>
      <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center">Welcome to React Starter Kit</h1>

      <section className="mb-8 md:mb-10">
        <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">About This Application</h2>
        <p className="text-base md:text-lg leading-relaxed mb-4">
          This React Starter Kit provides a solid foundation for building modern web applications with React and Vite.
          It includes best practices for code organization, performance, and developer experience.
        </p>
        <p className="text-base md:text-lg leading-relaxed">
          The project is set up with TypeScript for type safety, Tailwind CSS for styling, and includes a suite of tools
          to enhance your development workflow.
        </p>
      </section>

      <section className="mb-8 md:mb-10">
        <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">Key Features</h2>
        <ul className="list-disc pl-6 space-y-2 md:space-y-3">
          <li className="text-base md:text-lg">
            <span className="font-medium">Modern Tech Stack:</span> Built with React, TypeScript, and Vite
          </li>
          <li className="text-base md:text-lg">
            <span className="font-medium">UI Components:</span> Includes shadcn/ui components powered by Tailwind CSS
          </li>
          <li className="text-base md:text-lg">
            <span className="font-medium">Form Handling:</span> Integrated with React Hook Form and Zod for validation
          </li>
          <li className="text-base md:text-lg">
            <span className="font-medium">Data Management:</span> Uses React Query for efficient data fetching and
            caching
          </li>
          <li className="text-base md:text-lg">
            <span className="font-medium">Testing:</span> Set up with Vitest and Testing Library for comprehensive
            testing
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">Getting Started</h2>
        <p className="text-base md:text-lg leading-relaxed mb-4">
          Explore the codebase to understand the project structure and conventions. The project follows a
          component-based architecture with clear separation of concerns.
        </p>
        <p className="text-base md:text-lg leading-relaxed">
          Check out the documentation for more details on how to extend and customize the application for your specific
          needs.
        </p>
      </section>
    </div>
  );
};

export default Home;
