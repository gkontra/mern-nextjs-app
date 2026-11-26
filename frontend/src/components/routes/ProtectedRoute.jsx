import { FaCircleExclamation } from 'react-icons/fa6';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AUTH_STATUS, useAuth } from '../../stores/auth';

const ProtectedRoute = () => {
  const { isAuthenticated, status, error, retrySession } = useAuth();
  const location = useLocation();

  if (status === AUTH_STATUS.LOADING) {
    return (
      <div className="container py-5">
        <p role="status">Sitzung wird geprüft …</p>
      </div>
    );
  }

  if (status === AUTH_STATUS.READY && !isAuthenticated && error) {
    return (
      <div className="m-protected-route protected-route container">
        <div className="session-alert" role="alert">
          <FaCircleExclamation aria-hidden="true" focusable="false" />
          <p>Deine Sitzung konnte nicht geprüft werden: {error}</p>
        </div>
        <button className="retry-button" type="button" onClick={retrySession}>
          Erneut versuchen
        </button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
