import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/Authentication';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to='/dashboard' />;
  }

  return children;
}
