import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';

const Parallax = (props) => {
  const { markers = false } = props;
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
              markers,
            },
          })
          .to('.layer-back', { yPercent: -20 }, 0)
          .to('.layer-front', { yPercent: -60 }, 0);
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="m-example-parallax example-parallax">
      <div className="layer layer-back" aria-hidden="true">
        <span className="shape" />
        <span className="shape" />
      </div>
      <div className="layer layer-front" aria-hidden="true">
        <span className="shape" />
        <span className="shape" />
      </div>
      <p className="caption">Hinten langsam, vorne schnell</p>
    </div>
  );
};

export default Parallax;
