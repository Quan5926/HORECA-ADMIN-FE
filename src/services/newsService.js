// src/services/newsService.js (BÊN PROJECT FE ADMIN)
import axios from 'axios';

const api = axios.create({
  // SỬA 1: Đưa về '/api' cho đồng bộ với authService và ăn Proxy của Vite
  baseURL: '/api',                    
  timeout: 50000,                     
});

// Interceptor thêm token cho các request
api.interceptors.request.use(
  config => {
    // SỬA 2: Lấy đúng tên 'admin_token' mà authService đã lưu
    const token = sessionStorage.getItem('admin_token'); 
    
    // Log ra để kiểm tra
    console.log("kiem tra token trươc khi gui:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default {
  // ================= ADMIN =================
  getAdminNews() {
    return api.get('/admin/news');
  },
  createNews(newsData) {
    return api.post('/admin/news', newsData);
  },
  updateNews(id, newsData) {
    return api.put(`/admin/news/${id}`, newsData);
  },
  deleteNews(id) {
    return api.delete(`/admin/news/${id}`);
  },

  // ================= USER =================
  getPublicNews() {
    return api.get('/news');
  },
  getNewsDetail(id) {
    return api.get(`/news/${id}`);
  }
};
