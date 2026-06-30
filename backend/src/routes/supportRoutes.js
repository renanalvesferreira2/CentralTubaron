import { Router } from 'express';
import { premium, reboot, updateWifi } from '../controllers/supportController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { wifiSchema } from '../services/supportService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const supportRoutes = Router();

supportRoutes.get('/premium', authenticate, asyncHandler(premium));
supportRoutes.patch('/wifi', authenticate, validate(wifiSchema), asyncHandler(updateWifi));
supportRoutes.post('/reboot', authenticate, asyncHandler(reboot));
