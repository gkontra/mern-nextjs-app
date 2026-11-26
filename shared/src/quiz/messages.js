import { formatList } from '../lib/index.js';
import { QUESTION_COUNT, TIME_LIMITS_SEC } from './limits.js';

export const formatQuestionCount = (count) => (count === 1 ? '1 Frage' : `${count} Fragen`);

export const QUIZ_MESSAGES = {
  categoryRequired: 'Bitte wähle mindestens eine Kategorie.',
  categoryUnknown: 'Mindestens eine gewählte Kategorie gibt es nicht.',
  categoryEmpty: (name) => `Die Kategorie „${name}“ enthält noch keine Fragen.`,
  questionCountRange: ({ min, max } = QUESTION_COUNT) => `Die Anzahl der Fragen muss zwischen ${min} und ${max} liegen.`,
  onlyAvailable: (available) => `In deiner Auswahl gibt es nur ${formatQuestionCount(available)}.`,
  timeLimit: (limits = TIME_LIMITS_SEC) => `Bitte wähle ${formatList(limits.map((sec) => sec / 60), 'oder')} Minuten.`,
};
