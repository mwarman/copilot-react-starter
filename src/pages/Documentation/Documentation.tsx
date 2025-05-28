import { Suspense } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
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
      <div>
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default Documentation;
