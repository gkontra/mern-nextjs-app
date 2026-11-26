export const ERROR_CODE = {
  BAD_REQUEST: 'BAD_REQUEST',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  EMAIL_TAKEN: 'EMAIL_TAKEN',
  ATTEMPT_RUNNING: 'ATTEMPT_RUNNING',
  ATTEMPT_CLOSED: 'ATTEMPT_CLOSED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
};

export const ERROR_MESSAGES = {
  BAD_REQUEST: 'Die Anfrage ist ungültig.',
  VALIDATION_FAILED: 'Bitte prüfe deine Eingaben.',
  INVALID_CREDENTIALS: 'E-Mail oder Passwort ist falsch.',
  UNAUTHENTICATED: 'Bitte melde dich an.',
  FORBIDDEN: 'Dieser Test gehört zu einem anderen Konto.',
  EMAIL_TAKEN: 'Diese E-Mail-Adresse ist bereits registriert.',
  ATTEMPT_RUNNING: 'Du hast bereits einen laufenden Test. Setze ihn fort oder gib ihn ab.',
  ATTEMPT_CLOSED: 'Dieser Test ist bereits abgegeben.',
  INTERNAL_ERROR: 'Auf dem Server ist ein Fehler aufgetreten. Bitte versuche es später erneut.',
};
