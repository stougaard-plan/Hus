const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  login: (pin) => request('/api/auth', { method: 'POST', body: JSON.stringify({ pin }) }),

  // Tasks
  getTasks: (params) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/tasks${qs ? '?' + qs : ''}`);
  },
  getTask: (id) => request(`/api/tasks/${id}`),

  // Instances
  getInstances: (params) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/instances${qs ? '?' + qs : ''}`);
  },
  createInstance: (data) =>
    request('/api/instances', { method: 'POST', body: JSON.stringify(data) }),
  updateInstance: (id, data) =>
    request(`/api/instances/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteInstance: (id) =>
    request(`/api/instances/${id}`, { method: 'DELETE' }),

  // Stats
  getStats: () => request('/api/stats'),
};
