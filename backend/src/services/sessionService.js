import { revokeSession } from '../repositories/sessionRepository.js';
import { hashToken } from './tokenService.js';

export async function logoutSession(token) {
  if (!token) return { ok: true };

  await revokeSession(hashToken(token));
  return { ok: true };
}
