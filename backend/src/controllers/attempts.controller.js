import { attemptRunning, validationFailed } from '../lib/apiError.js';
import { onlyAvailableMessage, uniqueIds, validateSelection, validateStartAttempt } from '../lib/attemptRules.js';
import { toRunningView } from '../lib/attemptView.js';
import { countPublishedByCategory, drawQuestions } from '../lib/drawQuestions.js';
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

  if (await findRunning(userId)) {
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

export const getAttempt = async (req, res) => {
  res.json(await toRunningView(req.attempt, new Date()));
};
