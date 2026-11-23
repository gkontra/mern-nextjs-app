export const MODULES_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

export const createInitialState = () => ({
  items: [],
  status: MODULES_STATUS.IDLE,
  error: null,
});

export default createInitialState;
