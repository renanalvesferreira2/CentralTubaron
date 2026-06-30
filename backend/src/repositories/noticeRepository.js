import { query } from '../config/db.js';
import { env } from '../config/env.js';

const demoNotices = [
  {
    id: 'notice-demo-1',
    title: 'Pagamento via PIX disponível',
    message: 'A segunda via da próxima fatura já conta com código PIX e código de barras para copiar.',
    severity: 'info',
    created_at: new Date().toISOString()
  },
  {
    id: 'notice-demo-2',
    title: 'Rede operando normalmente',
    message: 'Não identificamos incidentes na sua região. Caso precise, o suporte premium pode executar testes na ONU.',
    severity: 'info',
    created_at: new Date().toISOString()
  }
];

export async function listActiveNotices() {
  if (env.demoMode) return demoNotices;

  const { rows } = await query(
    'SELECT id, title, message, severity, created_at FROM notices WHERE active = true ORDER BY created_at DESC LIMIT 8'
  );
  return rows;
}

export async function createNotice({ title, message, severity }) {
  if (env.demoMode) {
    return { id: `notice-${Date.now()}`, title, message, severity, active: true };
  }

  const { rows } = await query(
    'INSERT INTO notices (title, message, severity) VALUES ($1, $2, $3) RETURNING *',
    [title, message, severity]
  );
  return rows[0];
}
