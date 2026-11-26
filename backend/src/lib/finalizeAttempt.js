import Attempt from '../models/Attempt.js';
import Question from '../models/Question.js';
import { uniqueIds } from './attemptRules.js';
import { PHASE, deadlineOf, phaseAt } from './attemptTiming.js';
import { scoreItem, summarize } from './scoring.js';

export const loadAnswerKeys = async (attempt) => {
  const questions = await Question.find({ _id: { $in: attempt.items.map(({ questionId }) => questionId) } })
    .select('answers._id answers.isCorrect')
    .lean();

  return new Map(
    questions.map(({ _id, answers }) => {
      const correctIds = answers.filter(({ isCorrect }) => isCorrect).map((answer) => String(answer._id));

      return [String(_id), { answerIds: new Set(answers.map((answer) => String(answer._id))), correctIds }];
    }),
  );
};

const mergeSelections = (items, answers) => {
  const selectionById = new Map(
    items.map(({ questionId, selectedAnswerIds }) => [String(questionId), selectedAnswerIds]),
  );

  answers.forEach(({ questionId, selectedAnswerIds }) => selectionById.set(questionId, uniqueIds(selectedAnswerIds)));

  return selectionById;
};

export const finalizeAttempt = async (attempt, { answers = [], answerKeys, now }) => {
  const phase = phaseAt(attempt, now);
  const keys = answerKeys ?? (await loadAnswerKeys(attempt));
  const selectionById = mergeSelections(attempt.items, phase === PHASE.closed ? [] : answers);

  const items = attempt.items.map(({ questionId, answerOrder }) => {
    const selectedAnswerIds = selectionById.get(String(questionId));
    const key = keys.get(String(questionId));

    return {
      questionId,
      answerOrder,
      selectedAnswerIds,
      isCorrect: key ? scoreItem(selectedAnswerIds, key.correctIds) : null,
    };
  });

  return Attempt.findOneAndUpdate(
    { _id: attempt._id, status: 'running' },
    {
      $set: {
        status: 'submitted',
        submittedAt: phase === PHASE.closed ? deadlineOf(attempt) : now,
        timedOut: phase !== PHASE.open,
        items,
        result: summarize(items),
      },
    },
    { returnDocument: 'after', lean: true },
  );
};

export const settleIfExpired = async (attempt, now) => {
  if (attempt.status !== 'running' || phaseAt(attempt, now) !== PHASE.closed) {
    return attempt;
  }

  return (await finalizeAttempt(attempt, { now })) ?? Attempt.findById(attempt._id).lean();
};
