const BASE = '';

async function request(path, options = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = new Error(res.statusText);
    err.status = res.status;
    let body;
    try {
      body = await res.json();
    } catch (_) {
      body = {};
    }
    err.body = body;
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  exercises: {
    getAll(category = '') {
      const q = category ? `?category=${encodeURIComponent(category)}` : '';
      return request(`/api/exercises${q}`);
    },
    getOne(id) {
      return request(`/api/exercises/${id}`);
    },
    create(data) {
      return request('/api/exercises', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update(id, data) {
      return request(`/api/exercises/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    delete(id) {
      return request(`/api/exercises/${id}`, { method: 'DELETE' });
    },
  },
  routines: {
    getAll() {
      return request('/api/routines');
    },
    getOne(id) {
      return request(`/api/routines/${id}`);
    },
    create(data) {
      return request('/api/routines', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update(id, data) {
      return request(`/api/routines/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    delete(id) {
      return request(`/api/routines/${id}`, { method: 'DELETE' });
    },
  },
};
