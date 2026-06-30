import { query } from '../config/db.js';

export async function findAdminByEmail(email) {
  const { rows } = await query(
    'SELECT id, name, email, password_hash, role FROM admin_users WHERE email = $1 LIMIT 1',
    [email]
  );
  return rows[0];
}
