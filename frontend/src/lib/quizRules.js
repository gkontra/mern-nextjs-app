export const TIME_LIMITS_SEC = [300, 600, 900, 1200];
export const DEFAULT_TIME_LIMIT_SEC = 600;
export const QUESTION_COUNT = { min: 1, max: 30 };
export const DEFAULT_QUESTION_COUNT = 10;

export const formatQuestionCount = (count) => (count === 1 ? '1 Frage' : `${count} Fragen`);

export const maxQuestionCount = (available) => Math.min(QUESTION_COUNT.max, available);

export const secondsUntilDeadline = ({ deadline, serverNow }) =>
  Math.max(0, Math.ceil((Date.parse(deadline) - Date.parse(serverNow)) / 1000));

const withoutEmpty = (errors) => Object.fromEntries(Object.entries(errors).filter(([, message]) => message));

const validateQuestionCount = (questionCount, available) => {
  if (!Number.isInteger(questionCount) || questionCount < QUESTION_COUNT.min || questionCount > QUESTION_COUNT.max) {
    return `Die Anzahl der Fragen muss zwischen ${QUESTION_COUNT.min} und ${QUESTION_COUNT.max} liegen.`;
  }
  if (available > 0 && questionCount > available) {
    return `In deiner Auswahl gibt es nur ${formatQuestionCount(available)}.`;
  }
  return null;
};

export const validateQuizSetup = ({ categoryIds, questionCount, timeLimitSec, available }) =>
  withoutEmpty({
    categoryIds: categoryIds.length === 0 ? 'Bitte wähle mindestens eine Kategorie.' : null,
    questionCount: validateQuestionCount(questionCount, available),
    timeLimitSec: TIME_LIMITS_SEC.includes(timeLimitSec) ? null : 'Bitte wähle 5, 10, 15 oder 20 Minuten.',
  });

export const isAnswered = (answers, questionId) => (answers[questionId] ?? []).length > 0;

export const countUnanswered = (questions, answers) => questions.filter(({ id }) => !isAnswered(answers, id)).length;
