const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

const buildHeaders = (extra?: HeadersInit) => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
};

const buildFormHeaders = () => {
  const token = getToken();
  return {
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    // Tidak set Content-Type — biar browser set otomatis dengan boundary
  };
};

const handleResponse = async (response: Response) => {
  if (response.status === 401) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return response.json();
};

export const apiClient = {
  async get(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: buildHeaders(options?.headers),
      ...options,
    });
    return handleResponse(response);
  },

  async post(endpoint: string, data: any, options?: RequestInit) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: buildHeaders(options?.headers),
      body: JSON.stringify(data),
      ...options,
    });
    return handleResponse(response);
  },

  async put(endpoint: string, data: any, options?: RequestInit) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: buildHeaders(options?.headers),
      body: JSON.stringify(data),
      ...options,
    });
    return handleResponse(response);
  },

  async delete(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: buildHeaders(options?.headers),
      ...options,
    });
    return handleResponse(response);
  },

  // Untuk upload file (FormData)
  async postForm(endpoint: string, formData: FormData) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: buildFormHeaders(),
      body: formData,
    });
    return handleResponse(response);
  },

  // Untuk update dengan file (FormData) — pakai POST + _method=PUT
  async putForm(endpoint: string, formData: FormData) {
    formData.append('_method', 'PUT');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: buildFormHeaders(),
      body: formData,
    });
    return handleResponse(response);
  },
};