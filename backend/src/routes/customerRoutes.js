import { Router } from 'express';
import { dashboard } from '../controllers/customerController.js';
import { authenticate } from '../middlewares/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const customerRoutes = Router();

customerRoutes.get('/dashboard', authenticate, asyncHandler(dashboard));
