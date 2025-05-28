import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Loading from "../Loading/Loading";
import Layout from "../Layout/Layout";

// Lazy load page components for code splitting
const Home = lazy(() => import("../../../pages/Home/Home"));
const Documentation = lazy(() => import("../../../pages/Documentation/Documentation"));
const Introduction = lazy(() => import("../../../pages/Documentation/Introduction/Introduction"));

/**
 * Define the application routes.
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </Layout>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "documentation",
        element: <Documentation />,
        children: [
          {
            path: "introduction",
            element: <Introduction />,
          },
        ],
      },
    ],
  },
]);

/**
 * The Router component that provides routing for the application.
 */
const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
