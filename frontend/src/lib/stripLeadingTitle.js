export const stripLeadingTitle = (source) => {
  return source.replace(/^\s*# [^\n]*\n/, '');
};
