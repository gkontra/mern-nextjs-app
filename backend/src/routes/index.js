import { Router } from 'express';
import demoRouter from './demo.routes.js';

export const apiRouter = Router();

apiRouter.use('/demo', demoRouter); // '/demo/hallo?name=Max'

export default apiRouter;
