import { NAME_LENGTH, PASSWORD_LENGTH } from './limits.js';

export const AUTH_MESSAGES = {
  nameLength: ({ min, max } = NAME_LENGTH) => `Der Name muss ${min} bis ${max} Zeichen lang sein.`,
  emailRequired: 'Bitte gib deine E-Mail-Adresse ein.',
  emailInvalid: 'Bitte gib eine gültige E-Mail-Adresse ein, z. B. name@example.com.',
  passwordRequired: 'Bitte gib dein Passwort ein.',
  passwordLength: ({ min, max } = PASSWORD_LENGTH) => `Das Passwort muss ${min} bis ${max} Zeichen lang sein.`,
  passwordHint: ({ min, max } = PASSWORD_LENGTH) => `${min} bis ${max} Zeichen.`,
  passwordTooCommon: 'Dieses Passwort ist zu leicht zu erraten.',
};
