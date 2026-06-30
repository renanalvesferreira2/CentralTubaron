import { AppError } from './AppError.js';

const SAFE_PROTOCOLS = new Set(['https:']);

function assertSafeUrl(url, allowedHost) {
  const parsed = new URL(url);

  if (!SAFE_PROTOCOLS.has(parsed.protocol)) {
    throw new AppError('URL externa bloqueada por política de segurança.', 500);
  }

  if (allowedHost && parsed.hostname !== allowedHost) {
    throw new AppError('Host externo não autorizado.', 500);
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function requestJson(url, options = {}) {
  const allowedHost = options.allowedHost;
  const retries = options.retries ?? 1;
  const timeoutMs = options.timeoutMs ?? 8000;

  assertSafeUrl(url, allowedHost);

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        throw new AppError('Falha na comunicação com integração externa.', 502, data);
      }

      return data;
    } catch (error) {
      console.warn('Integration request failed', { url, attempt: attempt + 1, error: error.message });

      if (attempt === retries) {
        throw error.name === 'AbortError'
          ? new AppError('Tempo limite excedido na integração externa.', 504)
          : error;
      }

      await wait(250 * (attempt + 1));
    } finally {
      clearTimeout(timeout);
    }
  }
}
