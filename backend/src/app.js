import express from 'express';

export const app = express();

app.disable('x-powered-by'); // Es wird in HTTP-Response nicht angegeben, dass es sich um ein Express Server handelt
// Middleware
app.use(express.json({ limit: '10kb' }));

app.use(express.static('./public'));

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use((req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Diese Route gibt es nicht.' } });
});

export default app;
