import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';

const ReducedMotion = (props) => {
  const { markers = false } = props;
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.box', {
          x: -300,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.box', start: 'top 60%', markers },
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="m-example-reduced-motion example-reduced-motion">
      <p className="box">Nur mit Bewegung</p>
    </div>
  );
};

export default ReducedMotion;
