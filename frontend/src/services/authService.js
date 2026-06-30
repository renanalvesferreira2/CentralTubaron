import { api } from '../api/client.js';

export async function login(identifier, password) {
  return api('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password })
  });
}

export async function adminLogin(email, password) {
  return api('/auth/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function logout() {
  return api('/auth/logout', { method: 'POST' });
}
