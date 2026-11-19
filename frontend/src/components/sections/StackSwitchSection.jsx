import { useRef, useState } from 'react';
import { gsap, MEDIA, MOTION, ScrollTrigger, useGSAP } from '../../lib/gsap';
import SegmentToggle from '../ui/SegmentToggle';

const DATABASES = [
  {
    id: 'mongodb',
    name: 'MongoDB',
    logo: '/img/logos/mongodb-logo-white.svg',
    width: 1102,
    height: 278,
    logoSize: 0.58,
    subline: 'erst MERN – mit Express und REST',
  },
  {
    id: 'convex',
    name: 'Convex',
    logo: '/img/logos/convex-logo-white.svg',
    width: 382,
    height: 146,
    logoSize: 1,
    subline: 'dann Next.js – mit Server Actions',
  },
];

const StackSwitchSection = () => {
  const sectionRef = useRef(null);
  const [active, setActive] = useState('mongodb');

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ motionOk: MEDIA.motionOk, reduceMotion: MEDIA.reduceMotion }, (context) => {
        const timeline = gsap
          .timeline({ paused: true, defaults: { ease: MOTION.ease.inOut, duration: MOTION.duration.base } })
          .fromTo('.indicator', { xPercent: 0 }, { xPercent: 100 })
          .fromTo('.glow.is-first', { autoAlpha: 1 }, { autoAlpha: 0 }, 0)
          .fromTo('.glow.is-second', { autoAlpha: 0 }, { autoAlpha: 1 }, 0)
          .fromTo('.segment-mongodb .logo', { opacity: 1 }, { opacity: MOTION.dimmedOpacity }, 0)
          .fromTo('.segment-convex .logo', { opacity: MOTION.dimmedOpacity }, { opacity: 1 }, 0)
          .fromTo('.variant-mongodb', { yPercent: 0, autoAlpha: 1 }, { yPercent: -60, autoAlpha: 0 }, 0)
          .fromTo('.variant-convex', { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1 }, 0);

        if (!context.conditions.motionOk) {
          timeline.progress(1);
          setActive('convex');

          return () => setActive('mongodb');
        }

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'center 55%',
          markers: false,
          onEnter: () => {
            setActive('convex');
            timeline.play();
          },
          onLeaveBack: () => {
            setActive('mongodb');
            timeline.reverse();
          },
        });

        return undefined;
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="m-stack-switch-section stack-switch-section"
      aria-labelledby="stack-switch-title"
      data-active={active}>
      <div className="container">
        <SegmentToggle label="Datenbank" items={DATABASES} active={active} />
        <h2 id="stack-switch-title" className="headline">
          Dann bauen wir Full-Stack{' '}
          <span className="subline">
            {DATABASES.map((database) => (
              <span
                className={`variant variant-${database.id}`}
                key={database.id}
                aria-hidden={database.id === active ? undefined : 'true'}>
                {database.subline}
              </span>
            ))}
          </span>
        </h2>
      </div>
    </section>
  );
};

export default StackSwitchSection;
