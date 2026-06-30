import { env } from '../../config/env.js';
import { requestJson } from '../../utils/httpClient.js';
import { getHost } from '../../utils/url.js';
import { mockOnu } from './huaweiMock.js';

function authHeaders() {
  return { Authorization: `Bearer ${env.huawei.token}` };
}

export async function getOnu(customerId) {
  if (env.huawei.useMock) return { ...mockOnu, customerId };

  return requestJson(`${env.huawei.baseUrl}/onus/${customerId}`, {
    headers: authHeaders(),
    allowedHost: getHost(env.huawei.baseUrl),
    retries: 1
  });
}

export async function updateWifi(customerId, payload) {
  if (env.huawei.useMock) return { ...mockOnu, customerId, wifi: { ...mockOnu.wifi, ...payload } };

  return requestJson(`${env.huawei.baseUrl}/onus/${customerId}/wifi`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(payload),
    allowedHost: getHost(env.huawei.baseUrl),
    retries: 1
  });
}

export async function rebootOnu(customerId) {
  if (env.huawei.useMock) return { status: 'scheduled', customerId };

  return requestJson(`${env.huawei.baseUrl}/onus/${customerId}/reboot`, {
    method: 'POST',
    headers: authHeaders(),
    allowedHost: getHost(env.huawei.baseUrl),
    retries: 0
  });
}
