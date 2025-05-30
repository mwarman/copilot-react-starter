import type { PropsWithChildren } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { SidebarProvider } from "../Sidebar/Sidebar";
import SidebarNavigation from "../SidebarNavigation/SidebarNavigation";
import { cn } from "@/common/utils/css";

/**
 * The Layout component provides a standard page layout with header, main content area, and footer.
 */
const Layout = ({ children }: PropsWithChildren): JSX.Element => {
  return (
    <SidebarProvider>
      <SidebarNavigation />
      <div className={cn("min-h-screen flex flex-col transition-colors w-full")}>
        <Header />
        <div className="flex flex-1 relative">
          <main className="flex-1 p-6 transition-all duration-300">
            <div className="container mx-auto">{children}</div>
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default Layout;
