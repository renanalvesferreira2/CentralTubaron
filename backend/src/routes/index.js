import { Router } from 'express';
import { adminRoutes } from './adminRoutes.js';
import { aiRoutes } from './aiRoutes.js';
import { authRoutes } from './authRoutes.js';
import { customerRoutes } from './customerRoutes.js';
import { supportRoutes } from './supportRoutes.js';

export const routes = Router();

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Central do Assinante Tubaron' });
});

routes.use('/auth', authRoutes);
routes.use('/customer', customerRoutes);
routes.use('/ai', aiRoutes);
routes.use('/support', supportRoutes);
routes.use('/admin', adminRoutes);
