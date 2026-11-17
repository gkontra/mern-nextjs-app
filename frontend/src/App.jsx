import { useLocation } from 'react-router-dom';

import HeaderMain from './components/headers/HeaderMain';
import NavMain from './components/navs/NavMain';
import FooterMain from './components/footers/FooterMain';
import Router from './routes/Router';

const PATHS_WITHOUT_HEADER = ['/'];

function App() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <>
      {!PATHS_WITHOUT_HEADER.includes(pathname) && <HeaderMain />}
      <NavMain overlay={isHome} />
      <main id="main">
        <Router />
      </main>
      <FooterMain />
    </>
  );
}
export default App;
