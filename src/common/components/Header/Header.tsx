import { Link } from "react-router-dom";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import { SidebarTrigger, useSidebar } from "../Sidebar/Sidebar";
import { cn } from "@/common/utils/css";

/**
 * The Header component displays the application header with the app name, navigation links and theme toggle.
 */
const Header = (): JSX.Element => {
  const { open } = useSidebar();

  return (
    <header className="bg-slate-900 dark:bg-slate-800 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <SidebarTrigger className="hover:bg-slate-600/50 dark:hover:bg-slate-700/50 size-9 hover:text-white" />
          <Link
            to="/"
            className={cn(
              "text-xl font-bold w-full transition-[width] duration-200 ease-linear overflow-hidden text-nowrap",
              { "w-0": open }
            )}
          >
            React Starter Kit
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
