import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="page-not-found">
      <div className="container py-5">
        <h1>Seite nicht gefunden</h1>
        <p>Diese Adresse gibt es (noch) nicht.</p>
        <Link to="/">Zur Startseite</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
