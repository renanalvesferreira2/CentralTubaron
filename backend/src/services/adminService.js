import { z } from 'zod';
import { createNotice } from '../repositories/noticeRepository.js';

export const noticeSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(160),
    message: z.string().min(5).max(1000),
    severity: z.enum(['info', 'warning', 'critical']).default('info')
  })
});

export async function getAdminOverview() {
  return {
    integrations: [
      { name: 'IXC', status: 'Configurado', latency: '128 ms' },
      { name: 'Gemini', status: 'Operacional', latency: '402 ms' },
      { name: 'Huawei', status: 'Operacional', latency: '211 ms' }
    ],
    metrics: {
      connectedCustomers: 1842,
      openTickets: 27,
      aiDeflectionRate: '38%',
      errors24h: 2
    }
  };
}

export async function publishNotice(payload) {
  return createNotice(payload);
}
