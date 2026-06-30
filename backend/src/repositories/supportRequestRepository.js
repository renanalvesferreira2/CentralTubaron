import { query } from '../config/db.js';
import { env } from '../config/env.js';

export async function createSupportRequest({ customerId, category, summary, metadata = {} }) {
  if (env.demoMode) {
    return {
      id: `support-${Date.now()}`,
      customer_id: customerId,
      category,
      summary,
      status: 'sent',
      metadata,
      created_at: new Date().toISOString()
    };
  }

  const { rows } = await query(
    `INSERT INTO support_requests (customer_id, category, summary, status, metadata)
     VALUES ($1, $2, $3, 'sent', $4)
     RETURNING id, customer_id, category, status, metadata, created_at`,
    [customerId, category, summary, metadata]
  );

  return rows[0];
}
