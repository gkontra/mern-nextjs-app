// https://emailregex.com/index.html
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const PASSWORD_BLOCKLIST = ['passwort', 'password', '12345678', 'passwort1', 'qwertz123'];
// https://weakpass.com/wordlists/rockyou.txt

export const NAME_LENGTH = { min: 2, max: 50 };
export const PASSWORD_LENGTH = { min: 8, max: 72 };

const PASSWORD_LENGTH_MESSAGE = 'Das Passwort muss 8 bis 72 Zeichen lang sein.';
const EMAIL_MESSAGE = 'Bitte gib eine gültige E-Mail-Adresse ein.';
const ERROR_FIELDS = {
  NAME: 'Der Name muss 2 bis 50 Zeichen lang sein.',
  PASSWORD: { TOO_EASY: 'Dieses Passwort ist zu leicht zu erraten.', EMPTY: 'Bitte gib dein Passwort ein.' },
};

const isPasswordLengthValid = (password) =>
  password.length >= PASSWORD_LENGTH.min &&
  password.length <= PASSWORD_LENGTH.max &&
  Buffer.byteLength(password, 'utf8') <= PASSWORD_LENGTH.max;

export const validateRegistration = ({ name, email, password }) => {
  const fields = {};
  const trimmedName = name.trim();

  if (trimmedName.length < NAME_LENGTH.min || trimmedName.length > NAME_LENGTH.max) {
    fields.name = ERROR_FIELDS.NAME;
  }
  if (!EMAIL_PATTERN.test(email)) {
    fields.email = EMAIL_MESSAGE;
  }
  if (!isPasswordLengthValid(password)) {
    fields.password = PASSWORD_LENGTH_MESSAGE;
  } else if (PASSWORD_BLOCKLIST.includes(password.toLowerCase())) {
    fields.password = ERROR_FIELDS.PASSWORD.TOO_EASY;
  }

  return fields;
};

export const validateLogin = ({ email, password }) => {
  const fields = {};

  if (!EMAIL_PATTERN.test(email)) {
    fields.email = EMAIL_MESSAGE;
  }
  if (password.length === 0) {
    fields.password = ERROR_FIELDS.PASSWORD.EMPTY;
  }

  return fields;
};

export default {
  register: validateRegistration,
  login: validateLogin,
};

// import auth from './file';
// import {validateRegistration, validateLogin } from './file';
// auth.register()
// auth.login()
