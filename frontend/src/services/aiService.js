import { api } from '../api/client.js';

export function askAi(prompt) {
  return api('/ai/ask', {
    method: 'POST',
    body: JSON.stringify({ prompt })
  });
}
