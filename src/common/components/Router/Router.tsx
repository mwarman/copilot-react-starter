import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Loading from "../Loading/Loading";

// Lazy load page components for code splitting
const Home = lazy(() => import("../../../pages/Home/Home"));

/**
 * Define the application routes.
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loading />}>
        <Home />
      </Suspense>
    ),
  },
]);

/**
 * The Router component that provides routing for the application.
 */
const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
