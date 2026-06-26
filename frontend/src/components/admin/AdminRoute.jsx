import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const AdminRoute = () => {
  const { user } = useAuthStore();

  // For production, this MUST check the actual token verification from backend.
  // We're checking the frontend state which should be populated by login.
  if (user && user.role === 'admin') {
    return <Outlet />;
  }

  return <Navigate to="/admin/login" replace />;
};

export default AdminRoute;
