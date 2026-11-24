import api from './api';
import { API_ERROR_CODE, ApiError, isRequestCanceled, toApiError } from './apiError';

const IS_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

const loadMock = () => import('./modulesService.mock.js');

export const fetchModules = async ({ signal } = {}) => {
  if (IS_MOCK_API) {
    return (await loadMock()).fetchModules({ signal });
  }

  try {
    const response = await api.get('/modules', { signal });

    if (!Array.isArray(response.data)) {
      throw new ApiError({ status: 0, code: API_ERROR_CODE.UNKNOWN, message: 'Die Antwort enthält keine Modulliste.' });
    }

    return response.data;
  } catch (error) {
    if (isRequestCanceled(error)) {
      throw error;
    }
    throw toApiError(error);
  }
};
