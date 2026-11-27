import axios from 'axios';
import { ERROR_CODE } from '@mearn/shared/errors';

export const API_ERROR_CODE = {
  ...ERROR_CODE,
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  UNKNOWN: 'UNKNOWN',
};

export class ApiError extends Error {
  constructor({ status, code, message, fields = null }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

export const isRequestCanceled = (error) => axios.isCancel(error) || error?.name === 'AbortError';

export const toApiError = (error) => {
  if (error instanceof ApiError) {
    return error;
  }

  if (!axios.isAxiosError(error)) {
    return new ApiError({
      status: 0,
      code: API_ERROR_CODE.UNKNOWN,
      message: 'Ein unerwarteter Fehler ist aufgetreten.',
    });
  }

  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return new ApiError({
      status: 0,
      code: API_ERROR_CODE.TIMEOUT,
      message: 'Der Server hat zu lange nicht geantwortet.',
    });
  }

  if (!error.response) {
    return new ApiError({ status: 0, code: API_ERROR_CODE.NETWORK_ERROR, message: 'Der Server ist nicht erreichbar.' });
  }

  const { status, data } = error.response;
  const body = data?.error;

  return new ApiError({
    status,
    code: body?.code ?? API_ERROR_CODE.UNKNOWN,
    message: body?.message ?? `Der Server antwortete mit Status ${status}.`,
    fields: body?.fields ?? null,
  });
};

// wie es sein soll: { "id": "string", "name": "string", "email": "string", "role": "participant" }
// wie ein Fehler zurückgegeben werden soll:
/*
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Bitte prüfe deine Eingaben.",
    "fields": { "password": "Das Passwort muss 8 bis 72 Zeichen lang sein." }
  }
}
*/
