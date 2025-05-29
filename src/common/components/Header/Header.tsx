import { Link } from "react-router-dom";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";

/**
 * The Header component displays the application header with the app name, navigation links and theme toggle.
 */
const Header = (): JSX.Element => {
  return (
    <header className="bg-slate-900 dark:bg-slate-800 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
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
