import pg from 'pg';
import { env } from './env.js';
import { AppError } from '../utils/AppError.js';

export const pool = env.databaseUrl
  ? new pg.Pool({
      connectionString: env.databaseUrl,
      max: 12,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    })
  : null;

export async function query(text, params = []) {
  if (!pool) {
    throw new AppError('Banco de dados nao configurado para este ambiente.', 503);
  }

  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;

  if (duration > 400) {
    console.warn('Slow query detected', { duration, statement: text.split(/\s+/).slice(0, 4).join(' ') });
  }

  return result;
}
