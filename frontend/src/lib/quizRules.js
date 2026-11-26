export const secondsUntilDeadline = ({ deadline, serverNow }) =>
  Math.max(0, Math.ceil((Date.parse(deadline) - Date.parse(serverNow)) / 1000));

export const isAnswered = (answers, questionId) => (answers[questionId] ?? []).length > 0;

export const countUnanswered = (questions, answers) => questions.filter(({ id }) => !isAnswered(answers, id)).length;
