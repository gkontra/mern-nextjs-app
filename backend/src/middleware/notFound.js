import { notFound as notFoundError } from '../lib/apiError.js';

// Middleware
export const notFound = (req, res, next) => {
  next(notFoundError('Diese Route gibt es nicht.'));
};

export default notFound;
