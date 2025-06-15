import { BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';

export const Header = () => {
  return (
    <header className="w-full border-b border-border bg-slate-100 dark:bg-slate-900">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2" aria-label="Task Hero homepage">
          <BadgeCheck className="h-6 w-6" />
          <span className="text-2xl font-bold">Task Hero</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
