import { useLocation } from 'react-router-dom';

import HeaderMain from './components/headers/HeaderMain';
import NavMain from './components/navs/NavMain';
import FooterMain from './components/footers/FooterMain';
import Router from './routes/Router';
import ScrollToTop from './components/routes/ScrollToTop';
import ModulesProvider from './stores/modules/ModulesStore';
import AuthProvider from './stores/auth/AuthStore';

const PATHS_WITHOUT_HEADER = ['/', '/login', '/register', '/profile'];
const SECTIONS_WITHOUT_HEADER = ['/inhalte', '/docs'];

const isInSection = (pathname, section) => pathname === section || pathname.startsWith(`${section}/`);

function App() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const hasHeader =
    !PATHS_WITHOUT_HEADER.includes(pathname) &&
    !SECTIONS_WITHOUT_HEADER.some((section) => isInSection(pathname, section));
  return (
    <AuthProvider>
      <ModulesProvider>
        <ScrollToTop />
        {hasHeader && <HeaderMain />}
        <NavMain overlay={isHome} />
        <main id="main">
          <Router />
        </main>
        <FooterMain />
      </ModulesProvider>
    </AuthProvider>
  );
}
export default App;
