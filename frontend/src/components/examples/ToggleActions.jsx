import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';

const ToggleActions = (props) => {
  const { markers = false } = props;
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.box', {
          x: 300,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.box',
            start: 'top 60%',
            toggleActions: 'play none none reverse', // onEnter onLeave onEnterBack onLeaveBack
            markers,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="m-example-toggle-actions example-toggle-actions">
      <p className="box">Ich komme beim Scrollen</p>
    </div>
  );
};

export default ToggleActions;
