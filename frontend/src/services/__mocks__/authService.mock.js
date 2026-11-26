import { validateLogin, validateRegistration } from '@mearn/shared/auth';
import { ERROR_MESSAGES } from '@mearn/shared/errors';
import { API_ERROR_CODE, ApiError } from '../apiError';

const SESSION_KEY = 'mearn:mock-auth:session';
const USERS_KEY = 'mearn:mock-auth:users';
export const SERVER_ERROR_EMAIL = 'server-fehler@example.com';

export const DEMO_ACCOUNTS = [
  {
    id: 'mock-user-1',
    name: 'Demo Teilnehmer:in',
    email: 'teilnehmer@example.com',
    password: 'kurs-demo-123',
    role: 'participant',
  },
  {
    id: 'mock-user-2',
    name: 'Demo Trainer:in',
    email: 'trainer@example.com',
    password: 'trainer-demo-123',
    role: 'trainer',
  },
];

const fail = (status, code, fields = null) => {
  throw new ApiError({ status, code, message: ERROR_MESSAGES[code], fields });
};

const abortError = () => new DOMException('Die Anfrage wurde abgebrochen.', 'AbortError');

const wait = (signal) =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError());
      return;
    }

    const timer = setTimeout(resolve, 300 + Math.random() * 600);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(abortError());
      },
      { once: true },
    );
  });

const readJson = (key, fallback) => {
  try {
    return JSON.parse(sessionStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const readUsers = () => [...DEMO_ACCOUNTS, ...readJson(USERS_KEY, [])];

const toPublicUser = ({ id, name, email, role }) => ({ id, name, email, role });

const startSession = (account) => {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ userId: account.id }));
  return toPublicUser(account);
};

const failOnServerErrorEmail = (email) => {
  if (email === SERVER_ERROR_EMAIL) {
    fail(500, API_ERROR_CODE.INTERNAL_ERROR);
  }
};

const requireStrings = (body, keys) => {
  if (keys.some((key) => typeof body?.[key] !== 'string')) {
    fail(400, API_ERROR_CODE.BAD_REQUEST);
  }
};

const failIfInvalid = (fields) => {
  if (Object.keys(fields).length > 0) {
    fail(422, API_ERROR_CODE.VALIDATION_FAILED, fields);
  }
};

export const register = async (body) => {
  await wait();
  requireStrings(body, ['name', 'email', 'password']);

  const email = body.email.trim().toLowerCase();
  failOnServerErrorEmail(email);
  failIfInvalid(validateRegistration({ ...body, email }));

  if (readUsers().some((account) => account.email === email)) {
    fail(409, API_ERROR_CODE.EMAIL_TAKEN);
  }

  const account = {
    id: `mock-${crypto.randomUUID()}`,
    name: body.name.trim(),
    email,
    password: body.password,
    role: 'participant',
  };
  sessionStorage.setItem(USERS_KEY, JSON.stringify([...readJson(USERS_KEY, []), account]));

  return startSession(account);
};

export const login = async (body) => {
  await wait();
  requireStrings(body, ['email', 'password']);

  const email = body.email.trim().toLowerCase();
  failOnServerErrorEmail(email);

  failIfInvalid(validateLogin({ email, password: body.password }));

  const account = readUsers().find((item) => item.email === email && item.password === body.password);

  if (!account) {
    fail(401, API_ERROR_CODE.INVALID_CREDENTIALS);
  }

  return startSession(account);
};

export const logout = async () => {
  await wait();
  sessionStorage.removeItem(SESSION_KEY);
};

export const fetchMe = async ({ signal } = {}) => {
  await wait(signal);

  const { userId } = readJson(SESSION_KEY, {});
  const account = readUsers().find((item) => item.id === userId);

  if (!account) {
    fail(401, API_ERROR_CODE.UNAUTHENTICATED);
  }

  return toPublicUser(account);
};
