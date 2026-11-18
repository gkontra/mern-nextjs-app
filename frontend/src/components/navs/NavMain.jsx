import { Link, NavLink, useLocation } from 'react-router-dom';

import { Collapse } from 'bootstrap';
import Logo from '../icons/Logo';
import { useEffect, useRef } from 'react';

const NavMain = (props) => {
  const { overlay = false } = props;
  // Hooks
  const { pathname, hash } = useLocation();
  const collapseRef = useRef(null); // { current: null } -> render -> {current: <div class="collape ...">..</div>}

  const className = `m-nav-main nav-main navbar navbar-expand-lg${overlay ? ' is-overlay' : ''}`;

  useEffect(() => {
    Collapse.getInstance(collapseRef.current)?.hide();
  }, [pathname, hash]);

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
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavMain;
