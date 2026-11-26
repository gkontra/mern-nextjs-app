import sanitize from 'sanitize-html';
import { ALLOWED_TAGS } from '@mearn/shared/question';

const SANITIZE_OPTIONS = { allowedTags: ALLOWED_TAGS, allowedAttributes: {} };

const divsToLineBreaks = (html) => html.replace(/<div\b[^>]*>/gi, '<br>').replace(/<\/div\s*>/gi, '');

export const sanitizeHtml = (html = '') => sanitize(divsToLineBreaks(html), SANITIZE_OPTIONS);

export const findRemovedTags = (html = '') => {
  const tags = [...html.matchAll(/<([a-z][a-z0-9]*)\b/gi)].map(([, tag]) => tag.toLowerCase());

  return [...new Set(tags)].filter((tag) => !ALLOWED_TAGS.includes(tag));
};

// node --input-type=module -e "import { sanitizeHtml } from './src/lib/sanitizeHtml.js'; console.log(sanitizeHtml('<img src=x onerror=\"alert(1)\">Hallo <strong>Welt</strong><script>alert(2)</script>'))"
