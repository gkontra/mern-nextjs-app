import jwt from 'jsonwebtoken';
import config from '../config/index.js';

const ALGORITHM = 'HS256';

export const signToken = ({ id, role }) =>
  jwt.sign({ role }, config.jwtSecret, { subject: id, expiresIn: '1d', algorithm: ALGORITHM });

export const verifyToken = (token) => {
  const { sub, role } = jwt.verify(token, config.jwtSecret, { algorithms: [ALGORITHM] });
  return { userId: sub, role };
};
