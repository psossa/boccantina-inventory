const API_URL = import.meta.env.VITE_API_URL || '/api';

async function fetchJSON(url, options = {}) {
  const token = localStorage.getItem('boccantina_token');
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  login: (username, password) =>
    fetchJSON('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  register: (username, password, name) =>
    fetchJSON('/auth/register', { method: 'POST', body: JSON.stringify({ username, password, name }) }),

  // Products
  getProducts: () => fetchJSON('/products'),
  updateProduct: (id, data) =>
    fetchJSON(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateProductsBatch: (updates) =>
    fetchJSON('/products/batch', { method: 'PUT', body: JSON.stringify({ updates }) }),

  // Orders
  getOrders: () => fetchJSON('/orders'),
  createOrder: (data) =>
    fetchJSON('/orders', { method: 'POST', body: JSON.stringify(data) }),
  updateOrderStatus: (id, status) =>
    fetchJSON(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Tasks
  getTasks: () => fetchJSON('/tasks'),
  updateTasks: (tasks) =>
    fetchJSON('/tasks', { method: 'PUT', body: JSON.stringify({ tasks }) }),
};
