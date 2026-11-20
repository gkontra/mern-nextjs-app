import dotenv from 'dotenv';

dotenv.config();

const PLACEHOLDER_SECRET = 'bitte-durch-einen-langen-zufallswert-ersetzen';
const MIN_SECRET_LENGTH = 32;

const fail = (message) => {
  throw new Error(`Konfiguration unvollständig: ${message} (siehe backend/.env-example)`);
};

const required = (name) => {
  const value = process.env[name]?.trim();

  if (!value) {
    fail(`${name} fehlt.`);
  }

  return value;
};

const readJwtSecret = () => {
  const secret = required('JWT_SECRET');

  if (secret === PLACEHOLDER_SECRET) {
    fail('JWT_SECRET ist noch der Platzhalter.');
  }
  if (secret.length < MIN_SECRET_LENGTH) {
    fail(`JWT_SECRET muss mindestens ${MIN_SECRET_LENGTH} Zeichen lang sein.`);
  }

  return secret;
};

const nodeEnv = process.env.NODE_ENV ?? 'development';

export const config = Object.freeze({
  nodeEnv,
  isProduction: nodeEnv === 'production',
  isTest: nodeEnv === 'test',
  port: Number(process.env.PORT ?? 3000),
  mongodbUri: required('MONGODB_URI'),
  jwtSecret: readJwtSecret(),
  clientOrigin: required('CLIENT_ORIGIN'),
  bcryptCost: nodeEnv === 'test' ? 4 : 12,
});

export default config;
