import { useCallback, useContext } from 'react';
import * as authService from '../../services/authService';
import { AuthDispatchContext, AuthStateContext } from './contexts';
import { AUTH_ACTION } from './reducer';

export const useAuthState = () => {
  const state = useContext(AuthStateContext);

  if (state == null) {
    throw Error('useAuthState muss innerhalb von AuthProvider verwendet werden.');
  }

  return state;
};

export const useAuthDispatch = () => {
  const dispatch = useContext(AuthDispatchContext);

  if (dispatch == null) {
    throw Error('useAuthDispatch muss innerhalb von AuthProvider verwendet werden.');
  }

  return dispatch;
};

const authenticate = async (dispatch, request) => {
  dispatch({ type: AUTH_ACTION.LOGIN_REQUEST });

  try {
    const user = await request();
    dispatch({ type: AUTH_ACTION.LOGIN_SUCCESS, payload: user });
    return user;
  } catch (error) {
    dispatch({ type: AUTH_ACTION.LOGIN_FAILURE, payload: error.message });
    throw error;
  }
};

export const useAuth = () => {
  const { user, status, error } = useAuthState();
  const dispatch = useAuthDispatch();

  const login = useCallback((credentials) => authenticate(dispatch, () => authService.login(credentials)), [dispatch]);
  const register = useCallback((account) => authenticate(dispatch, () => authService.register(account)), [dispatch]);

  const logout = useCallback(async () => {
    await authService.logout().catch(() => null);
    dispatch({ type: AUTH_ACTION.LOGOUT });
  }, [dispatch]);

  return { user, isAuthenticated: user !== null, status, error, login, register, logout };
};
