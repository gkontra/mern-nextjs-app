import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AUTH_STATUS, useAuth } from '../../stores/auth';

const ProtectedRoute = () => {
  const { isAuthenticated, status } = useAuth();
  const location = useLocation();

  if (status === AUTH_STATUS.LOADING) {
    return (
      <div className="container py-5">
        <p role="status">Sitzung wird geprüft …</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
