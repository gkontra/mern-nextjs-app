import express from 'express';
import color from 'chalk';
import apiRouter from './routes/index.js'; // Kompletter Pfad angeben
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

export const app = express();

app.disable('x-powered-by'); // Es wird in HTTP-Response nicht angegeben, dass es sich um ein Express Server handelt
// Middleware
app.use(express.json({ limit: '10kb' }));

app.use((req, res, next) => {
  console.info(color.yellow(`${req.method} ${req.url}`));
  next();
});

// Routes
app.use(express.static('./public'));

// API Routes
app.use('/api', apiRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
