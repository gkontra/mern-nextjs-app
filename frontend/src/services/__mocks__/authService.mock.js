import { API_ERROR_CODE, ApiError } from '../apiError';

const SESSION_KEY = 'mearn:mock-auth:session';
const USERS_KEY = 'mearn:mock-auth:users';
export const SERVER_ERROR_EMAIL = 'server-fehler@example.com';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_BLOCKLIST = ['passwort', 'password', '12345678', 'passwort1', 'qwertz123'];

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

const fail = (status, code, message, fields) => {
  throw new ApiError({ status, code, message, fields: fields ?? null });
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
    fail(
      500,
      API_ERROR_CODE.INTERNAL_ERROR,
      'Auf dem Server ist ein Fehler aufgetreten. Bitte versuche es später erneut.',
    );
  }
};

const requireStrings = (body, keys) => {
  if (keys.some((key) => typeof body?.[key] !== 'string')) {
    fail(400, API_ERROR_CODE.BAD_REQUEST, 'Die Anfrage ist ungültig.');
  }
};

const failIfInvalid = (fields) => {
  if (Object.keys(fields).length > 0) {
    fail(422, API_ERROR_CODE.VALIDATION_FAILED, 'Bitte prüfe deine Eingaben.', fields);
  }
};

const validateRegistration = ({ name, email, password }) => {
  const fields = {};
  const trimmedName = name.trim();

  if (trimmedName.length < 2 || trimmedName.length > 50) {
    fields.name = 'Der Name muss 2 bis 50 Zeichen lang sein.';
  }
  if (!EMAIL_PATTERN.test(email)) {
    fields.email = 'Bitte gib eine gültige E-Mail-Adresse ein.';
  }
  if (password.length < 8 || password.length > 72) {
    fields.password = 'Das Passwort muss 8 bis 72 Zeichen lang sein.';
  } else if (PASSWORD_BLOCKLIST.includes(password.toLowerCase())) {
    fields.password = 'Dieses Passwort ist zu leicht zu erraten.';
  }

  failIfInvalid(fields);
};

const validateLogin = ({ email, password }) => {
  const fields = {};

  if (!EMAIL_PATTERN.test(email)) {
    fields.email = 'Bitte gib eine gültige E-Mail-Adresse ein.';
  }
  if (password.length === 0) {
    fields.password = 'Bitte gib dein Passwort ein.';
  }

  failIfInvalid(fields);
};

export const register = async (body) => {
  await wait();
  requireStrings(body, ['name', 'email', 'password']);

  const email = body.email.trim().toLowerCase();
  failOnServerErrorEmail(email);
  validateRegistration({ ...body, email });

  if (readUsers().some((account) => account.email === email)) {
    fail(409, API_ERROR_CODE.EMAIL_TAKEN, 'Diese E-Mail-Adresse ist bereits registriert.');
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

  validateLogin({ email, password: body.password });

  const account = readUsers().find((item) => item.email === email && item.password === body.password);

  if (!account) {
    fail(401, API_ERROR_CODE.INVALID_CREDENTIALS, 'E-Mail oder Passwort ist falsch.');
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
    fail(401, API_ERROR_CODE.UNAUTHENTICATED, 'Bitte melde dich an.');
  }

  return toPublicUser(account);
};
