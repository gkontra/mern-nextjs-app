import { Router } from 'express';
import demoRouter from './demo.routes.js';
import modulesRouter from './modules.routes.js';
import authRouter from './auth.routes.js';
import categoriesRouter from './categories.routes.js';
import attemptsRouter from './attempt.routes.js';

export const apiRouter = Router();

apiRouter.use('/demo', demoRouter); // '/demo/hallo?name=Max'
apiRouter.use('/auth', authRouter);
apiRouter.use('/modules', modulesRouter);
apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/attempts', attemptsRouter);

export default apiRouter;
