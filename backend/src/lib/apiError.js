export const ERROR_CODE = {
  BAD_REQUEST: 'BAD_REQUEST',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  EMAIL_TAKEN: 'EMAIL_TAKEN',
  ATTEMPT_RUNNING: 'ATTEMPT_RUNNING',
  ATTEMPT_CLOSED: 'ATTEMPT_CLOSED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
};

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

export const forbidden = () => new ApiError(403, ERROR_CODE.FORBIDDEN, 'Dieser Test gehört zu einem anderen Konto.');

export const notFound = (message) => new ApiError(404, ERROR_CODE.NOT_FOUND, message);

export const emailTaken = () =>
  new ApiError(409, ERROR_CODE.EMAIL_TAKEN, 'Diese E-Mail-Adresse ist bereits registriert.');

export const attemptRunning = () =>
  new ApiError(
    409,
    ERROR_CODE.ATTEMPT_RUNNING,
    'Du hast bereits einen laufenden Test. Setze ihn fort oder gib ihn ab.',
  );

export const attemptClosed = () => new ApiError(409, ERROR_CODE.ATTEMPT_CLOSED, 'Dieser Test ist bereits abgegeben.');

export const toErrorBody = ({ code, message, fields }) => ({
  error: fields ? { code, message, fields } : { code, message },
});
