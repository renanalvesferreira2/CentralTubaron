import { api } from '../api/client.js';

export function getAdminOverview() {
  return api('/admin/overview');
}
