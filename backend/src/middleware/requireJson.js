import { badRequest } from '../lib/apiError.js';

export const requireJson = (req, res, next) => {
  // if (!req.headers['Content-Type'] === 'appplication/json') {

  if (!req.is('application/json')) {
    next(badRequest());
    return; // paranoia
  }
  next();
};

export default requireJson;
