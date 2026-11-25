import { useEffect, useRef, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import { NavLink, useLocation } from 'react-router-dom';

const NavDropdown = (props) => {
  const { id, label, items } = props;
  const { pathname } = useLocation();
  const [openOn, setOpenOn] = useState(null);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const isOpen = openOn === pathname;
  const isActive = items.some(({ to }) => to === pathname);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const closeOnOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpenOn(null);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setOpenOn(null);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  return (
    <li ref={rootRef} className={`m-nav-dropdown nav-item nav-dropdown${isOpen ? ' is-open' : ''}`}>
      <button
        ref={buttonRef}
        className={`nav-link dropdown-button${isActive ? ' is-active' : ''}`}
        type="button"
        aria-expanded={isOpen}
        aria-controls={id}
        onClick={() => setOpenOn(isOpen ? null : pathname)}>
        {label}
        <FaChevronDown className="dropdown-icon" aria-hidden="true" focusable="false" />
      </button>
      <ul className="dropdown-list" id={id} hidden={!isOpen}>
        {items.map((item) => (
          <li key={item.to}>
            <NavLink className="dropdown-link" to={item.to} onClick={() => setOpenOn(null)}>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </li>
  );
};

export default NavDropdown;
