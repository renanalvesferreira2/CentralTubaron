const dangerousKeys = new Set(['__proto__', 'prototype', 'constructor']);

function clean(value) {
  if (Array.isArray(value)) return value.map(clean);
  if (!value || typeof value !== 'object') return value;

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !dangerousKeys.has(key))
      .map(([key, item]) => [key, clean(item)])
  );
}

export function sanitizeInput(req, _res, next) {
  req.body = clean(req.body);
  req.query = clean(req.query);
  req.params = clean(req.params);
  next();
}
