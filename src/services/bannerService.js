import axios from 'axios';
import { API_BASE } from '@/config/api'

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 50000,
});

api.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("Không tìm thấy auth_token trong LocalStorage!");
    }
    return config;
  },
  error => Promise.reject(error)
);

export const bannerService = {
  getAllBanners: async () => {
    const response = await api.get('/banners');
    return response.data;
  },
  createBanner: async (bannerData) => {
    const response = await api.post('/banners', bannerData);
    return response.data;
  },
  updateBanner: async (id, bannerData) => {
    const response = await api.put(`/banners/${id}`, bannerData);
    return response.data;
  },
  deleteBanner: async (id) => {
    const response = await api.delete(`/banners/${id}`);
    return response.data;
  },
  toggleStatus: async (id) => {
    const response = await api.patch(`/banners/${id}/toggle-status`);
    return response.data;
  },
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/banners/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};
