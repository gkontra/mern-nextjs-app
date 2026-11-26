import { FaCheck, FaCircleCheck, FaCircleInfo, FaCircleMinus, FaCircleXmark } from 'react-icons/fa6';
import RichText from './RichText';

const OUTCOMES = {
  correct: { label: 'Richtig', Icon: FaCircleCheck },
  wrong: { label: 'Falsch', Icon: FaCircleXmark },
  unanswered: { label: 'Nicht beantwortet', Icon: FaCircleMinus },
};

const DEFAULT_SUCCESS_MESSAGE = 'Richtig.';
const DEFAULT_ERROR_MESSAGE = 'Leider nicht richtig – sieh dir die markierten Antworten an.';

const toFeedback = ({ outcome, successMessage, errorMessage }) =>
  outcome === 'correct' ? successMessage || DEFAULT_SUCCESS_MESSAGE : errorMessage || DEFAULT_ERROR_MESSAGE;

const answerClassName = (isSelected, isCorrect) =>
  ['result-answer', isSelected && 'is-selected', isCorrect && 'is-correct'].filter(Boolean).join(' ');

const QuizResultItem = (props) => {
  const { question, position } = props;
  const outcome = OUTCOMES[question.outcome] ?? OUTCOMES.unanswered;
  const { Icon } = outcome;
  const titleId = `result-${question.id}-title`;

  return (
    <article className={`m-quiz-result-item quiz-result-item is-${question.outcome}`} aria-labelledby={titleId}>
      <header className="item-header">
        <h3 className="item-title" id={titleId}>
          Frage {position}
        </h3>
        <p className="item-outcome">
          <Icon aria-hidden="true" focusable="false" />
          {outcome.label}
        </p>
      </header>
      {question.removed ? (
        <p className="item-removed">Diese Frage wurde inzwischen entfernt.</p>
      ) : (
        <>
          <RichText as="div" className="item-text" html={question.text} />
          {question.code && (
            <pre className="item-code">
              <code>{question.code}</code>
            </pre>
          )}
          <p className="item-feedback">{toFeedback(question)}</p>
          <ul className="result-answers">
            {question.answers.map((answer) => {
              const isSelected = question.selectedAnswerIds.includes(answer.id);

              return (
                <li className={answerClassName(isSelected, answer.isCorrect)} key={answer.id}>
                  <RichText as="div" className="answer-text" html={answer.text} />
                  {(isSelected || answer.isCorrect) && (
                    <p className="answer-markers">
                      {isSelected && <span className="marker is-selected">Deine Wahl</span>}
                      {answer.isCorrect && (
                        <span className="marker is-correct">
                          <FaCheck aria-hidden="true" focusable="false" />
                          Richtige Antwort
                        </span>
                      )}
                    </p>
                  )}
                  {answer.explanation && <p className="answer-explanation">{answer.explanation}</p>}
                </li>
              );
            })}
          </ul>
          {question.note && (
            <div className="item-note">
              <p className="note-title">
                <FaCircleInfo aria-hidden="true" focusable="false" />
                Zur Info
              </p>
              <RichText as="div" className="note-text" html={question.note} />
            </div>
          )}
        </>
      )}
    </article>
  );
};

export default QuizResultItem;
