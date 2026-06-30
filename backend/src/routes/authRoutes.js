import { Router } from 'express';
import { adminLogin, login, logout } from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { loginLimiter } from '../middlewares/security.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { adminLoginSchema, loginSchema } from '../services/authService.js';

export const authRoutes = Router();

authRoutes.post('/login', loginLimiter, validate(loginSchema), asyncHandler(login));
authRoutes.post('/admin/login', loginLimiter, validate(adminLoginSchema), asyncHandler(adminLogin));
authRoutes.post('/logout', authenticate, asyncHandler(logout));
