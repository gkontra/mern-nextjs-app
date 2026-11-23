import { useEffect, useReducer } from 'react';
import { ModulesDispatchContext, ModulesStateContext } from './contexts';
import createInitialState from './initialState';
import loadModules from './loadModules';
import { modulesReducer } from './reducer';

export const ModulesProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(modulesReducer, undefined, createInitialState);

  useEffect(() => {
    const controller = new AbortController();
    loadModules(dispatch, controller.signal);
    return () => controller.abort();
  }, []);

  return (
    <ModulesStateContext.Provider value={state}>
      <ModulesDispatchContext.Provider value={dispatch}>{children}</ModulesDispatchContext.Provider>
    </ModulesStateContext.Provider>
  );
};

export default ModulesProvider;
