import { ApiError, ERROR_CODE, INTERNAL_ERROR_MESSAGE, badRequest, emailTaken, toErrorBody } from '../lib/apiError.js';

const BODY_PARSER_ERRORS = ['entity.parse.failed', 'entity.too.large', 'encoding.unsupported', 'charset.unsupported'];

const isDuplicateEmail = (error) => error?.code === 11000 && Object.hasOwn(error.keyPattern ?? {}, 'email');

const toApiError = (error) => {
  if (error instanceof ApiError) {
    return error;
  }
  if (BODY_PARSER_ERRORS.includes(error?.type)) {
    return badRequest();
  }
  if (isDuplicateEmail(error)) {
    return emailTaken();
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
