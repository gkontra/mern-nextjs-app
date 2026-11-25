import { useRef } from 'react';
import { gsap, MEDIA, MOTION, ScrollTrigger, useGSAP } from '../../lib/gsap';
import { MODULES_STATUS, usePublishedModules } from '../../stores/modules';
import CommentCard from '../ui/CommentCard';
import MultiplayerCursor from '../ui/MultiplayerCursor';

const PLACEHOLDER_TILES = Array.from({ length: 7 }, (_, index) => ({ key: `placeholder-${index}` }));

const ModulesCollageSection = () => {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const { modules, status } = usePublishedModules();
  const isReady = status === MODULES_STATUS.SUCCESS;
  const tiles = isReady ? modules.map((module) => ({ key: module.moduleId, module })) : PLACEHOLDER_TILES;

  useGSAP(
    () => {
      if (!isReady) {
        return undefined;
      }

      const mm = gsap.matchMedia();

      mm.add({ motionOk: MEDIA.motionOk, desktop: MEDIA.desktop }, (context) => {
        const { motionOk, desktop } = context.conditions;

        if (!motionOk) {
          return;
        }

        const timeline = gsap.timeline({
          defaults: { ease: MOTION.ease.out },
          scrollTrigger: {
            trigger: stageRef.current,
            start: 'top 75%',
            end: desktop ? 'center center' : 'bottom 85%',
            scrub: 0.6,
          },
        });

        timeline
          .from('.tile', { opacity: 0, scale: 0.9, stagger: MOTION.stagger.tiles })
          .from('.tile-image', { scale: 1.25, stagger: MOTION.stagger.tiles }, 0)
          .from('.comment-slot', { opacity: 0, y: 60 });

        if (desktop) {
          timeline.from('.cursor-slot', { autoAlpha: 0, x: -80, y: 40 });
        }
      });

      const images = gsap.utils.toArray('.tile-image');
      Promise.all(images.map((image) => image.decode().catch(() => null))).then(() => ScrollTrigger.refresh());

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [isReady], revertOnUpdate: true },
  );

  return (
    <section
      ref={sectionRef}
      className="m-modules-collage-section modules-collage-section"
      aria-labelledby="collage-title">
      <div className="container">
        <h2 id="collage-title" className="visually-hidden">
          Sieben Module auf einen Blick
        </h2>
        <div ref={stageRef} className="stage">
          <ul className="collage" aria-busy={!isReady}>
            {tiles.map(({ key, module }) => (
              <li className="tile" key={key}>
                {module && (
                  <img
                    className="tile-image"
                    src={`/img/modules/${module.imageKey}.webp`}
                    alt={`Modul ${module.moduleId}: ${module.title}`}
                    width="1280"
                    height="1024"
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </li>
            ))}
          </ul>
          <div className="comment-slot">
            <CommentCard
              author="Trainer · Modul 1"
              text="Alles beginnt mit einer Zeile JavaScript – und mit der Frage, warum sie funktioniert."
            />
            <div className="cursor-slot">
              <MultiplayerCursor name="Trainer" color="amber" />
            </div>
          </div>
        </div>
        {status === MODULES_STATUS.ERROR && (
          <p className="collage-error">Die Modulbilder konnten gerade nicht geladen werden.</p>
        )}
      </div>
    </section>
  );
};

export default ModulesCollageSection;
