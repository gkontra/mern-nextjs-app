import { useRef } from 'react';
import { gsap, MEDIA, MOTION, useGSAP } from '../../lib/gsap';
import TextSplit from '../ui/TextSplit';

const HEADLINE_LINES = ['Lerne JavaScript –', 'von der ersten Zeile bis React'];

const HeroSection = () => {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ motionOk: MEDIA.motionOk, desktop: MEDIA.desktop }, (context) => {
        const { motionOk, desktop } = context.conditions;

        if (!motionOk) {
          return;
        }

        const intro = gsap
          .timeline({ defaults: { ease: MOTION.ease.out, duration: MOTION.duration.slow } })
          .from('.word-inner', { yPercent: 100, autoAlpha: 0, stagger: MOTION.stagger.words });

        if (desktop) {
          intro.from('.mouse, .scroll-label', { autoAlpha: 0, y: 16, duration: MOTION.duration.base }, '-=0.6');
        }

        intro.to('.mouse-wheel', {
          y: 8,
          duration: 0.6,
          ease: MOTION.ease.inOut,
          repeat: 3,
          yoyo: true,
        });

        gsap.fromTo(
          '.scroll-hint',
          { autoAlpha: 1 },
          {
            autoAlpha: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: '25% top',
              scrub: true,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="m-hero-section hero-section" aria-labelledby="hero-title">
      <div className="container">
        <h1 id="hero-title" className="headline">
          <TextSplit lines={HEADLINE_LINES} accent="React" />
        </h1>
      </div>
      <p className="scroll-hint">
        <span className="mouse" aria-hidden="true">
          <span className="mouse-wheel" />
        </span>
        <span className="scroll-label">Scroll</span>
      </p>
    </section>
  );
};

export default HeroSection;
