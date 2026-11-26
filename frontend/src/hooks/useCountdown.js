import { useEffect, useState } from 'react';

const TICK_MS = 1000;

export const useCountdown = (deadline, clockOffsetMs) => {
  const [now, setNow] = useState(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const intervalId = window.setInterval(tick, TICK_MS);

    tick();
    document.addEventListener('visibilitychange', tick);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [deadline, clockOffsetMs]);

  if (!deadline || now === null) {
    return null;
  }

  return Date.parse(deadline) - (now + clockOffsetMs);
};

export default useCountdown;
