import { env } from '../../config/env.js';
import { requestJson } from '../../utils/httpClient.js';
import { getHost } from '../../utils/url.js';
import { mockContracts, mockCustomer, mockInvoices } from './ixcMock.js';

function authHeaders() {
  return { Authorization: `Basic ${env.ixc.token}` };
}

export async function findCustomer(identifier) {
  if (env.ixc.useMock) return { ...mockCustomer, identifier };

  return requestJson(`${env.ixc.baseUrl}/cliente?busca=${encodeURIComponent(identifier)}`, {
    headers: authHeaders(),
    allowedHost: getHost(env.ixc.baseUrl),
    retries: 2
  });
}

export async function authenticateCustomer(identifier, password) {
  if (env.ixc.useMock) return password.length >= 4 ? { ...mockCustomer, identifier } : null;

  return requestJson(`${env.ixc.baseUrl}/central_assinante/login`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ identifier, password }),
    allowedHost: getHost(env.ixc.baseUrl),
    retries: 1
  });
}

export async function getContracts(customerId) {
  if (env.ixc.useMock) return mockContracts;

  return requestJson(`${env.ixc.baseUrl}/cliente_contrato?cliente_id=${customerId}`, {
    headers: authHeaders(),
    allowedHost: getHost(env.ixc.baseUrl),
    retries: 2
  });
}

export async function getInvoices(customerId) {
  if (env.ixc.useMock) return mockInvoices;

  return requestJson(`${env.ixc.baseUrl}/fn_areceber?cliente_id=${customerId}`, {
    headers: authHeaders(),
    allowedHost: getHost(env.ixc.baseUrl),
    retries: 2
  });
}
