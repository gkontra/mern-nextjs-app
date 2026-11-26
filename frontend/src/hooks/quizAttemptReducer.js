export const QUIZ_STATUS = {
  LOADING: 'loading',
  READY: 'ready',
  SUBMITTING: 'submitting',
  SUBMITTED: 'submitted',
  ERROR: 'error',
};

export const QUIZ_ACTION = {
  LOAD_REQUEST: 'LOAD_REQUEST',
  LOAD_SUCCESS: 'LOAD_SUCCESS',
  LOAD_FAILURE: 'LOAD_FAILURE',
  SELECT: 'SELECT',
  SAVE_SUCCESS: 'SAVE_SUCCESS',
  SAVE_FAILURE: 'SAVE_FAILURE',
  SUBMIT_REQUEST: 'SUBMIT_REQUEST',
  SUBMIT_SUCCESS: 'SUBMIT_SUCCESS',
  SUBMIT_FAILURE: 'SUBMIT_FAILURE',
};

export const createInitialState = () => ({
  status: QUIZ_STATUS.LOADING,
  attempt: null,
  clockOffsetMs: 0,
  answers: {},
  unsavedIds: [],
  error: null,
  submitError: null,
});

const toAnswers = (questions) =>
  Object.fromEntries(questions.map(({ id, selectedAnswerIds }) => [id, selectedAnswerIds ?? []]));

const toClockOffsetMs = ({ attempt, receivedAt }) =>
  attempt.serverNow ? Date.parse(attempt.serverNow) - receivedAt : 0;

const without = (ids, id) => ids.filter((current) => current !== id);

export const quizAttemptReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case QUIZ_ACTION.LOAD_REQUEST:
      return createInitialState();
    case QUIZ_ACTION.LOAD_SUCCESS:
      return {
        ...state,
        status: payload.attempt.status === 'submitted' ? QUIZ_STATUS.SUBMITTED : QUIZ_STATUS.READY,
        attempt: payload.attempt,
        clockOffsetMs: toClockOffsetMs(payload),
        answers: toAnswers(payload.attempt.questions),
      };
    case QUIZ_ACTION.LOAD_FAILURE:
      return { ...state, status: QUIZ_STATUS.ERROR, error: payload };
    case QUIZ_ACTION.SELECT:
      if (state.status !== QUIZ_STATUS.READY) {
        return state;
      }
      return { ...state, answers: { ...state.answers, [payload.questionId]: payload.selectedAnswerIds } };
    case QUIZ_ACTION.SAVE_SUCCESS:
      return { ...state, unsavedIds: without(state.unsavedIds, payload) };
    case QUIZ_ACTION.SAVE_FAILURE:
      return { ...state, unsavedIds: [...without(state.unsavedIds, payload), payload] };
    case QUIZ_ACTION.SUBMIT_REQUEST:
      if (state.status !== QUIZ_STATUS.READY) {
        return state;
      }
      return { ...state, status: QUIZ_STATUS.SUBMITTING, submitError: null };
    case QUIZ_ACTION.SUBMIT_SUCCESS:
      return { ...state, status: QUIZ_STATUS.SUBMITTED };
    case QUIZ_ACTION.SUBMIT_FAILURE:
      return { ...state, status: QUIZ_STATUS.READY, submitError: payload };
    default:
      return state;
  }
};

export default quizAttemptReducer;
