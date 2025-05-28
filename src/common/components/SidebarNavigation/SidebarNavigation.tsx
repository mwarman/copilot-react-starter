import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarTrigger } from "../Sidebar/Sidebar";

interface SidebarNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * The SidebarNavigation component renders the application's sidebar navigation.
 */
const SidebarNavigation = ({ isOpen, onClose }: SidebarNavigationProps): JSX.Element => {
  return (
    <>
      {/* Overlay for mobile view */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} data-testid="sidebar-overlay" />
      )}

      {/* Sidebar */}
      <Sidebar
        className={`h-screen z-40 w-64 transform transition-transform duration-300 ease-in-out bg-slate-900 dark:bg-slate-800 text-white lg:fixed lg:top-0 lg:left-0 lg:bottom-0 shadow-md ${
          isOpen ? "fixed inset-y-0 left-0 translate-x-0" : "fixed inset-y-0 left-0 -translate-x-full"
        }`}
        data-testid="sidebar"
      >
        <SidebarHeader className="flex items-center justify-between border-b border-slate-700 dark:border-slate-700 py-4 px-6">
          <Link to="/" className="text-xl font-bold text-white" onClick={onClose}>
            React Starter Kit
          </Link>
          <SidebarTrigger
            onClick={onClose}
            className="text-white p-0 hover:bg-slate-600/50 dark:hover:bg-slate-700/50 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </SidebarTrigger>
        </SidebarHeader>

        <SidebarContent className="py-4 px-2">
          <nav className="space-y-2">
            <Link
              to="/"
              className="block px-4 py-2 text-sm text-white hover:bg-slate-600/50 dark:hover:bg-slate-700/50 rounded-md transition-colors"
              onClick={onClose}
              data-testid="sidebar-home-link"
            >
              Home
            </Link>

            <SidebarGroup title="Documentation" defaultOpen>
              <div className="space-y-2 pl-2">
                <Link
                  to="/documentation/introduction"
                  className="block px-4 py-1 text-sm text-white hover:text-blue-300 transition-colors"
                  onClick={onClose}
                  data-testid="sidebar-introduction-link"
                >
                  Introduction
                </Link>
                {/* More documentation links can be added here */}
              </div>
            </SidebarGroup>
          </nav>
        </SidebarContent>
      </Sidebar>
    </>
  );
};

export default SidebarNavigation;
