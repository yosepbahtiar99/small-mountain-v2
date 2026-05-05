import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../../App';

// In a real app, you would import pages from features here
// import GamePage from '../../features/games/pages/GamePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  // Add more routes as features are developed
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
