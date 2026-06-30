import { z } from 'zod';
import { getOnu, rebootOnu, updateWifi } from '../integrations/huawei/huaweiClient.js';
import { createAuditLog } from '../repositories/auditRepository.js';

export const wifiSchema = z.object({
  body: z.object({
    ssid: z.string().min(3).max(32),
    password: z.string().min(8).max(64)
  })
});

export async function getPremiumSupport(customerId) {
  const onu = await getOnu(customerId);
  const signalValue = Number(String(onu.signal).replace(/[^\d.-]/g, ''));

  return {
    onu,
    checks: [
      { label: 'Sinal óptico', status: signalValue >= -27 ? 'ok' : 'attention' },
      { label: 'Autenticação', status: onu.status === 'Online' ? 'ok' : 'attention' },
      { label: 'Wi-Fi principal', status: onu.wifi?.ssid ? 'ok' : 'attention' }
    ]
  };
}

export async function changeWifi(customerId, payload) {
  const result = await updateWifi(customerId, payload);
  await createAuditLog({
    actorId: customerId,
    actorType: 'customer',
    action: 'huawei.wifi.update',
    metadata: { ssid: payload.ssid }
  });
  return result;
}

export async function restartOnu(customerId) {
  const result = await rebootOnu(customerId);
  await createAuditLog({
    actorId: customerId,
    actorType: 'customer',
    action: 'huawei.onu.reboot'
  });
  return result;
}
