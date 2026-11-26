import { ERROR_CODE, ERROR_MESSAGES } from '@mearn/shared/errors';

export class ApiError extends Error {
  constructor(status, code, message, fields = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

export const badRequest = () => new ApiError(400, ERROR_CODE.BAD_REQUEST, ERROR_MESSAGES.BAD_REQUEST);

export const validationFailed = (fields) =>
  new ApiError(422, ERROR_CODE.VALIDATION_FAILED, ERROR_MESSAGES.VALIDATION_FAILED, fields);

export const invalidCredentials = () =>
  new ApiError(401, ERROR_CODE.INVALID_CREDENTIALS, ERROR_MESSAGES.INVALID_CREDENTIALS);

export const unauthenticated = () => new ApiError(401, ERROR_CODE.UNAUTHENTICATED, ERROR_MESSAGES.UNAUTHENTICATED);

export const forbidden = () => new ApiError(403, ERROR_CODE.FORBIDDEN, ERROR_MESSAGES.FORBIDDEN);

export const notFound = (message) => new ApiError(404, ERROR_CODE.NOT_FOUND, message);

export const emailTaken = () => new ApiError(409, ERROR_CODE.EMAIL_TAKEN, ERROR_MESSAGES.EMAIL_TAKEN);

export const attemptRunning = () => new ApiError(409, ERROR_CODE.ATTEMPT_RUNNING, ERROR_MESSAGES.ATTEMPT_RUNNING);

export const attemptClosed = () => new ApiError(409, ERROR_CODE.ATTEMPT_CLOSED, ERROR_MESSAGES.ATTEMPT_CLOSED);

export const toErrorBody = ({ code, message, fields }) => ({
  error: fields ? { code, message, fields } : { code, message },
});
