import { ANSWER_COUNT } from '@mearn/shared/question';
import { QUIZ_MESSAGES, validateQuizSetup } from '@mearn/shared/quiz';
import { isObjectIdOrHexString } from 'mongoose';

export const MAX_CATEGORY_IDS = 20;
export const MAX_SELECTED_ANSWERS = ANSWER_COUNT.max;
export const SUBMIT_TOLERANCE_MS = 15_000;
export const HISTORY_LIMIT = 50;

export const ANSWER_MESSAGES = {
  unknownQuestion: 'Diese Frage gehört nicht zu diesem Test.',
  unknownAnswer: 'Mindestens eine Antwort gehört nicht zu dieser Frage.',
};

export const uniqueIds = (ids) => [...new Set(ids.map(String))];

export const validateStartAttempt = (body) => {
  const fields = validateQuizSetup(body);

  if (!fields.categoryIds && !body.categoryIds.every(isObjectIdOrHexString)) {
    fields.categoryIds = QUIZ_MESSAGES.categoryUnknown;
  }

  return fields;
};

export const validateSelection = ({ categoryIds, categories, publishedCountById, questionCount }) => {
  const categoryById = new Map(categories.map((category) => [String(category._id), category]));

  if (!categoryIds.every((id) => categoryById.has(id))) {
    return { categoryIds: QUIZ_MESSAGES.categoryUnknown };
  }

  const emptyId = categoryIds.find((id) => !publishedCountById.get(id));

  if (emptyId) {
    return { categoryIds: QUIZ_MESSAGES.categoryEmpty(categoryById.get(emptyId).name) };
  }

  const available = categoryIds.reduce((sum, id) => sum + publishedCountById.get(id), 0);

  return questionCount > available ? { questionCount: QUIZ_MESSAGES.onlyAvailable(available) } : {};
};

export const validateAnswers = (answers, attempt, answerKeys) => {
  const questionIds = new Set(attempt.items.map(({ questionId }) => String(questionId)));

  for (const { questionId, selectedAnswerIds } of answers) {
    if (!questionIds.has(questionId)) {
      return { answers: ANSWER_MESSAGES.unknownQuestion };
    }

    const key = answerKeys.get(questionId);

    if (!selectedAnswerIds.every((id) => key?.answerIds.has(id))) {
      return { answers: ANSWER_MESSAGES.unknownAnswer };
    }
  }

  return {};
};
