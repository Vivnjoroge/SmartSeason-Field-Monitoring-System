// Route guard that enforces authentication and optional role constraints.
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ role }) => {
  const { token, user } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    const fallback = user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/agent';
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
