import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Header } from '../Header/Header';
import Footer from '../Footer/Footer';

// Lazy load route components
const LandingPage = lazy(() => import('@/pages/LandingPage/LandingPage'));
const TaskListPage = lazy(() => import('@/pages/TaskList/TaskListPage'));
const CreateTaskPage = lazy(() => import('@/pages/CreateTask/CreateTaskPage'));

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
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Redirect root to tasks */}
            <Route path="/" element={<Navigate to="/tasks" replace />} />

            {/* Task routes */}
            <Route path="/tasks" element={<TaskListPage />} />
            <Route path="/tasks/create" element={<CreateTaskPage />} />

            {/* Legacy landing page kept for reference */}
            <Route path="/landing" element={<LandingPage />} />

            {/* Fallback route - redirect to tasks if route not found */}
            <Route path="*" element={<Navigate to="/tasks" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Router;
