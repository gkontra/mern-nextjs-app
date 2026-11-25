import Category from '../models/Category.js';
import Question from '../models/Question.js';

const byModuleThenName = (a, b) =>
  (a.moduleId ?? Infinity) - (b.moduleId ?? Infinity) || a.name.localeCompare(b.name, 'de');

const countPublishedByCategory = async () => {
  // https://www.mongodb.com/docs/manual/reference/mql/query-predicates/
  const counts = await Question.aggregate([
    { $match: { status: 'published' } },
    { $group: { _id: '$categoryId', count: { $sum: 1 } } },
  ]);

  return new Map(counts.map(({ _id, count }) => [String(_id), count]));
};

export const listCategories = async (req, res) => {
  const [categories, countById] = await Promise.all([Category.find().lean(), countPublishedByCategory()]);

  const result = categories
    .map(({ _id, name, slug, description, moduleId }) => ({
      id: String(_id),
      name,
      slug,
      description,
      moduleId: moduleId ?? null,
      questionCount: countById.get(String(_id)) ?? 0,
    }))
    .sort(byModuleThenName);

  res.json(result);
};
