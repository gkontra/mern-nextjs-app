import { SUBMIT_TOLERANCE_MS } from './attemptRules.js';

export const PHASE = { open: 'open', grace: 'grace', closed: 'closed' };

export const deadlineOf = ({ startedAt, timeLimitSec }) => new Date(startedAt.getTime() + timeLimitSec * 1000);

export const phaseAt = (attempt, now) => {
  const deadline = deadlineOf(attempt).getTime();

  if (now.getTime() <= deadline) {
    return PHASE.open;
  }
  if (now.getTime() <= deadline + SUBMIT_TOLERANCE_MS) {
    return PHASE.grace;
  }
  return PHASE.closed;
};

export const durationSecOf = ({ startedAt, submittedAt, timeLimitSec }) =>
  submittedAt ? Math.min(Math.round((submittedAt - startedAt) / 1000), timeLimitSec) : null;
