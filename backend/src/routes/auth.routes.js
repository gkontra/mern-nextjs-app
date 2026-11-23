import { Router } from 'express';
import { login, logout, me, register } from '../controllers/auth.controller.js';
import { validateLogin, validateRegistration } from '../lib/authValidation.js';
import normalizeEmail from '../middleware/normalizeEmail.js';
import requireAuth from '../middleware/requireAuth.js';
import requireJson from '../middleware/requireJson.js';
import simulateServerError from '../middleware/simulateServerError.js';
import { requireStringFields, validate } from '../middleware/validate.js';

export const authRouter = Router();

// const app = express();
// obj.method('path, ...middlewares, (req, res) => {})
// app.post('/products', cors(), (req, res) => {
//   const { product } = req.body;
// });

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
