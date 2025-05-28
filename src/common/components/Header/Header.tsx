import { Link } from "react-router-dom";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import { MenuIcon } from "lucide-react";
import Button from "../Button/Button";

interface HeaderProps {
  toggleSidebar: () => void;
}

/**
 * The Header component displays the application header with the app name, navigation links and theme toggle.
 */
const Header = ({ toggleSidebar }: HeaderProps): JSX.Element => {
  return (
    <header className="bg-slate-900 dark:bg-slate-800 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            testId="sidebar-toggle"
            className="text-white p-0 hover:bg-slate-600/50 dark:hover:bg-slate-700/50"
          >
            <MenuIcon className="h-6 w-6" />
          </Button>
          <Link to="/" className="text-xl font-bold">
            React Starter Kit
          </Link>
          <nav className="hidden md:block">
            <ul className="flex space-x-4">
              <li>
                <Link
                  to="/documentation"
                  className="text-white hover:text-blue-300 transition-colors"
                  data-testid="header-documentation-link"
                >
                  Documentation
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
