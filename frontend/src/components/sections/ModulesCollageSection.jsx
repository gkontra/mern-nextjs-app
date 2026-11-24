import { MODULES_STATUS, usePublishedModules } from '../../stores/modules';
import CommentCard from '../ui/CommentCard';
import MultiplayerCursor from '../ui/MultiplayerCursor';

const PLACEHOLDER_TILES = Array.from({ length: 7 }, (_, index) => ({ key: `placeholder-${index}` }));

const ModulesCollageSection = () => {
  const { modules, status } = usePublishedModules();
  const isReady = status === MODULES_STATUS.SUCCESS;
  const tiles = isReady ? modules.map((module) => ({ key: module.moduleId, module })) : PLACEHOLDER_TILES;

  return (
    <section className="m-modules-collage-section modules-collage-section" aria-labelledby="collage-title">
      <div className="container">
        <h2 id="collage-title" className="visually-hidden">
          Sieben Module auf einen Blick
        </h2>
        <div className="stage">
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
