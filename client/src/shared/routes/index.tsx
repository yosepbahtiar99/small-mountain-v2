import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import LandingPage from '../../features/landing/pages/LandingPage';
import GamesPage from '../../features/games/pages/GamesPage';
import BlogListPage from '../../features/blog/pages/BlogListPage';
import BlogDetailPage from '../../features/blog/pages/BlogDetailPage';
import MerchPage from '../../features/merch/pages/MerchPage';
import LoginPage from '../../features/auth/pages/LoginPage';
import DashboardPage from '../../features/admin/pages/DashboardPage';
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
    element: <MainLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/games', element: <GamesPage /> },
      { path: '/devlogs', element: <BlogListPage /> },
      { path: '/devlogs/:slug', element: <BlogDetailPage /> },
      { path: '/merch', element: <MerchPage /> },
    ]
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  }
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
