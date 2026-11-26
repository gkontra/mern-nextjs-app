import { byteLength, withoutEmpty } from '../lib/index.js';
import { EMAIL_PATTERN, NAME_LENGTH, PASSWORD_BLOCKLIST, PASSWORD_LENGTH } from './limits.js';
import { AUTH_MESSAGES } from './messages.js';

const isInRange = (value, { min, max }) => value >= min && value <= max;

const validateName = (name) => (isInRange(name.trim().length, NAME_LENGTH) ? null : AUTH_MESSAGES.nameLength());

export const validateEmail = (email) => {
  const trimmedEmail = email.trim();

  if (trimmedEmail === '') {
    return AUTH_MESSAGES.emailRequired;
  }
  if (!EMAIL_PATTERN.test(trimmedEmail)) {
    return AUTH_MESSAGES.emailInvalid;
  }
  return null;
};

const validateNewPassword = (password) => {
  if (password === '') {
    return AUTH_MESSAGES.passwordRequired;
  }
  if (!isInRange(password.length, PASSWORD_LENGTH) || byteLength(password) > PASSWORD_LENGTH.max) {
    return AUTH_MESSAGES.passwordLength();
  }
  if (PASSWORD_BLOCKLIST.includes(password.toLowerCase())) {
    return AUTH_MESSAGES.passwordTooCommon;
  }
  return null;
};

export const validateRegistration = ({ name, email, password }) =>
  withoutEmpty({
    name: validateName(name),
    email: validateEmail(email),
    password: validateNewPassword(password),
  });

export const validateLogin = ({ email, password }) =>
  withoutEmpty({
    email: validateEmail(email),
    password: password === '' ? AUTH_MESSAGES.passwordRequired : null,
  });
