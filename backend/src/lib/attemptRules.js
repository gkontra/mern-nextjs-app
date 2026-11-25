import { isObjectIdOrHexString } from 'mongoose';

export const TIME_LIMITS_SEC = [300, 600, 900, 1200];
export const QUESTION_COUNT = { min: 1, max: 30 };
export const MAX_CATEGORY_IDS = 20;
export const MAX_SELECTED_ANSWERS = 6;
export const SUBMIT_TOLERANCE_MS = 15_000;
export const HISTORY_LIMIT = 50;

export const ANSWER_MESSAGES = {
  unknownQuestion: 'Diese Frage gehört nicht zu diesem Test.',
  unknownAnswer: 'Mindestens eine Antwort gehört nicht zu dieser Frage.',
};

export const uniqueIds = (ids) => [...new Set(ids.map(String))];

export const onlyAvailableMessage = (available) =>
  available === 1 ? 'In deiner Auswahl gibt es nur 1 Frage.' : `In deiner Auswahl gibt es nur ${available} Fragen.`;

export const validateStartAttempt = ({ categoryIds, questionCount, timeLimitSec }) => {
  const fields = {};

  if (categoryIds.length === 0) {
    fields.categoryIds = 'Bitte wähle mindestens eine Kategorie.';
  } else if (!categoryIds.every(isObjectIdOrHexString)) {
    fields.categoryIds = 'Mindestens eine gewählte Kategorie gibt es nicht.';
  }
  if (questionCount < QUESTION_COUNT.min || questionCount > QUESTION_COUNT.max) {
    fields.questionCount = `Die Anzahl der Fragen muss zwischen ${QUESTION_COUNT.min} und ${QUESTION_COUNT.max} liegen.`;
  }
  if (!TIME_LIMITS_SEC.includes(timeLimitSec)) {
    fields.timeLimitSec = 'Bitte wähle 5, 10, 15 oder 20 Minuten.';
  }

  return fields;
};

export const validateSelection = ({ categoryIds, categories, publishedCountById, questionCount }) => {
  const categoryById = new Map(categories.map((category) => [String(category._id), category]));

  if (!categoryIds.every((id) => categoryById.has(id))) {
    return { categoryIds: 'Mindestens eine gewählte Kategorie gibt es nicht.' };
  }

  const emptyId = categoryIds.find((id) => !publishedCountById.get(id));

  if (emptyId) {
    return { categoryIds: `Die Kategorie „${categoryById.get(emptyId).name}“ enthält noch keine Fragen.` };
  }

  const available = categoryIds.reduce((sum, id) => sum + publishedCountById.get(id), 0);

  return questionCount > available ? { questionCount: onlyAvailableMessage(available) } : {};
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
