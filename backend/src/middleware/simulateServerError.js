import config from '../config/index.js';

export const SERVER_ERROR_EMAIL = 'server-fehler@example.com';

export const simulateServerError = (req, res, next) => {
  if (!config.isProduction && req.body.email === SERVER_ERROR_EMAIL) {
    throw new Error(`Simulierter Serverfehler für ${SERVER_ERROR_EMAIL}`);
  }
  next();
};

export default simulateServerError;
