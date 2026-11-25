import { isRequestCanceled } from '../../services/apiError';
import { fetchModules } from '../../services/modulesService';
import { MODULES_ACTION } from './reducer';

export const loadModules = async (dispatch, signal) => {
  dispatch({ type: MODULES_ACTION.FETCH_REQUEST });

  try {
    const items = await fetchModules({ signal });
    dispatch({ type: MODULES_ACTION.FETCH_SUCCESS, payload: items });
  } catch (error) {
    if (isRequestCanceled(error)) {
      return;
    }
    dispatch({ type: MODULES_ACTION.FETCH_FAILURE, payload: error.message });
  }
};

export default loadModules;
