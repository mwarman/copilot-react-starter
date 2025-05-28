import type { PropsWithChildren } from "react";
import Header from "../Header/Header";

/**
 * The Layout component provides a standard page layout with header and main content area.
 */
const Layout = ({ children }: PropsWithChildren): JSX.Element => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-6">
        <div className="container mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
