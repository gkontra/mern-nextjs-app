import { useEffect, useRef } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import QuizProgress from '../components/quiz/QuizProgress';
import QuizQuestion from '../components/quiz/QuizQuestion';
import { QUIZ_STATUS } from '../hooks/quizAttemptReducer';
import useQuizAttempt from '../hooks/useQuizAttempt';

const toPosition = (value, total) => {
  const position = Number.parseInt(value ?? '', 10);

  return Number.isInteger(position) ? Math.min(Math.max(position, 1), total) : 1;
};

const QuizAttemptPage = () => {
  const { attemptId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { status, attempt, answers, unsavedIds, error, select, reload } = useQuizAttempt(attemptId);
  const headingRef = useRef(null);
  const previousPosition = useRef(null);
  const questions = attempt?.questions ?? [];
  const position = questions.length > 0 ? toPosition(searchParams.get('frage'), questions.length) : null;

  useEffect(() => {
    if (previousPosition.current !== null && previousPosition.current !== position) {
      headingRef.current?.focus();
    }
    previousPosition.current = position;
  }, [position]);

  const goTo = (next) => setSearchParams({ frage: String(next) });

  const question = position ? questions[position - 1] : null;

  return (
    <div className="page-quiz-attempt">
      <title>Test · JS-Kurs</title>
      <div className="container">
        <header className="attempt-header">
          <h1 className="attempt-title">Dein Test</h1>
          {attempt && <p className="attempt-categories">{attempt.categories.map(({ name }) => name).join(' · ')}</p>}
        </header>
        {status === QUIZ_STATUS.LOADING && <p role="status">Test wird geladen …</p>}
        {status === QUIZ_STATUS.ERROR && (
          <div className="attempt-error">
            <p role="alert">{error}</p>
            <div className="attempt-actions">
              <button className="secondary-button" type="button" onClick={reload}>
                Erneut versuchen
              </button>
              <Link to="/quiz">Zur Testauswahl</Link>
            </div>
          </div>
        )}
        {question && (
          <>
            <QuizQuestion
              question={question}
              position={position}
              total={questions.length}
              selectedAnswerIds={answers[question.id] ?? []}
              onSelect={select}
              headingRef={headingRef}
            />
            <div className="attempt-steps">
              <button
                className="secondary-button"
                type="button"
                disabled={position === 1}
                onClick={() => goTo(position - 1)}>
                Zurück
              </button>
              <button
                className="secondary-button"
                type="button"
                disabled={position === questions.length}
                onClick={() => goTo(position + 1)}>
                Weiter
              </button>
            </div>
            {unsavedIds.length > 0 && (
              <p className="attempt-unsaved" role="status">
                Mindestens eine Antwort konnte nicht gespeichert werden. Beim Abgeben wird alles mitgeschickt.
              </p>
            )}
            <QuizProgress questions={questions} answers={answers} current={position} onSelect={goTo} />
          </>
        )}
      </div>
    </div>
  );
};

export default QuizAttemptPage;
