import { api } from '../api/client.js';

export function getDashboard() {
  return api('/customer/dashboard');
}
