export const AUTH_STATUS = {
  LOADING: 'loading',
  READY: 'ready',
  SUBMITTING: 'submitting',
  ERROR: 'error',
};

export const createInitialState = () => ({
  user: null,
  status: AUTH_STATUS.LOADING,
  error: null,
});

export default createInitialState;
