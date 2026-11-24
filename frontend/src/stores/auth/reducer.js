import { AUTH_STATUS } from './initialState';

export const AUTH_ACTION = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SESSION_RESTORED: 'SESSION_RESTORED',
};

export const authReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case AUTH_ACTION.LOGIN_REQUEST:
      return { ...state, status: AUTH_STATUS.SUBMITTING, error: null };
    case AUTH_ACTION.LOGIN_SUCCESS:
      return { ...state, status: AUTH_STATUS.READY, user: payload, error: null };
    case AUTH_ACTION.LOGIN_FAILURE:
      return { ...state, status: AUTH_STATUS.ERROR, error: payload };
    case AUTH_ACTION.LOGOUT:
      return { ...state, status: AUTH_STATUS.READY, user: null, error: null };
    case AUTH_ACTION.SESSION_RESTORED:
      return { ...state, status: AUTH_STATUS.READY, user: payload.user, error: payload.error };
    default:
      return state;
  }
};

export default authReducer;
