import { useEffect, useReducer } from 'react';
import { AuthDispatchContext, AuthStateContext } from './contexts';
import createInitialState from './initialState';
import { authReducer } from './reducer';
import restoreSession from './restoreSession';

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(authReducer, undefined, createInitialState);

  useEffect(() => {
    const controller = new AbortController();
    restoreSession(dispatch, controller.signal);
    return () => controller.abort();
  }, []);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

export default AuthProvider;
