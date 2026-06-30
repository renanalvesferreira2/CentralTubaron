import { Router } from 'express';
import { createRequest, premium, reboot, updateWifi } from '../controllers/supportController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { supportRequestSchema, wifiSchema } from '../services/supportService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const supportRoutes = Router();

supportRoutes.get('/premium', authenticate, asyncHandler(premium));
supportRoutes.post('/requests', authenticate, validate(supportRequestSchema), asyncHandler(createRequest));
supportRoutes.patch('/wifi', authenticate, validate(wifiSchema), asyncHandler(updateWifi));
supportRoutes.post('/reboot', authenticate, asyncHandler(reboot));
