import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';

const Responsive = (props) => {
  const { markers = false } = props;
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 992px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.from('.box', {
          x: -240,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.box',
            start: 'top 75%',
            toggleActions: 'play none none reverse',
            markers,
          },
        });
      });

      mm.add('(max-width: 991.98px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.from('.box', {
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.box',
            start: 'top 75%',
            toggleActions: 'play none none reverse',
            markers,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="m-example-responsive example-responsive">
      <p className="box">
        <span className="desktop">Desktop: von links</span>
        <span className="mobile">Mobil: nur einblenden</span>
      </p>
    </div>
  );
};

export default Responsive;
