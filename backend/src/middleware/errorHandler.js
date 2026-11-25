import {
  ApiError,
  ERROR_CODE,
  INTERNAL_ERROR_MESSAGE,
  attemptRunning,
  badRequest,
  emailTaken,
  toErrorBody,
} from '../lib/apiError.js';

const BODY_PARSER_ERRORS = ['entity.parse.failed', 'entity.too.large', 'encoding.unsupported', 'charset.unsupported'];

const isDuplicateKey = (error, key) => error?.code === 11000 && Object.hasOwn(error.keyPattern ?? {}, key);

const toApiError = (error) => {
  if (error instanceof ApiError) {
    return error;
  }
  if (BODY_PARSER_ERRORS.includes(error?.type)) {
    return badRequest();
  }
  if (isDuplicateKey(error, 'email')) {
    return emailTaken();
  }
  if (isDuplicateKey(error, 'userId')) {
    return attemptRunning();
  }
  return null;
};

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const apiError = toApiError(error);

  if (apiError) {
    res.status(apiError.status).json(toErrorBody(apiError));
    return;
  }

  console.error(error);
  res.status(500).json(toErrorBody({ code: ERROR_CODE.INTERNAL_ERROR, message: INTERNAL_ERROR_MESSAGE }));
};

export default errorHandler;
