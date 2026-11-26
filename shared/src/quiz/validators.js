import { withoutEmpty } from '../lib/index.js';
import { QUESTION_COUNT, TIME_LIMITS_SEC } from './limits.js';
import { QUIZ_MESSAGES } from './messages.js';

export const maxQuestionCount = (available) => Math.min(QUESTION_COUNT.max, available);

const validateQuestionCount = (questionCount, available) => {
  if (!Number.isInteger(questionCount) || questionCount < QUESTION_COUNT.min || questionCount > QUESTION_COUNT.max) {
    return QUIZ_MESSAGES.questionCountRange();
  }
  if (available > 0 && questionCount > available) {
    return QUIZ_MESSAGES.onlyAvailable(available);
  }
  return null;
};

export const validateQuizSetup = ({ categoryIds, questionCount, timeLimitSec, available }) =>
  withoutEmpty({
    categoryIds: categoryIds.length === 0 ? QUIZ_MESSAGES.categoryRequired : null,
    questionCount: validateQuestionCount(questionCount, available),
    timeLimitSec: TIME_LIMITS_SEC.includes(timeLimitSec) ? null : QUIZ_MESSAGES.timeLimit(),
  });
