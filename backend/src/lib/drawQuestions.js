import mongoose from 'mongoose';
import Question from '../models/Question.js';
import { shuffle } from './shuffle.js';

const toObjectIds = (ids) => ids.map((id) => new mongoose.Types.ObjectId(id));

const withoutDuplicates = (questions) => {
  const seen = new Set();

  return questions.filter(({ _id }) => {
    const key = String(_id);
    const isNew = !seen.has(key);
    seen.add(key);
    return isNew;
  });
};

export const countPublishedByCategory = async (categoryIds) => {
  const counts = await Question.aggregate([
    { $match: { categoryId: { $in: toObjectIds(categoryIds) }, status: 'published' } },
    { $group: { _id: '$categoryId', count: { $sum: 1 } } },
  ]);

  return new Map(counts.map(({ _id, count }) => [String(_id), count]));
};

export const drawQuestions = async (categoryIds, size) => {
  const drawn = await Question.aggregate([
    { $match: { categoryId: { $in: toObjectIds(categoryIds) }, status: 'published' } },
    { $sample: { size } },
    { $project: { 'answers._id': 1 } },
  ]);

  return withoutDuplicates(drawn).map(({ _id, answers }) => ({
    questionId: _id,
    answerOrder: shuffle(answers.map((answer) => answer._id)),
    selectedAnswerIds: [],
    isCorrect: null,
  }));
};
