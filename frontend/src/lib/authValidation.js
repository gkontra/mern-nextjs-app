const EMAIL_PATTERN = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

export const PASSWORD_MIN_LENGTH = 8;

const validateEmail = (email) => {
  if (email.trim() === '') {
    return 'Bitte gib deine E-Mail-Adresse ein.';
  }
  if (!EMAIL_PATTERN.test(email.trim())) {
    return 'Bitte gib eine gültige E-Mail-Adresse ein.';
  }
  return null;
};

const validatePassword = (password) => {
  if (password === '') {
    return 'Bitte gib dein Passwort ein.';
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Das Passwort braucht mindestens ${PASSWORD_MIN_LENGTH} Zeichen.`;
  }
  return null;
};

const withoutEmpty = (errors) => Object.fromEntries(Object.entries(errors).filter(([, message]) => message));

export const validateLogin = ({ email, password }) =>
  withoutEmpty({
    email: validateEmail(email),
    password: validatePassword(password),
  });

export const validateRegister = ({ name, email, password, passwordConfirm }) => {
  const trimmedName = name.trim();

  return withoutEmpty({
    name: trimmedName.length < 2 || trimmedName.length > 50 ? 'Der Name muss 2 bis 50 Zeichen lang sein.' : null,
    email: validateEmail(email),
    password: validatePassword(password),
    passwordConfirm: passwordConfirm !== password ? 'Die Passwörter stimmen nicht überein.' : null,
  });
};
