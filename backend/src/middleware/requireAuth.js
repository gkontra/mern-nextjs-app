import { unauthenticated } from '../lib/apiError.js';
import { AUTH_COOKIE } from '../lib/cookieOptions.js';
import { verifyToken } from '../lib/jwt.js';

export const requireAuth = (req, res, next) => {
  const token = req.cookies?.[AUTH_COOKIE];

  if (!token) {
    next(unauthenticated());
    return;
  }

  try {
    req.auth = verifyToken(token);
  } catch {
    next(unauthenticated());
    return;
  }
  next();
};

export default requireAuth;
