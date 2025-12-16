import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';

// Lazy load page components for code splitting
const Login = lazy(() => import('@/pages/Login'));
const Overview = lazy(() => import('@/pages/Overview'));
const Projects = lazy(() => import('@/pages/Projects'));
const Deliverables = lazy(() => import('@/pages/Deliverables'));
const Wizard = lazy(() => import('@/pages/Wizard'));
const Settings = lazy(() => import('@/pages/Settings'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
      <p className="mt-4 text-sm text-slate-600">Loading...</p>
    </div>
  </div>
);

// Wrapper to add Suspense boundary to lazy loaded components
const withSuspense = (Component: React.LazyExoticComponent<any>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: withSuspense(Login),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: withSuspense(Overview) },
      { path: 'projects', element: withSuspense(Projects) },
      { path: 'deliverables', element: withSuspense(Deliverables) },
      { path: 'wizard', element: withSuspense(Wizard) },
      { path: 'settings', element: withSuspense(Settings) },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
