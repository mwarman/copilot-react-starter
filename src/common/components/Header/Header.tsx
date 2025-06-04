import { type JSX } from 'react';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';

/**
 * Application header component that displays across all pages.
 * Shows the application name "Task Hero" with appropriate styling.
 */
export const Header = (): JSX.Element => {
  return (
    <header className="w-full py-4 px-6 bg-background border-b">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task Hero</h1>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
