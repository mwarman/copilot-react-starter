import type { PropsWithChildren } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

/**
 * The Layout component provides a standard page layout with header, main content area, and footer.
 */
const Layout = ({ children }: PropsWithChildren): JSX.Element => {
  return (
    <div
      className={`min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors`}
    >
      <Header />
      <div className="flex flex-1 relative">
        <main className="flex-1 p-6 transition-all duration-300">
          <div className="container mx-auto">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
