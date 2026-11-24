import { isRequestCanceled } from '../../services/apiError';
import { fetchMe } from '../../services/authService';
import { AUTH_ACTION } from './reducer';

export const restoreSession = async (dispatch, signal) => {
  try {
    const user = await fetchMe({ signal });
    dispatch({ type: AUTH_ACTION.SESSION_RESTORED, payload: { user, error: null } });
  } catch (error) {
    if (isRequestCanceled(error)) {
      return;
    }
    const message = error.status === 401 ? null : error.message;
    dispatch({ type: AUTH_ACTION.SESSION_RESTORED, payload: { user: null, error: message } });
  }
};

export default restoreSession;
