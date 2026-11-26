export const withoutEmpty = (errors) => Object.fromEntries(Object.entries(errors).filter(([, message]) => message));

export const formatList = (items, conjunction) =>
  items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} ${conjunction} ${items.at(-1)}`;

export const byteLength = (text) => new TextEncoder().encode(text).length;
