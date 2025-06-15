import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Header } from '../Header/Header';

// Lazy load route components
const LandingPage = lazy(() => import('../../../pages/LandingPage/LandingPage'));

// Loading fallback component
export const LoadingFallback = () => (
  <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

/**
 * Router component that defines the application routes
 * and includes the shared layout components like Header
 */
export const Router = () => {
  return (
    <>
      <Header />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* Additional routes will be added here as the application grows */}

          {/* Fallback route - redirect to home if route not found */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default Router;
