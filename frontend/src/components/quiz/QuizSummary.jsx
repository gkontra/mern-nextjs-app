import { Link } from 'react-router-dom';
import { formatDuration } from '../../lib/formatDuration';

const PERCENT = new Intl.NumberFormat('de-DE', { style: 'percent', maximumFractionDigits: 0 });

const QuizSummary = (props) => {
  const { attempt } = props;
  const { correct, wrong, unanswered, total } = attempt.result;

  return (
    <section className="m-quiz-summary quiz-summary" aria-labelledby="summary-title">
      <h2 className="summary-title" id="summary-title">
        Ergebnis
      </h2>
      <p className="summary-score">
        {correct} von {total} richtig ({PERCENT.format(total > 0 ? correct / total : 0)})
      </p>
      <ul className="summary-counts">
        <li>{wrong} falsch</li>
        <li>{unanswered} nicht beantwortet</li>
      </ul>
      <p className="summary-time">
        Benötigte Zeit: {formatDuration(attempt.durationSec)} von {formatDuration(attempt.timeLimitSec)}
      </p>
      {attempt.timedOut && <p className="summary-timeout">Die Zeit war abgelaufen.</p>}
      <p className="summary-categories">Kategorien: {attempt.categories.map(({ name }) => name).join(', ')}</p>
      <div className="summary-links">
        <Link className="summary-link is-primary" to="/quiz">
          Neuer Test
        </Link>
        <Link className="summary-link" to="/profile">
          Zum Profil
        </Link>
      </div>
    </section>
  );
};

export default QuizSummary;
