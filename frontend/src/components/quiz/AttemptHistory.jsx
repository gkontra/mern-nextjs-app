import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isRequestCanceled } from '../../services/apiError';
import { fetchMyAttempts } from '../../services/quizService';

const DATE_TIME = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short' });
const PERCENT = new Intl.NumberFormat('de-DE', { style: 'percent', maximumFractionDigits: 0 });
const LOADING = { status: 'loading', attempts: [], error: null };

const formatResult = ({ correct, total }) => `${correct}/${total} · ${PERCENT.format(total > 0 ? correct / total : 0)}`;

const AttemptHistory = () => {
  const [state, setState] = useState(LOADING);
  const [loadCount, setLoadCount] = useState(0);
  const { status, attempts, error } = state;

  useEffect(() => {
    const controller = new AbortController();

    fetchMyAttempts({ signal: controller.signal }).then(
      (loaded) => setState({ status: 'ready', attempts: loaded, error: null }),
      (loadError) => {
        if (!isRequestCanceled(loadError)) {
          setState({ ...LOADING, status: 'error', error: loadError.message });
        }
      },
    );

    return () => controller.abort();
  }, [loadCount]);

  const retry = () => {
    setState(LOADING);
    setLoadCount((count) => count + 1);
  };

  return (
    <div className="m-attempt-history attempt-history">
      {status === 'loading' && <p role="status">Verlauf wird geladen …</p>}
      {status === 'error' && (
        <div className="history-error">
          <p role="alert">{error}</p>
          <button className="retry-button" type="button" onClick={retry}>
            Erneut versuchen
          </button>
        </div>
      )}
      {status === 'ready' && attempts.length === 0 && (
        <div className="history-empty">
          <p>Du hast noch keinen Test gemacht.</p>
          <Link to="/quiz">Ersten Test starten</Link>
        </div>
      )}
      {status === 'ready' && attempts.length > 0 && (
        <ol className="history-list">
          {attempts.map((attempt) => {
            const date = DATE_TIME.format(new Date(attempt.startedAt));
            const isRunning = attempt.status === 'running';

            return (
              <li className={isRunning ? 'history-item is-running' : 'history-item'} key={attempt.id}>
                <p className="history-date">
                  <time dateTime={attempt.startedAt}>{date}</time>
                </p>
                <p className="history-categories">{attempt.categories.map(({ name }) => name).join(', ')}</p>
                <p className="history-result">{isRunning ? 'läuft' : attempt.result && formatResult(attempt.result)}</p>
                <Link className="history-link" to={isRunning ? `/quiz/${attempt.id}` : `/quiz/${attempt.id}/result`}>
                  {isRunning ? 'Fortsetzen' : 'Auswertung'}
                  <span className="visually-hidden"> (Test vom {date})</span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

export default AttemptHistory;
