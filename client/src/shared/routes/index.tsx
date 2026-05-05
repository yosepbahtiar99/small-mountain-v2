import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from '../../App';
import LoginPage from '../../features/auth/pages/LoginPage';
import { useAuthStore } from '../store/useAuthStore';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <div className="p-8"><h1>Admin Dashboard (Coming Soon)</h1></div>
      </ProtectedRoute>
    ),
  }
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
