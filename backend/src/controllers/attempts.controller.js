import { attemptClosed, attemptRunning, badRequest, validationFailed } from '../lib/apiError.js';
import {
  HISTORY_LIMIT,
  onlyAvailableMessage,
  uniqueIds,
  validateAnswers,
  validateSelection,
  validateStartAttempt,
} from '../lib/attemptRules.js';
import { PHASE, phaseAt } from '../lib/attemptTiming.js';
import { toHistory, toRunningView, toSubmittedView } from '../lib/attemptView.js';
import { countPublishedByCategory, drawQuestions } from '../lib/drawQuestions.js';
import { finalizeAttempt, loadAnswerKeys, settleIfExpired } from '../lib/finalizeAttempt.js';
import Attempt from '../models/Attempt.js';
import Category from '../models/Category.js';

const hasFields = (fields) => Object.keys(fields).length > 0;

const findRunning = (userId) => Attempt.findOne({ userId, status: 'running' }).lean();

const checkStartRules = async (body, categoryIds) => {
  const fields = validateStartAttempt(body);

  if (fields.categoryIds) {
    return fields;
  }

  const [categories, publishedCountById] = await Promise.all([
    Category.find({ _id: { $in: categoryIds } }).lean(),
    countPublishedByCategory(categoryIds),
  ]);
  const selectionFields = validateSelection({
    categoryIds,
    categories,
    publishedCountById,
    questionCount: body.questionCount,
  });

  return { ...selectionFields, ...fields };
};

export const createAttempt = async (req, res) => {
  const { userId } = req.auth;
  const now = new Date();
  const running = await findRunning(userId);

  if (running && (await settleIfExpired(running, now)).status === 'running') {
    throw attemptRunning();
  }

  const { questionCount, timeLimitSec } = req.body;
  const categoryIds = uniqueIds(req.body.categoryIds);
  const fields = await checkStartRules({ ...req.body, categoryIds }, categoryIds);

  if (hasFields(fields)) {
    throw validationFailed(fields);
  }

  const items = await drawQuestions(categoryIds, questionCount);

  if (items.length < questionCount) {
    throw validationFailed({ questionCount: onlyAvailableMessage(items.length) });
  }

  const attempt = await Attempt.create({ userId, categoryIds, questionCount, timeLimitSec, startedAt: now, items });

  res.status(201).json(await toRunningView(attempt.toObject(), now));
};

export const listMine = async (req, res) => {
  if (req.query.mine !== 'true') {
    throw badRequest();
  }

  const { userId } = req.auth;
  const running = await findRunning(userId);

  if (running) {
    await settleIfExpired(running, new Date());
  }

  const attempts = await Attempt.find({ userId }).sort({ startedAt: -1 }).limit(HISTORY_LIMIT).lean();

  res.json(await toHistory(attempts));
};

export const getAttempt = async (req, res) => {
  const now = new Date();
  const attempt = await settleIfExpired(req.attempt, now);

  res.json(attempt.status === 'running' ? await toRunningView(attempt, now) : await toSubmittedView(attempt));
};

export const saveAnswers = async (req, res) => {
  const { attempt } = req;
  const { answers } = req.body;
  const now = new Date();

  if (attempt.status !== 'running') {
    throw attemptClosed();
  }
  if (phaseAt(attempt, now) === PHASE.closed) {
    await finalizeAttempt(attempt, { now });
    throw attemptClosed();
  }

  const fields = validateAnswers(answers, attempt, await loadAnswerKeys(attempt));

  if (hasFields(fields)) {
    throw validationFailed(fields);
  }

  const indexById = new Map(attempt.items.map(({ questionId }, index) => [String(questionId), index]));
  const changes = Object.fromEntries(
    answers.map(({ questionId, selectedAnswerIds }) => [
      `items.${indexById.get(questionId)}.selectedAnswerIds`,
      uniqueIds(selectedAnswerIds),
    ]),
  );

  if (answers.length > 0) {
    const { matchedCount } = await Attempt.updateOne({ _id: attempt._id, status: 'running' }, { $set: changes });

    if (matchedCount === 0) {
      throw attemptClosed();
    }
  }

  res.status(204).end();
};

export const submitAttempt = async (req, res) => {
  const { attempt } = req;
  const now = new Date();

  if (attempt.status !== 'running') {
    throw attemptClosed();
  }

  const isClosed = phaseAt(attempt, now) === PHASE.closed;
  const answerKeys = await loadAnswerKeys(attempt);
  const answers = isClosed ? [] : req.body.answers;
  const fields = validateAnswers(answers, attempt, answerKeys);

  if (hasFields(fields)) {
    throw validationFailed(fields);
  }

  const submitted = await finalizeAttempt(attempt, { answers, answerKeys, now });

  if (!submitted) {
    throw attemptClosed();
  }

  res.json(await toSubmittedView(submitted));
};
