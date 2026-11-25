import { badRequest, validationFailed } from '../lib/apiError.js';
import { MAX_CATEGORY_IDS, MAX_SELECTED_ANSWERS, QUESTION_COUNT } from '../lib/attemptRules.js';

const isStringArray = (value, maxLength) =>
  Array.isArray(value) && value.length <= maxLength && value.every((item) => typeof item === 'string');

const isAttemptBody = (body) =>
  isStringArray(body?.categoryIds, MAX_CATEGORY_IDS) &&
  Number.isInteger(body.questionCount) &&
  Number.isInteger(body.timeLimitSec);

const isAnswer = (answer) =>
  typeof answer?.questionId === 'string' && isStringArray(answer.selectedAnswerIds, MAX_SELECTED_ANSWERS);

const isAnswersBody = (body) =>
  Array.isArray(body?.answers) && body.answers.length <= QUESTION_COUNT.max && body.answers.every(isAnswer);

export const requireStringFields = (keys) => (req, res, next) => {
  if (keys.some((key) => typeof req.body?.[key] !== 'string')) {
    next(badRequest());
    return;
  }
  next();
};

export const requireAttemptBody = (req, res, next) => {
  if (!isAttemptBody(req.body)) {
    next(badRequest());
    return;
  }
  next();
};

export const requireAnswersBody = (req, res, next) => {
  if (!isAnswersBody(req.body)) {
    next(badRequest());
    return;
  }
  next();
};

export const validate = (rules) => (req, res, next) => {
  const fields = rules(req.body);

  if (Object.keys(fields).length > 0) {
    next(validationFailed(fields));
    return;
  }
  next();
};
