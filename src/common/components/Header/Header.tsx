import { BadgeCheck, PlusIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { Button } from '../ui/button';
import { useScrollDirection } from '../../hooks/useScrollDirection';

export const Header = () => {
  const { isVisible } = useScrollDirection();

  return (
    <header
      className={`
        fixed top-0 z-50 w-full border-b border-border bg-slate-100 dark:bg-slate-900
        transition-transform duration-300 ease-in-out
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
      `}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2" aria-label="Task Hero homepage">
          <BadgeCheck className="h-6 w-6" />
          <span className="text-2xl font-bold">Task Hero</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button asChild size="sm">
            <Link to="/tasks/create">
              <PlusIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Create</span>
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
