import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';

const ScrubProgress = (props) => {
  const { markers = false } = props;
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.bar', {
          scaleX: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top center',
            end: 'bottom center',
            scrub: true,
            markers,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="m-example-scrub-progress example-scrub-progress">
      <div className="track" aria-hidden="true">
        <div className="bar" />
      </div>
    </div>
  );
};

export default ScrubProgress;
