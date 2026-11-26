import { isObjectIdOrHexString } from 'mongoose';
import { forbidden, notFound } from '../lib/apiError.js';
import Attempt from '../models/Attempt.js';

export const loadOwnAttempt = async (req, res, next) => {
  const { id } = req.params;
  const attempt = isObjectIdOrHexString(id) ? await Attempt.findById(id).lean() : null;

  if (!attempt) {
    throw notFound('Diesen Test gibt es nicht.');
  }
  if (!attempt.userId.equals(req.auth.userId)) {
    throw forbidden();
  }

  req.attempt = attempt;
  next();
};

export default loadOwnAttempt;
