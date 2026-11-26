export const createSaveQueue = () => {
  const lanes = new Map();

  const drain = async (lane) => {
    lane.isRunning = true;

    while (lane.next) {
      const task = lane.next;
      lane.next = null;
      await task().catch(() => null);
    }

    lane.isRunning = false;
  };

  const push = (key, task) => {
    const lane = lanes.get(key) ?? { isRunning: false, next: null };
    lanes.set(key, lane);
    lane.next = task;

    if (!lane.isRunning) {
      drain(lane);
    }
  };

  return { push };
};

export default createSaveQueue;
