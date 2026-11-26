import { useEffect, useRef, useState } from 'react';
import { FaCircleExclamation } from 'react-icons/fa6';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import QuizProgress from '../components/quiz/QuizProgress';
import QuizQuestion from '../components/quiz/QuizQuestion';
import QuizTimer from '../components/quiz/QuizTimer';
import { QUIZ_STATUS } from '../hooks/quizAttemptReducer';
import useCountdown from '../hooks/useCountdown';
import useQuizAttempt from '../hooks/useQuizAttempt';
import { countUnanswered, formatQuestionCount } from '../lib/quizRules';

const toPosition = (value, total) => {
  const position = Number.parseInt(value ?? '', 10);

  return Number.isInteger(position) ? Math.min(Math.max(position, 1), total) : 1;
};

const QuizAttemptPage = () => {
  const { attemptId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { status, attempt, clockOffsetMs, answers, unsavedIds, error, submitError, select, submit, reload } =
    useQuizAttempt(attemptId);
  const remainingMs = useCountdown(attempt?.deadline, clockOffsetMs);
  const [isConfirming, setIsConfirming] = useState(false);
  const headingRef = useRef(null);
  const confirmRef = useRef(null);
  const submitRef = useRef(null);
  const previousPosition = useRef(null);
  const wasConfirming = useRef(false);
  const hasAutoSubmitted = useRef(false);
  const questions = attempt?.questions ?? [];
  const position = questions.length > 0 ? toPosition(searchParams.get('frage'), questions.length) : null;
  const unanswered = countUnanswered(questions, answers);
  const isSubmitting = status === QUIZ_STATUS.SUBMITTING;
  const isTimeUp = remainingMs !== null && remainingMs <= 0;

  useEffect(() => {
    if (previousPosition.current !== null && previousPosition.current !== position) {
      headingRef.current?.focus();
    }
    previousPosition.current = position;
  }, [position]);

  useEffect(() => {
    if (isConfirming) {
      confirmRef.current?.focus();
    } else if (wasConfirming.current) {
      submitRef.current?.focus();
    }
    wasConfirming.current = isConfirming;
  }, [isConfirming]);

  useEffect(() => {
    if (isTimeUp && status === QUIZ_STATUS.READY && !hasAutoSubmitted.current) {
      hasAutoSubmitted.current = true;
      submit();
    }
  }, [isTimeUp, status, submit]);

  if (status === QUIZ_STATUS.SUBMITTED) {
    return <Navigate to={`/quiz/${attemptId}/result`} replace />;
  }

  const goTo = (next) => setSearchParams({ frage: String(next) });

  const handleSubmitClick = () => {
    if (unanswered > 0) {
      setIsConfirming(true);
      return;
    }
    submit();
  };

  const cancelConfirm = () => setIsConfirming(false);

  const question = position ? questions[position - 1] : null;

  return (
    <div className="page-quiz-attempt">
      <title>Test · JS-Kurs</title>
      <div className="container">
        <header className="attempt-header">
          <div className="attempt-heading">
            <h1 className="attempt-title">Dein Test</h1>
            {attempt && <p className="attempt-categories">{attempt.categories.map(({ name }) => name).join(' · ')}</p>}
          </div>
          <QuizTimer remainingMs={remainingMs} timeLimitSec={attempt?.timeLimitSec ?? 0} />
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
            <div className="attempt-submit">
              {submitError && (
                <div className="attempt-alert" role="alert">
                  <FaCircleExclamation aria-hidden="true" focusable="false" />
                  <p>{submitError}</p>
                </div>
              )}
              {isConfirming && unanswered > 0 ? (
                <div className="submit-confirm">
                  <p className="confirm-text" tabIndex={-1} ref={confirmRef}>
                    Du hast {formatQuestionCount(unanswered)} nicht beantwortet. Trotzdem abgeben?
                  </p>
                  <div className="attempt-actions">
                    <button className="primary-button" type="button" disabled={isSubmitting} onClick={submit}>
                      {isSubmitting ? 'Wird abgegeben …' : 'Ja, abgeben'}
                    </button>
                    <button className="secondary-button" type="button" onClick={cancelConfirm}>
                      Weiter beantworten
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="primary-button"
                  type="button"
                  ref={submitRef}
                  disabled={isSubmitting}
                  onClick={handleSubmitClick}>
                  {isSubmitting ? 'Wird abgegeben …' : 'Test abgeben'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizAttemptPage;
