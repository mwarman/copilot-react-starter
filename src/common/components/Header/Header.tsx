import { BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="w-full border-b border-border bg-slate-200 dark:bg-slate-800">
      <div className="container flex h-16 items-center px-4">
        <Link to="/" className="flex items-center gap-2" aria-label="Task Hero homepage">
          <BadgeCheck className="h-6 w-6" />
          <span className="text-2xl font-bold">Task Hero</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
