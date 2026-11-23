import { MODULES_STATUS } from './initialState';

export const MODULES_ACTION = {
  FETCH_REQUEST: 'FETCH_REQUEST',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_FAILURE: 'FETCH_FAILURE',
};

export const modulesReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case MODULES_ACTION.FETCH_REQUEST:
      return { ...state, status: MODULES_STATUS.LOADING, error: null };
    case MODULES_ACTION.FETCH_SUCCESS:
      return { ...state, status: MODULES_STATUS.SUCCESS, items: payload };
    case MODULES_ACTION.FETCH_FAILURE:
      return { ...state, status: MODULES_STATUS.ERROR, error: payload };
    default:
      return state;
  }
};

export default modulesReducer;
