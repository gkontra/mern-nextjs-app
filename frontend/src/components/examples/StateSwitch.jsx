import { useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap';

const StateSwitch = (props) => {
  const { markers = false } = props;
  const containerRef = useRef(null);
  const [state, setState] = useState('A');

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          motionOk: '(prefers-reduced-motion: no-preference)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const timeline = gsap.timeline({ paused: true }).to('.box', {
            xPercent: 150,
            rotation: 90,
            duration: context.conditions.motionOk ? 0.6 : 0,
            ease: 'power3.out',
          });

          ScrollTrigger.create({
            trigger: containerRef.current,
            start: 'center center',
            markers,
            onEnter: () => {
              setState('B');
              timeline.play();
            },
            onLeaveBack: () => {
              setState('A');
              timeline.reverse();
            },
          });

          return () => setState('A');
        },
      );

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="m-example-state-switch example-state-switch">
      <div className="stage">
        <span className="box" aria-hidden="true" />
        <p className="label" aria-live="polite">
          Zustand {state}
        </p>
      </div>
    </div>
  );
};

export default StateSwitch;
