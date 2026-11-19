import { useRef } from 'react';
import { gsap, MEDIA, MOTION, useGSAP } from '../../lib/gsap';
import SelectionFrame from '../ui/SelectionFrame';

const WIREFRAME_COLUMNS = [
  { id: 'nav', parts: ['bar', 'bar-short', 'radio', 'radio', 'radio', 'bar'] },
  { id: 'content', parts: ['block', 'bar', 'bar-short', 'bar'] },
  { id: 'settings', parts: ['bar-short', 'checkbox', 'checkbox', 'checkbox', 'bar', 'button'] },
];

const BrowserSection = () => {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ motionOk: MEDIA.motionOk, desktop: MEDIA.desktop }, (context) => {
        const { motionOk, desktop } = context.conditions;

        if (!motionOk) {
          return;
        }

        gsap
          .timeline({
            defaults: { ease: MOTION.ease.out, duration: MOTION.duration.base },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none reverse',
            },
          })
          .from('.edge-top, .edge-bottom', { scaleX: 0, duration: MOTION.duration.fast })
          .from('.edge-left, .edge-right', { scaleY: 0, duration: MOTION.duration.fast }, '<')
          .from('.handle', { scale: 0, stagger: MOTION.stagger.handles, duration: MOTION.duration.fast })
          .from('.headline', { opacity: 0, y: 24 }, '-=0.2')
          .from('.intro', { opacity: 0, y: 16 }, '-=0.5');

        if (desktop) {
          gsap.utils.toArray('.wf-column').forEach((column, index) => {
            gsap.fromTo(
              column,
              { yPercent: 12 - index * 8 },
              {
                yPercent: -12 + index * 8,
                ease: 'none',
                scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
              },
            );
          });
        }
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="m-browser-section browser-section" aria-labelledby="browser-title">
      <div className="wireframe" aria-hidden="true">
        {WIREFRAME_COLUMNS.map((column) => (
          <div className={`wf-column wf-column-${column.id}`} key={column.id}>
            {column.parts.map((part, index) => (
              <span className={`wf-part wf-${part}`} key={`${part}-${index}`} />
            ))}
          </div>
        ))}
      </div>
      <div className="container">
        <div className="content">
          <SelectionFrame>
            <h2 id="browser-title" className="headline">
              Dann kam der Browser – DOM, Events, APIs.
            </h2>
          </SelectionFrame>
          <p className="intro">
            Fenster, Events und Schnittstellen in Modul 4 – und in Modul 5 lernst du, jeden Fehler darin zu finden.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BrowserSection;
