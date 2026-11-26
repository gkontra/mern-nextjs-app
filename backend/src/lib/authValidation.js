import { validateLogin, validateRegistration } from '@mearn/shared/auth';
import { Router } from 'express';
import { login, logout, me, register } from '../controllers/auth.controller.js';
import normalizeEmail from '../middleware/normalizeEmail.js';
import requireAuth from '../middleware/requireAuth.js';
import requireJson from '../middleware/requireJson.js';
import simulateServerError from '../middleware/simulateServerError.js';
import { requireStringFields, validate } from '../middleware/validate.js';

export const authRouter = Router();

authRouter.post(
  '/register',
  requireJson,
  requireStringFields(['name', 'email', 'password']),
  normalizeEmail,
  simulateServerError,
  validate(validateRegistration),
  register,
);

authRouter.post(
  '/login',
  requireJson,
  requireStringFields(['email', 'password']),
  normalizeEmail,
  simulateServerError,
  validate(validateLogin),
  login,
);

authRouter.post('/logout', logout);

authRouter.get('/me', requireAuth, me);

export default authRouter;
