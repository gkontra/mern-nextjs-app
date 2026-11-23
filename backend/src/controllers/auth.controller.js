import { emailTaken, invalidCredentials, unauthenticated } from '../lib/apiError.js';
import { AUTH_COOKIE, authCookieOptions, clearedCookieOptions } from '../lib/cookieOptions.js';
import { signToken } from '../lib/jwt.js';
import { hashPassword, verifyPassword } from '../lib/password.js';
import { toPublicUser } from '../lib/publicUser.js';
import User from '../models/User.js';

const sendWithSession = (res, status, userDoc) => {
  const user = toPublicUser(userDoc); // allow List
  res.cookie(AUTH_COOKIE, signToken(user), authCookieOptions);
  res.status(status).json({ user });
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (await User.exists({ email })) {
    throw emailTaken();
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({ name: name.trim(), email, passwordHash, role: 'participant' });

  sendWithSession(res, 201, user);
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+passwordHash');
  const isValid = await verifyPassword(password, user?.passwordHash);

  if (!user || !isValid) {
    throw invalidCredentials();
  }

  // const newUser = { passwordHash: _ , ...user};
  // sendWithSession(res, 200, newUser);

  sendWithSession(res, 200, user);
};

export const logout = (req, res) => {
  res.cookie(AUTH_COOKIE, '', clearedCookieOptions);
  res.status(204).end();
};

export const me = async (req, res) => {
  const user = await User.findById(req.auth.userId);

  if (!user) {
    throw unauthenticated();
  }

  res.json({ user: toPublicUser(user) });
};
