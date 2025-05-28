import type { PropsWithChildren } from "react";
import { useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import SidebarNavigation from "../SidebarNavigation/SidebarNavigation";

/**
 * The Layout component provides a standard page layout with header, main content area, and footer.
 */
const Layout = ({ children }: PropsWithChildren): JSX.Element => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors ${
        isSidebarOpen ? "lg:pl-64" : ""
      }`}
    >
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 relative">
        <SidebarNavigation isOpen={isSidebarOpen} onClose={closeSidebar} />
        <main className="flex-1 p-6 transition-all duration-300">
          <div className="container mx-auto">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
