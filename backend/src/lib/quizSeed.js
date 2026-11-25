import { sanitizeHtml } from './sanitizeHtml.js';

export const toCategoryDoc = ({ slug, name, moduleId = null, description = '' }) => ({
  slug,
  name,
  moduleId,
  description,
});

export const toQuestionDoc = (question, categoryId) => ({
  categoryId,
  seedKey: question.seedKey,
  status: question.status,
  text: sanitizeHtml(question.text),
  code: question.code ?? '',
  answers: question.answers.map(({ text, isCorrect, explanation = '' }) => ({
    text: sanitizeHtml(text),
    isCorrect,
    explanation,
  })),
  successMessage: question.successMessage ?? '',
  errorMessage: question.errorMessage ?? '',
  note: sanitizeHtml(question.note ?? ''),
});

export const findDuplicates = (values) => {
  const seen = new Set();
  const duplicates = new Set();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    }
    seen.add(value);
  }

  return [...duplicates];
};

// node --input-type=module -e "import { findDuplicates } from './src/lib/quizSeed.js'; console.log(findDuplicates(['a', 'b', 'a', 'c']))"
