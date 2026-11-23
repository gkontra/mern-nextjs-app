import { readFile } from 'node:fs/promises';
import color from 'chalk';

import config from '../src/config/index.js';
// import { connectDb, disconnectDb } from '../src/config/db.js';
import db from '../src/config/db.js';
import { insertOnly } from '../src/lib/insertOnly.js';
import { hashPassword } from '../src/lib/password.js';
import Module from '../src/models/Module.js';
import User from '../src/models/User.js';

// console.log(import.meta.url);
// console.log('import meta: ', imp^ort.meta);

const MODULES_FILE = new URL('../seed-data/modules.json', import.meta.url);
const DEMO_ACCOUNTS = [
  { name: 'Demo Teilnehmer:in', email: 'teilnehmer@example.com', password: 'kurs-demo-123', role: 'participant' },
  { name: 'Demo Trainer:in', email: 'trainer@example.com', password: 'trainer-demo-123', role: 'trainer' },
];

// fs.readFile(path, 'utf-8', (error, data) => {})
// await readFile.promises(path, 'utf-8')
// await readfile(path, 'utf-8')

const seedModules = async () => {
  const modules = JSON.parse(await readFile(MODULES_FILE, 'utf-8'));
  const { inserted, existing } = await insertOnly(Module, modules, 'moduleId');

  return { inserted: inserted.length, existing };
};

const seedAccounts = async () => {
  let inserted = 0;

  for (const { password, ...account } of DEMO_ACCOUNTS) {
    if (!(await User.exists({ email: account.email }))) {
      await User.create({ ...account, passwordHash: await hashPassword(password) });
      inserted += 1;
    }
  }

  return { inserted, existing: DEMO_ACCOUNTS.length - inserted };
};

try {
  await db.connect(config.mongodbUri);
  await Promise.all([Module.init(), User.init()]);

  const modules = await seedModules();
  const accounts = await seedAccounts();

  console.info(color.blueBright(`Module: ${modules.inserted} neu, ${modules.existing} vorhanden`));
  console.info(color.blueBright(`User: ${accounts.inserted} neu, ${accounts.existing} vorhanden`));
} catch (error) {
  console.error(`Seed fehlgeschlagen: ${error.message}`);
  process.exitCode = 1;
} finally {
  await db.disconnect();
}
