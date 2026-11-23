import { useCallback, useContext } from 'react';
import { ModulesDispatchContext, ModulesStateContext } from './contexts';
import loadModules from './loadModules';

export const useModulesState = () => {
  const state = useContext(ModulesStateContext);

  if (state == null) {
    throw Error('useModulesState muss innerhalb von ModulesProvider verwendet werden.');
  }

  return state;
};

export const useModulesDispatch = () => {
  const dispatch = useContext(ModulesDispatchContext);

  if (dispatch == null) {
    throw Error('useModulesDispatch muss innerhalb von ModulesProvider verwendet werden.');
  }

  return dispatch;
};

export const useModulesActions = () => {
  const dispatch = useModulesDispatch();
  const reload = useCallback(() => loadModules(dispatch), [dispatch]);

  return { reload };
};

export const usePublishedModules = () => {
  const { items, status, error } = useModulesState();
  const modules = items.filter((module) => module.status === 'published').toSorted((a, b) => a.moduleId - b.moduleId);

  return { modules, status, error };
};

export const useModule = (moduleId) => {
  const { modules, status, error } = usePublishedModules();
  const module = modules.find((item) => item.moduleId === moduleId) ?? null;

  return { module, status, error };
};
