import { useState } from 'react';
import { FaHourglassHalf, FaTriangleExclamation } from 'react-icons/fa6';
import { formatDuration } from '../../lib/formatDuration';

const LAST_MINUTE_SEC = 60;
const START_TOLERANCE_SEC = 5;
const THRESHOLDS = [
  { sec: 300, message: 'Noch 5 Minuten.' },
  { sec: 60, message: 'Noch 1 Minute.' },
];
const TIME_UP_MESSAGE = 'Die Zeit ist abgelaufen. Dein Test wird abgegeben.';
const NOT_STARTED = { remainingSec: null, announced: [], polite: '', urgent: '' };

const formatMinutes = (minutes) => (minutes === 1 ? '1 Minute' : `${minutes} Minuten`);

const formatSeconds = (seconds) => (seconds === 1 ? '1 Sekunde' : `${seconds} Sekunden`);

const describeStart = (remainingSec, timeLimitSec) => {
  if (remainingSec >= timeLimitSec - START_TOLERANCE_SEC) {
    return `Du hast ${formatMinutes(Math.round(timeLimitSec / 60))} Zeit.`;
  }
  if (remainingSec >= LAST_MINUTE_SEC) {
    return `Du hast noch etwa ${formatMinutes(Math.round(remainingSec / 60))} Zeit.`;
  }
  return `Du hast noch ${formatSeconds(remainingSec)} Zeit.`;
};

const announce = (tracked, remainingSec, timeLimitSec) => {
  const next = { ...tracked, remainingSec };

  if (remainingSec === null) {
    return next;
  }

  if (remainingSec === 0) {
    return tracked.announced.includes(0)
      ? next
      : { ...next, announced: [...tracked.announced, 0], urgent: TIME_UP_MESSAGE };
  }

  if (tracked.remainingSec === null) {
    return { ...next, polite: describeStart(remainingSec, timeLimitSec) };
  }

  const crossed = THRESHOLDS.filter(
    ({ sec }) =>
      sec < timeLimitSec && tracked.remainingSec > sec && remainingSec <= sec && !tracked.announced.includes(sec),
  );

  if (crossed.length === 0) {
    return next;
  }

  return {
    ...next,
    announced: [...tracked.announced, ...crossed.map(({ sec }) => sec)],
    polite: crossed.at(-1).message,
  };
};

const QuizTimer = (props) => {
  const { remainingMs, timeLimitSec } = props;
  const remainingSec = remainingMs === null ? null : Math.max(0, Math.ceil(remainingMs / 1000));
  const [tracked, setTracked] = useState(NOT_STARTED);
  const isLastMinute = remainingSec !== null && remainingSec < LAST_MINUTE_SEC;

  if (remainingSec !== tracked.remainingSec) {
    setTracked(announce(tracked, remainingSec, timeLimitSec));
  }

  return (
    <div className={isLastMinute ? 'm-quiz-timer quiz-timer is-warning' : 'm-quiz-timer quiz-timer'}>
      {remainingSec !== null && (
        <p className="timer-clock">
          <FaHourglassHalf className="timer-icon" aria-hidden="true" focusable="false" />
          <span className="timer-label" id="quiz-timer-label">
            Restzeit
          </span>
          <span className="timer-value" role="timer" aria-labelledby="quiz-timer-label">
            {formatDuration(remainingSec)}
          </span>
        </p>
      )}
      {isLastMinute && (
        <p className="timer-warning">
          <FaTriangleExclamation aria-hidden="true" focusable="false" />
          {remainingSec === 0 ? 'Die Zeit ist abgelaufen.' : 'Weniger als 1 Minute'}
        </p>
      )}
      <p className="visually-hidden" role="status">
        {tracked.polite}
      </p>
      <p className="visually-hidden" role="alert">
        {tracked.urgent}
      </p>
    </div>
  );
};

export default QuizTimer;
