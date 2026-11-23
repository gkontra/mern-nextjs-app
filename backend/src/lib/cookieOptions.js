import config from '../config/index.js';

export const AUTH_COOKIE = 'auth_token';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const baseOptions = {
  httpOnly: true,
  sameSite: 'lax',
  path: '/',
  secure: config.isProduction, // https if true
};

export const authCookieOptions = { ...baseOptions, maxAge: ONE_DAY_MS };

export const clearedCookieOptions = { ...baseOptions, maxAge: 0 };
