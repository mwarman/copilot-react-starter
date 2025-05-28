import { Suspense } from "react";
import { Outlet, Navigate, useLocation, Link } from "react-router-dom";
import Loading from "../../common/components/Loading/Loading";

/**
 * The `Documentation` component serves as the layout for all documentation pages.
 * It renders the documentation content and handles the redirect from the base
 * documentation route to the introduction page.
 */
const Documentation = (): JSX.Element => {
  const location = useLocation();

  // Redirect to introduction page if user navigates to the base documentation route
  if (location.pathname === "/documentation") {
    return <Navigate to="/documentation/introduction" replace />;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">Documentation</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-3">
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </div>
        <div className="md:col-span-1 order-first md:order-last">
          <div className="sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Pages</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/documentation/introduction" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Introduction
                </Link>
              </li>
              {/* More documentation pages will be added here */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
