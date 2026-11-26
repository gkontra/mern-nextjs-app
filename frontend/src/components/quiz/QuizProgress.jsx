import { FaCheck } from 'react-icons/fa6';
import { isAnswered } from '../../lib/quizRules';

const QuizProgress = (props) => {
  const { questions, answers, current, onSelect } = props;
  const answeredCount = questions.filter(({ id }) => isAnswered(answers, id)).length;

  return (
    <nav className="m-quiz-progress quiz-progress" aria-label="Fragen">
      <p className="progress-summary">
        {answeredCount} von {questions.length} beantwortet
      </p>
      <ol className="progress-list">
        {questions.map((question, index) => {
          const position = index + 1;
          const answered = isAnswered(answers, question.id);

          return (
            <li key={question.id}>
              <button
                className={`progress-button${answered ? ' is-answered' : ''}`}
                type="button"
                aria-label={`Frage ${position}, ${answered ? 'beantwortet' : 'offen'}`}
                aria-current={position === current ? 'step' : undefined}
                onClick={() => onSelect(position)}>
                <span aria-hidden="true">{position}</span>
                {answered && <FaCheck className="progress-check" aria-hidden="true" focusable="false" />}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default QuizProgress;
