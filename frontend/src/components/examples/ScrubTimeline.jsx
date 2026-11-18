import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';

const ScrubTimeline = (props) => {
  const { markers = false } = props;
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // const tl = gsap.timeline();
        // tl.from().from().fromTo().to()

        gsap
          .timeline({
            scrollTrigger: {
              trigger: '.stage',
              start: 'top 80%',
              end: 'bottom 20%',
              scrub: true,
              markers,
            },
          })
          .from('.box-1', { y: 80, opacity: 0 })
          .from('.box-2', { y: 80, opacity: 0 })
          .from('.box-3', { y: 80, opacity: 0 }, '<0.25');
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="m-example-scrub-timeline example-scrub-timeline">
      <div className="stage">
        <p className="box box-1">Eins</p>
        <p className="box box-2">Zwei</p>
        <p className="box box-3">Drei</p>
      </div>
    </div>
  );
};

export default ScrubTimeline;
