import { Router } from 'express';
import { ask } from '../controllers/aiController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { askAiSchema } from '../services/aiService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const aiRoutes = Router();

aiRoutes.post('/ask', authenticate, validate(askAiSchema), asyncHandler(ask));
