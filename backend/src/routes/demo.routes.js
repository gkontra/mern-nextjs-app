import { Router } from 'express';

export const demoRouter = Router();

demoRouter.get('/hallo', (req, res) => {
  const { name = 'Welt' } = req.query;
  res.json({ message: `Hallo ${name}` });
});

demoRouter.get('/module/:moduleId', (req, res) => {
  const { moduleId } = req.params;
  res.json({ moduleId, typ: typeof moduleId });
});

export default demoRouter;
