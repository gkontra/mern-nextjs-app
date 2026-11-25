import { Link } from 'react-router-dom';

const formatModuleNumber = (moduleId) => String(moduleId).padStart(2, '0');

const ModuleCard = (props) => {
  const { module } = props;

  return (
    <article className="m-module-card module-card">
      <span className="frame-label">Modul {formatModuleNumber(module.moduleId)}</span>
      <div className="surface">
        <img
          className="image"
          src={`/img/modules/${module.imageKey}.webp`}
          alt=""
          width="1280"
          height="1024"
          loading="lazy"
          decoding="async"
        />
        <div className="body">
          <h3 className="title">
            <Link className="link" to={`/modules/${module.moduleId}`}>
              {module.title}
            </Link>
          </h3>
          <p className="description">{module.description}</p>
          <ul className="tags" aria-label="Themen">
            {module.tags.map((tag) => (
              <li className="tag" key={tag}>
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
};

export default ModuleCard;
