import { query } from '../config/db.js';

export async function saveAiInteraction({ customerId, prompt, answer }) {
  await query(
    'INSERT INTO ai_history (customer_id, prompt, answer) VALUES ($1, $2, $3)',
    [customerId, prompt, answer]
  );
}
