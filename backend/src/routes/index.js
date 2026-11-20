import { Router } from 'express';
import demoRouter from './demo.routes.js';
import modulesRouter from './modules.routes.js';

export const apiRouter = Router();

apiRouter.use('/demo', demoRouter); // '/demo/hallo?name=Max'
apiRouter.use('/modules', modulesRouter);

export default apiRouter;
