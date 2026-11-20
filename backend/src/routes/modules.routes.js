import { Router } from 'express';

import { getPublished, listPublished } from '../controllers/modules.controller.js';

export const modulesRouter = Router();

modulesRouter.get('/', listPublished);

modulesRouter.get('/:moduleId', getPublished);

export default modulesRouter;
