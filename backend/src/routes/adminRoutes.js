import { Router } from 'express';
import { createNotice, overview } from '../controllers/adminController.js';
import { authenticate, requireRole } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { noticeSchema } from '../services/adminService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const adminRoutes = Router();

adminRoutes.use(authenticate, requireRole('admin'));
adminRoutes.get('/overview', asyncHandler(overview));
adminRoutes.post('/notices', validate(noticeSchema), asyncHandler(createNotice));
