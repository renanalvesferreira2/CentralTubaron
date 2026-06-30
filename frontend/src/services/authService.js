import { api } from '../api/client.js';

export async function login(identifier, password) {
  return api('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password })
  });
}
