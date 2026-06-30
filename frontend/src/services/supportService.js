import { api } from '../api/client.js';

export function getPremiumSupport() {
  return api('/support/premium');
}

export function updateWifi(payload) {
  return api('/support/wifi', {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}

export function rebootOnu() {
  return api('/support/reboot', { method: 'POST' });
}
