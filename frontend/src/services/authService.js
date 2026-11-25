import api from './api';
import { API_ERROR_CODE, ApiError, isRequestCanceled, toApiError } from './apiError';

const IS_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

// dynamic import
const loadMock = () => import('./authService.mock.js');

const send = async (request) => {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    if (isRequestCanceled(error)) {
      throw error;
    }
    throw toApiError(error);
  }
};

export const register = async ({ name, email, password }) => {
  if (IS_MOCK_API) {
    return (await loadMock()).register({ name, email, password });
  }

  const data = await send(() => api.post('/auth/register', { name, email, password }));
  return data.user;
};

export const login = async ({ email, password }) => {
  if (IS_MOCK_API) {
    return (await loadMock()).login({ email, password });
  }

  const data = await send(() => api.post('/auth/login', { email, password }));
  return data.user;
};

export const logout = async () => {
  if (IS_MOCK_API) {
    return (await loadMock()).logout();
  }

  await send(() => api.post('/auth/logout'));
};

export const fetchMe = async ({ signal } = {}) => {
  if (IS_MOCK_API) {
    return (await loadMock()).fetchMe({ signal });
  }

  const data = await send(() => api.get('/auth/me', { signal }));
  return data.user;
};

export const readUser = (data) => {
  const user = data?.user;

  if (user === null || typeof user !== 'object' || Array.isArray(user)) {
    throw new ApiError({
      status: 0,
      code: API_ERROR_CODE.UNKNOWN,
      message: 'Die Antwort enthält keine Benutzerdaten.',
    });
  }

  return user;
};
