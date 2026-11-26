export const ANSWER_COUNT = { min: 2, max: 6 };
export const QUESTION_STATUS = ['draft', 'published'];
export const ALLOWED_TAGS = ['code', 'pre', 'strong', 'em', 'br'];

export const QUESTION_MESSAGES = {
  answers: ({ min, max } = ANSWER_COUNT) =>
    `Eine Frage braucht ${min} bis ${max} Antworten, mindestens eine davon richtig.`,
};

export const hasValidAnswers = (answers) =>
  answers.length >= ANSWER_COUNT.min &&
  answers.length <= ANSWER_COUNT.max &&
  answers.some((answer) => answer.isCorrect);
