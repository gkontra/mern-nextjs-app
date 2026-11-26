import RichText from './RichText';

const QuizQuestion = (props) => {
  const { question, position, total, selectedAnswerIds, onSelect, headingRef } = props;
  const hintId = `question-${question.id}-hint`;
  const positionLabel = `Frage ${position} von ${total}`;

  if (question.removed) {
    return (
      <div className="m-quiz-question quiz-question">
        <p className="question-position" tabIndex={-1} ref={headingRef}>
          {positionLabel}
        </p>
        <p className="question-removed">Diese Frage wurde inzwischen entfernt.</p>
      </div>
    );
  }

  return (
    <fieldset className="m-quiz-question quiz-question" aria-describedby={hintId}>
      <legend className="question-legend" tabIndex={-1} ref={headingRef}>
        <span className="question-position">{positionLabel}</span>
        <RichText className="question-text" html={question.text} />
      </legend>
      {question.code && (
        <pre className="question-code">
          <code>{question.code}</code>
        </pre>
      )}
      <p className="question-hint" id={hintId}>
        Wähle alle richtigen Antworten aus.
      </p>
      <ul className="answer-list">
        {question.answers.map((answer) => (
          <li key={answer.id}>
            <label className="answer">
              <input
                type="checkbox"
                name={`question-${question.id}`}
                value={answer.id}
                checked={selectedAnswerIds.includes(answer.id)}
                onChange={() => onSelect(question, answer.id)}
              />
              <RichText className="answer-text" html={answer.text} />
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
};

export default QuizQuestion;
