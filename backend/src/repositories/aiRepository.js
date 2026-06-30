import { query } from '../config/db.js';
import { env } from '../config/env.js';

export async function saveAiInteraction({ customerId, prompt, answer }) {
  if (env.demoMode) {
    console.info('AI demo history', { customerId, prompt });
    return;
  }

  await query(
    'INSERT INTO ai_history (customer_id, prompt, answer) VALUES ($1, $2, $3)',
    [customerId, prompt, answer]
  );
}
