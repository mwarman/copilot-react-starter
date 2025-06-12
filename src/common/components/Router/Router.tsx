import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Skeleton } from '@/common/components/ui/skeleton';

// Lazy load pages for code splitting
const TaskListPage = lazy(() => import('@/pages/TaskList/TaskListPage'));
const CreateTaskPage = lazy(() => import('@/pages/CreateTask/CreateTaskPage'));
const TaskDetailPage = lazy(() => import('@/pages/TaskDetail/TaskDetailPage'));
const UpdateTaskPage = lazy(() => import('@/pages/UpdateTask/UpdateTaskPage'));

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

          {/* Create task route */}
          <Route path="/tasks/create" element={<CreateTaskPage />} />

          {/* Task detail route */}
          <Route path="/tasks/:taskId" element={<TaskDetailPage />} />

          {/* Update task route */}
          <Route path="/tasks/:taskId/edit" element={<UpdateTaskPage />} />

          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/tasks" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
