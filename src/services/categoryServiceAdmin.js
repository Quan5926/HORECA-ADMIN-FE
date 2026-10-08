import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 50000,
});

// Interceptor đính kèm Token cho Admin
api.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('admin_token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export const categoryServiceAdmin = {
  // Đã thêm /admin vào tất cả các đường dẫn
  getAllCategories: async () => {
    const response = await api.get('/admin/categories');
    return response.data;
  },
  createCategory: async (categoryData) => {
    const response = await api.post('/admin/categories', categoryData);
    return response.data;
  },
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/admin/categories/${id}`, categoryData);
    return response.data;
  },
  deleteCategory: async (id) => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },
  uploadImage: async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/admin/categories/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  // Thêm .url vào đây vì Backend giờ đã trả về dạng { "url": "http..." }
  return response.data.url; 
}
};
