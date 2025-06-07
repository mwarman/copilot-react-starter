import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Skeleton } from '@/common/components/ui/skeleton';

// Lazy load pages for code splitting
const TaskListPage = lazy(() => import('@/pages/TaskList/TaskListPage'));

/**
 * Loading fallback component shown while lazy-loaded routes are being loaded
 */
const LoadingFallback = () => (
  <div className="container mx-auto p-8">
    <Skeleton className="h-[200px] w-full" />
  </div>
);

/**
 * Application router component that defines the routes for the application.
 * Uses lazy loading with Suspense for code splitting.
 */
export const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Redirect from root to tasks page */}
          <Route path="/" element={<Navigate to="/tasks" replace />} />

          {/* Tasks route */}
          <Route path="/tasks" element={<TaskListPage />} />

          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/tasks" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
