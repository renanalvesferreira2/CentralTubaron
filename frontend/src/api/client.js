const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function api(path, options = {}) {
  const token = localStorage.getItem('tubaron.token');
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || 'Nao foi possivel concluir a operacao.';

    if (response.status === 401) {
      localStorage.removeItem('tubaron.token');
      localStorage.removeItem('tubaron.customer');
      window.dispatchEvent(new Event('tubaron:logout'));
    }

    throw new ApiError(message, response.status);
  }

  return data;
}
