import { type JSX } from 'react';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { BadgeCheck } from 'lucide-react';

/**
 * Application header component that displays across all pages.
 * Shows the application name "Task Hero" with appropriate styling.
 */
export const Header = (): JSX.Element => {
  return (
    <header className="w-full h-16 bg-background border-b">
      <div className="container h-full px-4 mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <BadgeCheck className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Task Hero</h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
