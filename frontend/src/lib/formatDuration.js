export const formatDuration = (totalSec) => {
  const seconds = Math.max(0, Math.round(totalSec));
  const minutes = Math.floor(seconds / 60);

  // seconds < 10 ? `0${seconds}`: seconds

  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
};

export default formatDuration;
