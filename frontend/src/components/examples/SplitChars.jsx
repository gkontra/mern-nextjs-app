import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';
import TextSplit from '../ui/TextSplit';

const HEADLINE_LINES = ['Buchstabe für Buchstabe'];

const SplitChars = (props) => {
  const { markers = false } = props;
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.char', {
          yPercent: 100,
          opacity: 0,
          duration: 0.4,
          ease: 'power3.out',
          stagger: 0.03,
          scrollTrigger: {
            trigger: '.headline',
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
    <div ref={containerRef} className="m-example-split-chars example-split-chars">
      <h3 className="headline">
        <TextSplit lines={HEADLINE_LINES} by="char" />
      </h3>
    </div>
  );
};

export default SplitChars;
