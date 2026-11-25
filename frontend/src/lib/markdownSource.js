const SLIDE_SEPARATOR = '---';

const toLines = (source) => source.replace(/\r\n?/g, '\n').split('\n');

export const stripFrontMatter = (source) => {
  const lines = toLines(source);

  if (lines[0] !== SLIDE_SEPARATOR) {
    return lines.join('\n');
  }

  const end = lines.indexOf(SLIDE_SEPARATOR, 1);

  return end === -1 ? lines.join('\n') : lines.slice(end + 1).join('\n');
};

export const splitSlides = (source) =>
  toLines(source)
    .reduce(
      (slides, line) => {
        if (line === SLIDE_SEPARATOR) {
          slides.push([]);
        } else {
          slides.at(-1).push(line);
        }
        return slides;
      },
      [[]],
    )
    .map((lines) => lines.join('\n').trim())
    .filter(Boolean);

export const stripLeadingTitle = (source) => source.replace(/^\s*# [^\n]*\n/, '');

export const isTitleOnly = (slide) => /^#{1,2} [^\n]+$/.test(slide);
