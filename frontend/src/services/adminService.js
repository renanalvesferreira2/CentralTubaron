import { api } from '../api/client.js';

export function getAdminOverview() {
  return api('/admin/overview');
}

export function createNotice(payload) {
  return api('/admin/notices', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
