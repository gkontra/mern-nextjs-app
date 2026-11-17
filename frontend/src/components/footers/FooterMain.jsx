import { Link } from 'react-router-dom';
import NavSocialMedia from '../navs/NavSocialMedia';

const FOOTER_LINKS = [
  { to: '/', label: 'Start' },
  { to: '/#modules', label: 'Module' },
  { to: '/contact', label: 'Kontakt' },
];

const FooterMain = () => {
  return (
    <footer className="m-footer-main footer-main">
      <div className="container">
        <div className="row gy-4">
          <div className="col-12 col-md-5">
            <p className="footer-brand">JS-Kurs</p>
            <p className="footer-text">
              Ein MERN-Kurs in sieben Modulen: von der ersten Zeile JavaScript bis zur eigenen Full-Stack-App mit
              MongoDB, Express, React und Node.js.
            </p>
          </div>
          <div className="col-12 col-md-3">
            <h2 className="footer-heading">Seiten</h2>
            <nav aria-label="Fußzeile">
              <ul className="footer-links">
                {FOOTER_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="col-12 col-md-4">
            <h2 className="footer-heading">Social Media</h2>
            <NavSocialMedia />
          </div>
        </div>
        <p className="copyright">© 2026 JS-Kurs</p>
      </div>
    </footer>
  );
};

export default FooterMain;
