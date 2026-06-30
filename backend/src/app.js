import express from 'express';
import morgan from 'morgan';
import { routes } from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import { sanitizeInput } from './middlewares/sanitize.js';
import { securityMiddlewares } from './middlewares/security.js';

export function createApp() {
  const app = express();

  app.use(securityMiddlewares);
  app.use(express.json({ limit: '1mb' }));
  app.use(sanitizeInput);
  app.use(morgan('combined'));
  app.use('/api', routes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
