import axios from 'axios';
import { API_BASE } from '@/config/api'

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 50000,
});

api.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

export const couponsService = {
  getAll: () => api.get('/ma-giam-gia').then(r => r.data),
  create: (data) => api.post('/ma-giam-gia', data).then(r => r.data),
  update: (id, data) => api.put(`/ma-giam-gia/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/ma-giam-gia/${id}`).then(r => r.data),
}