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

export const flashSaleService = {
  getAll: () => api.get('/khuyen-mai-flash').then(r => r.data),
  create: (data) => api.post('/khuyen-mai-flash', data).then(r => r.data),
  update: (id, data) => api.put(`/khuyen-mai-flash/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/khuyen-mai-flash/${id}`).then(r => r.data),
}