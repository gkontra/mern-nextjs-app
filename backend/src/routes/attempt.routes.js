import { Router } from 'express';
import { createAttempt, getAttempt, saveAnswers, submitAttempt } from '../controllers/attempts.controller.js';
import loadOwnAttempt from '../middleware/loadOwnAttempt.js';
import requireAuth from '../middleware/requireAuth.js';
import requireJson from '../middleware/requireJson.js';
import { requireAnswersBody, requireAttemptBody } from '../middleware/validate.js';

export const attemptsRouter = Router();

attemptsRouter.use(requireAuth);

attemptsRouter.post('/', requireJson, requireAttemptBody, createAttempt);
attemptsRouter.get('/:id', loadOwnAttempt, getAttempt);
attemptsRouter.put('/:id/answers', requireJson, requireAnswersBody, loadOwnAttempt, saveAnswers);
attemptsRouter.post('/:id/submit', requireJson, requireAnswersBody, loadOwnAttempt, submitAttempt);

export default attemptsRouter;
