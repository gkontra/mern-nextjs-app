import color from 'chalk';

import app from './app.js'; // Dateiendung (kompletter Pfad) notwendig.
import config from './config/index.js'; // Dateiendung (kompletter Pfad) notwendig.
import { connectDb } from './config/db.js';
// import db from './config/db.js'; // wäre alternativ auch möglich

try {
  // (async () => await connectDb(config.mongodbUri))();
  await connectDb(config.mongodbUri);
} catch (error) {
  console.error(`MongoDB ist nicht erreichbar (${config.mongodbUri}): ${error.message}`);
  process.exit(1);
}

app.listen(config.port, () => {
  console.info(color.magenta(`Server läuft auf http://127.0.0.1:${config.port}`));
});
