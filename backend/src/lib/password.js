import bcrypt from 'bcryptjs';
import config from '../config/index.js';

let dummyHash;

export const hashPassword = (password) => bcrypt.hash(password, config.bcryptCost);

export const verifyPassword = async (password, hash) => {
  if (hash) {
    return bcrypt.compare(password, hash);
  }
  // if (dummyHash === null || dummyHash === undefined) {
  //   dummyHash = await hashPassword('kein-echtes-konto');
  // }
  // Nullish Coalescing Assignment
  dummyHash ??= await hashPassword('kein-echtes-konto');

  await bcrypt.compare(password, dummyHash);
  return false;
};
