import api from './api';
import { API_ERROR_CODE, ApiError, isRequestCanceled, toApiError } from './apiError';
import { IS_MOCK_API } from '../lib/isMockApi';

const unknownError = (message) => new ApiError({ status: 0, code: API_ERROR_CODE.UNKNOWN, message });

const send = async (request) => {
  if (IS_MOCK_API) {
    throw unknownError('Das Quiz braucht das Backend. Setze VITE_USE_MOCK_API=false.');
  }

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

const readList = (data) => {
  if (!Array.isArray(data)) {
    throw unknownError('Die Antwort enthält keine Liste.');
  }

  return data;
};

const readAttempt = (data) => {
  if (typeof data?.id !== 'string' || typeof data.status !== 'string' || !Array.isArray(data.questions)) {
    throw unknownError('Die Antwort enthält keinen Test.');
  }

  return data;
};

// a%2Fb -> bleibt encoded - verhindern Manipulataion der URL bzw. attemptId
const attemptPath = (attemptId) => `/attempts/${encodeURIComponent(attemptId)}`;

export const fetchCategories = async ({ signal } = {}) =>
  readList(await send(() => api.get('/categories', { signal })));

export const fetchMyAttempts = async ({ signal } = {}) =>
  readList(await send(() => api.get('/attempts', { params: { mine: true }, signal })));

export const startAttempt = async ({ categoryIds, questionCount, timeLimitSec }) =>
  readAttempt(await send(() => api.post('/attempts', { categoryIds, questionCount, timeLimitSec })));

export const fetchAttempt = async (attemptId, { signal } = {}) =>
  readAttempt(await send(() => api.get(attemptPath(attemptId), { signal })));

export const saveAnswers = async (attemptId, answers) => {
  await send(() => api.put(`${attemptPath(attemptId)}/answers`, { answers }));
};

export const submitAttempt = async (attemptId, answers) =>
  readAttempt(await send(() => api.post(`${attemptPath(attemptId)}/submit`, { answers })));
