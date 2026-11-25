import { Collapse } from 'bootstrap';
import { useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AUTH_STATUS, useAuth } from '../../stores/auth';
import Logo from '../icons/Logo';

const hideMenu = (element) => Collapse.getInstance(element)?.hide();

const NavMain = (props) => {
  const { overlay = false } = props;
  const className = `m-nav-main nav-main navbar navbar-expand-lg${overlay ? ' is-overlay' : ''}`;
  const { user, isAuthenticated, status, logout } = useAuth();
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const collapseRef = useRef(null);

  useEffect(() => {
    //  Collapse.getInstance(element)?.hide();
    hideMenu(collapseRef.current);
  }, [pathname, hash]);

  const handleLogout = () => {
    hideMenu(collapseRef.current);
    navigate('/');
    logout();
  };

  return (
    <nav className={className} aria-label="Hauptnavigation">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <Logo />
          <span className="brand-text">JS-Kurs</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Navigation ein- und ausblenden">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav" ref={collapseRef}>
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                Start
              </NavLink>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/#modules">
                Module
              </Link>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">
                Kontakt
              </NavLink>
            </li>
            {status === AUTH_STATUS.LOADING && <li className="nav-item nav-auth-placeholder" aria-hidden="true" />}
            {status !== AUTH_STATUS.LOADING && !isAuthenticated && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/login">
                  Login
                </NavLink>
              </li>
            )}
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link nav-user" to="/profile">
                    <span className="visually-hidden">Profil von </span>
                    {user.name}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <button className="nav-link nav-logout" type="button" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavMain;
