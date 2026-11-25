import { useRef } from 'react';
import { gsap, MEDIA, MOTION, ScrollTrigger, useGSAP } from '../../lib/gsap';
import { MODULES_STATUS, useModulesActions, usePublishedModules } from '../../stores/modules';
import ModuleCard from '../cards/ModuleCard';
import MultiplayerCursor from '../ui/MultiplayerCursor';

const CURSORS = [
  {
    name: 'Du',
    color: 'teal',
    path: [
      [0, 0],
      [0.09, 0.05],
      [0.02, 0.11],
      [0.1, 0.18],
      [0.01, 0.26],
    ],
  },
  {
    name: 'Trainer',
    color: 'amber',
    path: [
      [0, 0],
      [-0.06, 0.06],
      [0.01, 0.12],
      [-0.08, 0.17],
      [0, 0.24],
    ],
  },
  {
    name: 'Team',
    color: 'plum',
    path: [
      [0, 0],
      [0.06, -0.06],
      [0.43, -0.1],
      [0.5, -0.02],
      [0.08, 0.05],
    ],
  },
];

const toPixels = (points, stage) => points.map(([x, y]) => ({ x: x * stage.offsetWidth, y: y * stage.offsetHeight }));

const ModulesSection = () => {
  const sectionRef = useRef(null);
  const { modules, status, error } = usePublishedModules();
  const { reload } = useModulesActions();
  const isReady = status === MODULES_STATUS.SUCCESS;

  useGSAP(
    () => {
      if (!isReady) {
        return undefined;
      }

      const mm = gsap.matchMedia();

      mm.add({ motionOk: MEDIA.motionOk, wide: MEDIA.wide }, (context) => {
        const { motionOk, wide } = context.conditions;

        if (!motionOk) {
          return;
        }

        gsap.utils.toArray('.modules-grid > li').forEach((item) => {
          gsap.from(item, {
            opacity: 0,
            y: 60,
            duration: MOTION.duration.slow,
            ease: MOTION.ease.out,
            scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none reverse' },
          });
        });

        if (wide) {
          const stage = sectionRef.current.querySelector('.stage');
          const cursors = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: stage,
              start: 'top bottom',
              end: 'bottom top',
              scrub: MOTION.scrub,
              invalidateOnRefresh: true,
            },
          });

          gsap.utils.toArray('.cursor-slot').forEach((slot, index) => {
            cursors.to(
              slot,
              { motionPath: () => ({ path: toPixels(CURSORS[index].path, stage), curviness: MOTION.curviness }) },
              0,
            );
          });
        }
      });

      ScrollTrigger.refresh();

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [isReady], revertOnUpdate: true },
  );

  return (
    <section
      ref={sectionRef}
      id="modules"
      className="m-modules-section modules-section"
      aria-labelledby="modules-title"
      data-bs-theme="light">
      <div className="container">
        <h2 id="modules-title" className="headline">
          Die 7 Module
        </h2>
        {!isReady && status !== MODULES_STATUS.ERROR && (
          <p className="modules-status" role="status">
            Module werden geladen …
          </p>
        )}
        {status === MODULES_STATUS.ERROR && (
          <div className="modules-status">
            <p role="alert">{error}</p>
            <button className="retry-button" type="button" onClick={reload}>
              Erneut versuchen
            </button>
          </div>
        )}
        {isReady && (
          <div className="stage">
            <ul className="modules-grid">
              {modules.map((module) => (
                <li key={module.moduleId}>
                  <ModuleCard module={module} />
                </li>
              ))}
            </ul>
            {CURSORS.map((cursor, index) => (
              <div className={`cursor-slot cursor-slot-${index + 1}`} key={cursor.name}>
                <MultiplayerCursor name={cursor.name} color={cursor.color} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ModulesSection;
