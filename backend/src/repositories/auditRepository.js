import { query } from '../config/db.js';

export async function createAuditLog({ actorId, actorType, action, metadata = {} }) {
  await query(
    'INSERT INTO audit_logs (actor_id, actor_type, action, metadata) VALUES ($1, $2, $3, $4)',
    [actorId, actorType, action, metadata]
  );
}
