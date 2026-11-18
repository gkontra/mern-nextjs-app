import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // const { } = props;
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null;

    if (target) {
      target.scrollIntoView({ behavior: 'instant' });
      return;
    }

    window.scrollTo({ top: 0, behavior: 'instant' });

    return () => {};
  }, [pathname, hash]);

  return null;
};
export default ScrollToTop;

/*
**`useLayoutEffect` statt `useEffect`:** läuft *bevor* der Browser malt und *bevor* die
  Animationen ihre Positionen messen. Mit `useEffect` sähe man kurz die alte
  Scrollposition aufblitzen.
 */
