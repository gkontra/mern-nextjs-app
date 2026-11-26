import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import QuizSetupForm from '../components/forms/QuizSetupForm';
import { formatDuration } from '../lib/formatDuration';
import { secondsUntilDeadline } from '../lib/quizRules';
import { API_ERROR_CODE, isRequestCanceled } from '../services/apiError';
import { fetchAttempt, fetchCategories, fetchMyAttempts, startAttempt } from '../services/quizService';

const LOADING = { status: 'loading', categories: [], running: null, error: null };

const loadRunningAttempt = async (signal) => {
  const history = await fetchMyAttempts({ signal });
  const running = history.find(({ status }) => status === 'running');

  if (!running) {
    return null;
  }

  const attempt = await fetchAttempt(running.id, { signal });

  return attempt.status === 'running' ? { id: attempt.id, remainingSec: secondsUntilDeadline(attempt) } : null;
};

const QuizSetupPage = () => {
  const navigate = useNavigate();
  const [state, setState] = useState(LOADING);
  const [loadCount, setLoadCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    Promise.all([fetchCategories({ signal }), loadRunningAttempt(signal)]).then(
      ([categories, running]) => setState({ status: 'ready', categories, running, error: null }),
      (error) => {
        if (!isRequestCanceled(error)) {
          setState({ ...LOADING, status: 'error', error: error.message });
        }
      },
    );

    return () => controller.abort();
  }, [loadCount]);

  const retry = () => {
    setState(LOADING);
    setLoadCount((count) => count + 1);
  };

  const handleStart = async (values) => {
    try {
      const attempt = await startAttempt(values);
      navigate(`/quiz/${attempt.id}?frage=1`);
    } catch (error) {
      if (error.code === API_ERROR_CODE.ATTEMPT_RUNNING) {
        loadRunningAttempt().then(
          (running) => setState((current) => ({ ...current, running })),
          () => null,
        );
      }
      throw error;
    }
  };

  const { status, categories, running, error } = state;

  return (
    <div className="page-quiz-setup">
      <title>Quiz · JS-Kurs</title>
      <div className="container">
        <h1 className="setup-title">
          Teste dein <span className="accent">Wissen</span>
        </h1>
        <p className="setup-intro">Wähle Kategorien, Anzahl und Zeitlimit. Die Fragen zieht der Server zufällig.</p>
        {running && (
          <div className="setup-running">
            <p>Du hast einen laufenden Test (noch {formatDuration(running.remainingSec)}).</p>
            <Link to={`/quiz/${running.id}`}>Fortsetzen</Link>
          </div>
        )}
        {status === 'loading' && <p role="status">Kategorien werden geladen …</p>}
        {status === 'error' && (
          <div className="setup-error">
            <p role="alert">{error}</p>
            <button className="retry-button" type="button" onClick={retry}>
              Erneut versuchen
            </button>
          </div>
        )}
        {status === 'ready' && <QuizSetupForm categories={categories} onStart={handleStart} />}
      </div>
    </div>
  );
};

export default QuizSetupPage;
