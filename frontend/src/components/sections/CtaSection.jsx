import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, MEDIA, MOTION, useGSAP } from '../../lib/gsap';
import TextSplit from '../ui/TextSplit';

const HEADLINE_LINES = ['Lass uns starten'];

const CtaSection = () => {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MEDIA.motionOk, () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          })
          .from('.char', {
            y: -80,
            rotation: -8,
            autoAlpha: 0,
            duration: MOTION.duration.base,
            ease: MOTION.ease.back,
            stagger: MOTION.stagger.chars,
          })
          .from('.cta-button', { opacity: 0, y: 24, duration: MOTION.duration.fast, ease: MOTION.ease.out }, '-=0.2');
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="m-cta-section cta-section" aria-labelledby="cta-title" data-bs-theme="light">
      <div className="container">
        <h2 id="cta-title" className="headline">
          <TextSplit lines={HEADLINE_LINES} by="char" accent="starten" />
        </h2>
        <Link className="cta-button" to="/login">
          Zum Login
        </Link>
      </div>
    </section>
  );
};

export default CtaSection;
