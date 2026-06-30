import { query } from '../config/db.js';
import { env } from '../config/env.js';

export async function createAuditLog({ actorId, actorType, action, metadata = {} }) {
  if (env.demoMode) {
    console.info('Audit demo log', { actorId, actorType, action, metadata });
    return;
  }

  await query(
    'INSERT INTO audit_logs (actor_id, actor_type, action, metadata) VALUES ($1, $2, $3, $4)',
    [actorId, actorType, action, metadata]
  );
}
