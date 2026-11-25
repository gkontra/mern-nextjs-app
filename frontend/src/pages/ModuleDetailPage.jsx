import { Link, useParams } from 'react-router-dom';
import { MODULES_STATUS, useModule } from '../stores/modules';

const ModuleDetailPage = () => {
  const { moduleId } = useParams();
  const { module, status, error } = useModule(Number(moduleId));
  const isLoading = status === MODULES_STATUS.IDLE || status === MODULES_STATUS.LOADING;

  return (
    <div className="page-module-detail">
      <div className="container">
        {isLoading && <p role="status">Modul wird geladen …</p>}
        {status === MODULES_STATUS.ERROR && <p role="alert">{error}</p>}
        {status === MODULES_STATUS.SUCCESS && module && (
          <article className="detail">
            <div className="detail-text">
              <p className="detail-label">Modul {String(module.moduleId).padStart(2, '0')}</p>
              <h1 className="detail-title">{module.title}</h1>
              <p className="detail-description">{module.description}</p>
              <ul className="detail-tags" aria-label="Themen">
                {module.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </div>
            <img
              className="detail-image"
              src={`/img/modules/${module.imageKey}.webp`}
              alt=""
              width="1280"
              height="1024"
            />
          </article>
        )}
        {status === MODULES_STATUS.SUCCESS && !module && <h1 className="detail-title">Modul nicht gefunden</h1>}
        <Link className="back-link" to="/#modules">
          <span aria-hidden="true">←</span> Alle Module
        </Link>
      </div>
    </div>
  );
};

export default ModuleDetailPage;
