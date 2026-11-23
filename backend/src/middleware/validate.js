import { badRequest, validationFailed } from '../lib/apiError.js';

export const requireStringFields = (keys) => (req, res, next) => {
  if (keys.some((key) => typeof req.body?.[key] !== 'string')) {
    next(badRequest());
    return;
  }
  next();
};

export const validate = (rules) => (req, res, next) => {
  const fields = rules(req.body);

  if (Object.keys(fields).length > 0) {
    next(validationFailed(fields));
    return;
  }
  next();
};
