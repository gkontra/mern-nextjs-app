import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import QuizResultItem from '../components/quiz/QuizResultItem';
import QuizSummary from '../components/quiz/QuizSummary';
import { isRequestCanceled } from '../services/apiError';
import { fetchAttempt } from '../services/quizService';

const NOT_LOADED = { attemptId: null, attempt: null, error: null };

const QuizResultPage = () => {
  const { attemptId } = useParams();
  const [result, setResult] = useState(NOT_LOADED);
  const [loadCount, setLoadCount] = useState(0);
  const headingRef = useRef(null);
  const isLoading = result.attemptId !== attemptId;
  const { attempt, error } = result;

  useEffect(() => {
    const controller = new AbortController();

    fetchAttempt(attemptId, { signal: controller.signal }).then(
      (loaded) => setResult({ attemptId, attempt: loaded, error: null }),
      (loadError) => {
        if (!isRequestCanceled(loadError)) {
          setResult({ attemptId, attempt: null, error: loadError.message });
        }
      },
    );

    return () => controller.abort();
  }, [attemptId, loadCount]);

  useEffect(() => {
    if (attempt) {
      headingRef.current?.focus();
    }
  }, [attempt]);

  if (!isLoading && attempt?.status === 'running') {
    return <Navigate to={`/quiz/${attemptId}`} replace />;
  }

  const retry = () => {
    setResult(NOT_LOADED);
    setLoadCount((count) => count + 1);
  };

  return (
    <div className="page-quiz-result">
      <title>Auswertung · JS-Kurs</title>
      <div className="container">
        <h1 className="result-title" tabIndex={-1} ref={headingRef}>
          Deine <span className="accent">Auswertung</span>
        </h1>
        {isLoading && <p role="status">Auswertung wird geladen …</p>}
        {!isLoading && error && (
          <div className="result-error">
            <p role="alert">{error}</p>
            <div className="result-actions">
              <button className="retry-button" type="button" onClick={retry}>
                Erneut versuchen
              </button>
              <Link to="/quiz">Zur Testauswahl</Link>
            </div>
          </div>
        )}
        {!isLoading && attempt && (
          <>
            <QuizSummary attempt={attempt} />
            <section className="result-details" aria-labelledby="details-title">
              <h2 className="details-title" id="details-title">
                Deine Antworten
              </h2>
              <ol className="result-list">
                {attempt.questions.map((question, index) => (
                  <li key={question.id}>
                    <QuizResultItem question={question} position={index + 1} />
                  </li>
                ))}
              </ol>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizResultPage;
