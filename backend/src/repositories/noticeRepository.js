import { query } from '../config/db.js';

export async function listActiveNotices() {
  const { rows } = await query(
    'SELECT id, title, message, severity, created_at FROM notices WHERE active = true ORDER BY created_at DESC LIMIT 8'
  );
  return rows;
}

export async function createNotice({ title, message, severity }) {
  const { rows } = await query(
    'INSERT INTO notices (title, message, severity) VALUES ($1, $2, $3) RETURNING *',
    [title, message, severity]
  );
  return rows[0];
}
