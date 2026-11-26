import { Router } from 'express';
import { createAttempt, getAttempt } from '../controllers/attempts.controller.js';
import loadOwnAttempt from '../middleware/loadOwnAttempt.js';
import requireAuth from '../middleware/requireAuth.js';
import requireJson from '../middleware/requireJson.js';
import { requireAttemptBody } from '../middleware/validate.js';

export const attemptsRouter = Router();

attemptsRouter.use(requireAuth);

attemptsRouter.post('/', requireJson, requireAttemptBody, createAttempt);

attemptsRouter.get('/:id', loadOwnAttempt, getAttempt);

export default attemptsRouter;
