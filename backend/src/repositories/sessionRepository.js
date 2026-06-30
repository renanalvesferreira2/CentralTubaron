import { query } from '../config/db.js';
import { env } from '../config/env.js';

export async function createSession({ subjectId, subjectType, tokenHash, expiresAt }) {
  if (env.demoMode) return;

  await query(
    'INSERT INTO sessions (subject_id, subject_type, token_hash, expires_at) VALUES ($1, $2, $3, $4)',
    [subjectId, subjectType, tokenHash, expiresAt]
  );
}

export async function findActiveSession(tokenHash) {
  if (env.demoMode) return { active: true };

  const { rows } = await query(
    'SELECT id FROM sessions WHERE token_hash = $1 AND expires_at > NOW() LIMIT 1',
    [tokenHash]
  );

  return rows[0] || null;
}

export async function revokeSession(tokenHash) {
  if (env.demoMode) return;

  await query('DELETE FROM sessions WHERE token_hash = $1', [tokenHash]);
}
