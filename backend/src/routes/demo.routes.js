import { Router } from 'express';
import { notFound } from '../lib/apiError.js';
import { requireJson } from '../middleware/requireJson.js';

export const demoRouter = Router();

demoRouter.get('/hallo', (req, res) => {
  const { name = 'Welt' } = req.query;
  res.json({ message: `Hallo ${name}` });
});

demoRouter.get('/module/:moduleId', (req, res) => {
  const { moduleId } = req.params;
  res.json({ moduleId, typ: typeof moduleId });
});

demoRouter.get('/nicht-da', () => {
  throw notFound('Dieser Eintrag existiert nicht');
});

demoRouter.get('/kaputt', async () => {
  await Promise.resolve();
  throw new Error('Absichtlicher Fehler für die Demo');
});

demoRouter.post('/echo', requireJson, (req, res) => {
  res.status(201).json({ received: req.body });
});

export default demoRouter;
