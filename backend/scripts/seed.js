import { readFile } from 'node:fs/promises';
import color from 'chalk';

import config from '../src/config/index.js';
// import { connectDb, disconnectDb } from '../src/config/db.js';
import db from '../src/config/db.js';
import { insertOnly } from '../src/lib/insertOnly.js';
import Module from '../src/models/Module.js';

// console.log(import.meta.url);
// console.log('import meta: ', import.meta);

const MODULES_FILE = new URL('../seed-data/modules.json', import.meta.url);

// fs.readFile(path, 'utf-8', (error, data) => {})
// await readFile.promises(path, 'utf-8')
// await readfile(path, 'utf-8')

const seedModules = async () => {
  const modules = JSON.parse(await readFile(MODULES_FILE, 'utf-8'));
  const { inserted, existing } = await insertOnly(Module, modules, 'moduleId');

  return { inserted: inserted.length, existing };
};

try {
  await db.connect(config.mongodbUri);
  await Module.init();

  const modules = await seedModules();

  console.info(color.blueBright(`Module: ${modules.inserted} neu, ${modules.existing} vorhanden`));
} catch (error) {
  console.error(`Seed fehlgeschlagen: ${error.message}`);
  process.exitCode = 1;
} finally {
  await db.disconnect();
}
