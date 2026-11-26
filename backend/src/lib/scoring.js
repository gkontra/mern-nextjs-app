export const scoreItem = (selectedIds, correctIds) => {
  if (selectedIds.length === 0) {
    return null;
  }

  const selected = new Set(selectedIds.map(String));
  const correct = new Set(correctIds.map(String));

  return selected.size === correct.size && [...correct].every((id) => selected.has(id));
};

export const summarize = (items) => {
  const correct = items.filter(({ isCorrect }) => isCorrect === true).length;
  const wrong = items.filter(({ isCorrect }) => isCorrect === false).length;

  return { correct, wrong, unanswered: items.length - correct - wrong, total: items.length };
};
