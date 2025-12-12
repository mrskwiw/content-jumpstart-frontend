import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '@/pages/Login';
import Overview from '@/pages/Overview';
import Projects from '@/pages/Projects';
import Deliverables from '@/pages/Deliverables';
import Wizard from '@/pages/Wizard';
import Settings from '@/pages/Settings';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Overview /> },
      { path: 'projects', element: <Projects /> },
      { path: 'deliverables', element: <Deliverables /> },
      { path: 'wizard', element: <Wizard /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
