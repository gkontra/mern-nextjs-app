import Category from '../models/Category.js';
import Question from '../models/Question.js';
import { deadlineOf } from './attemptTiming.js';
import { sanitizeHtml } from './sanitizeHtml.js';

const byId = (docs) => new Map(docs.map((doc) => [String(doc._id), doc]));

const loadCategories = async (attempts) =>
  byId(await Category.find({ _id: { $in: attempts.flatMap(({ categoryIds }) => categoryIds) } }).lean());

const loadQuestions = async (attempt) =>
  byId(await Question.find({ _id: { $in: attempt.items.map(({ questionId }) => questionId) } }).lean());

const toCategories = (attempt, categoriesById) =>
  attempt.categoryIds
    .map((id) => categoriesById.get(String(id)))
    .filter(Boolean)
    .map(({ _id, name }) => ({ id: String(_id), name }));

const toBase = (attempt, categoriesById) => ({
  id: String(attempt._id),
  status: attempt.status,
  categories: toCategories(attempt, categoriesById),
  questionCount: attempt.questionCount,
  timeLimitSec: attempt.timeLimitSec,
  startedAt: attempt.startedAt,
  deadline: deadlineOf(attempt),
});

const inStoredOrder = (answers, answerOrder) => {
  const rank = new Map(answerOrder.map((id, index) => [String(id), index]));
  const rankOf = (answer) => rank.get(String(answer._id)) ?? answers.length;

  return [...answers].sort((a, b) => rankOf(a) - rankOf(b));
};

const toQuestionBase = (question) => ({
  id: String(question._id),
  text: sanitizeHtml(question.text),
  code: question.code,
});

const toRunningQuestion = (item, question) => {
  if (!question) {
    return { id: String(item.questionId), removed: true, selectedAnswerIds: [] };
  }

  return {
    ...toQuestionBase(question),
    answers: inStoredOrder(question.answers, item.answerOrder).map(({ _id, text }) => ({
      id: String(_id),
      text: sanitizeHtml(text),
    })),
    selectedAnswerIds: item.selectedAnswerIds.map(String),
  };
};

export const toRunningView = async (attempt, now) => {
  const [categoriesById, questionsById] = await Promise.all([loadCategories([attempt]), loadQuestions(attempt)]);

  return {
    ...toBase(attempt, categoriesById),
    serverNow: now,
    questions: attempt.items.map((item) => toRunningQuestion(item, questionsById.get(String(item.questionId)))),
  };
};
