export const ERROR_CODE = {
  BAD_REQUEST: 'BAD_REQUEST',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  NOT_FOUND: 'NOT_FOUND',
  EMAIL_TAKEN: 'EMAIL_TAKEN',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
};

// https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Error
export class ApiError extends Error {
  constructor(status, code, message, fields = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

export const INTERNAL_ERROR_MESSAGE = 'Auf dem Server ist ein Fehler aufgetreten. Bitte versuche es später erneut.';

export const badRequest = () => new ApiError(400, ERROR_CODE.BAD_REQUEST, 'Die Anfrage ist ungültig.');

export const validationFailed = (fields) =>
  new ApiError(422, ERROR_CODE.VALIDATION_FAILED, 'Bitte prüfe deine Eingaben.', fields);

export const invalidCredentials = () =>
  new ApiError(401, ERROR_CODE.INVALID_CREDENTIALS, 'E-Mail oder Passwort ist falsch.');

export const unauthenticated = () => new ApiError(401, ERROR_CODE.UNAUTHENTICATED, 'Bitte melde dich an.');

export const notFound = (message) => new ApiError(404, ERROR_CODE.NOT_FOUND, message);

export const emailTaken = () =>
  new ApiError(409, ERROR_CODE.EMAIL_TAKEN, 'Diese E-Mail-Adresse ist bereits registriert.');

export const toErrorBody = ({ code, message, fields }) => ({
  error: fields ? { code, message, fields } : { code, message },
});
