import { readFile } from 'node:fs/promises';
import config from '../src/config/index.js';
import { connectDb, disconnectDb } from '../src/config/db.js';
import { insertOnly } from '../src/lib/insertOnly.js';
import { findDuplicates, toCategoryDoc, toQuestionDoc } from '../src/lib/quizSeed.js';
import { findRemovedTags } from '../src/lib/sanitizeHtml.js';
import Category from '../src/models/Category.js';
import Question from '../src/models/Question.js';

const QUIZ_FILE = new URL('../seed-data/quiz.json', import.meta.url);

const htmlFieldsOf = (question) => [question.text, question.note ?? '', ...question.answers.map(({ text }) => text)];

const checkSeed = (categories) => {
  const questions = categories.flatMap((category) => category.questions);
  const duplicates = [
    ...findDuplicates(categories.map(({ slug }) => slug)),
    ...findDuplicates(questions.map(({ seedKey }) => seedKey)),
  ];

  if (duplicates.length > 0) {
    throw new Error(`Doppelte Schlüssel in quiz.json: ${duplicates.join(', ')}`);
  }

  const removedTags = questions.flatMap((question) =>
    htmlFieldsOf(question).flatMap((html) => findRemovedTags(html).map((tag) => `<${tag}> in ${question.seedKey}`)),
  );

  return { removedTags };
};

const importCategories = async (categories) => {
  const result = await insertOnly(Category, categories.map(toCategoryDoc), 'slug');
  const stored = await Category.find({ slug: { $in: categories.map(({ slug }) => slug) } }).lean();

  return { ...result, idBySlug: new Map(stored.map(({ slug, _id }) => [slug, _id])) };
};

const importQuestions = (categories, idBySlug) => {
  const docs = categories.flatMap((category) =>
    category.questions.map((question) => toQuestionDoc(question, idBySlug.get(category.slug))),
  );

  return insertOnly(Question, docs, 'seedKey');
};

const countByStatus = (questions, status) => questions.filter((question) => question.status === status).length;

try {
  const { categories } = JSON.parse(await readFile(QUIZ_FILE, 'utf8'));
  const { removedTags } = checkSeed(categories);

  await connectDb(config.mongodbUri);
  await Promise.all([Category.init(), Question.init()]);

  const categoryResult = await importCategories(categories);
  const questionResult = await importQuestions(categories, categoryResult.idBySlug);

  console.info(
    `Kategorien: ${categoryResult.inserted.length} neu, ${categoryResult.existing} vorhanden · ` +
      `Fragen: ${questionResult.inserted.length} neu, ${questionResult.existing} vorhanden`,
  );
  console.table(
    categories.map(({ slug, moduleId, questions }) => ({
      slug,
      moduleId: moduleId ?? '–',
      published: countByStatus(questions, 'published'),
      draft: countByStatus(questions, 'draft'),
    })),
  );
  console.info(`Vom Sanitizer entfernt: ${removedTags.join(', ') || 'nichts'}`);
} catch (error) {
  console.error(`Import fehlgeschlagen: ${error.message}`);
  process.exitCode = 1;
} finally {
  await disconnectDb();
}
