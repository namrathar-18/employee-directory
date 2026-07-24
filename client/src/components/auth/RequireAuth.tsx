import { Navigate, useLocation } from 'react-router-dom';
import { AppLayout } from '../layout/AppLayout';
import { useAuth } from '../../context/AuthProvider';

/** Gate for the app routes — bounces to the sign-in page when signed out. */
export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <AppLayout />;
}
