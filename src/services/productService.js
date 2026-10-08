import axios from 'axios';
import { API_BASE } from '@/config/api'
const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 50000,
});

// Interceptor tự động đính token vào Header
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

export const adminProductService = {
  // 1. Lấy danh sách danh mục (Dùng chung cho form Thêm/Sửa/Lọc)
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

// 2. Lấy danh sách sản phẩm (Cập nhật: thêm tham số trangThai)
getProducts: async (page = 1, size = 10, search = '', categoryId = '', trangThai = '') => {
  const response = await api.get('/products/admin/list', {
    params: {
      page: page,
      size: size,
      search: search,
      categoryId: categoryId,
      trangThai: trangThai
    }
  });
  return response.data;
},

  // 3. Lấy chi tiết 1 sản phẩm để Edit
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // 4. Thêm sản phẩm mới
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // 5. Cập nhật sản phẩm
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // 6. Xóa 1 sản phẩm
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // 7. Xóa nhiều sản phẩm (Gửi mảng ID trong body)
  bulkDeleteProducts: async (ids) => {
    const response = await api.delete('/products/bulk', { data: ids });
    return response.data;
  },

  // 8. Upload nhiều ảnh cho sản phẩm
// SỬA LẠI HÀM NÀY TRONG productService.js
  uploadImages: async (id, formData) => {
    // Chỉ cần truyền formData, KHÔNG thêm headers Content-Type thủ công nữa
    const response = await api.post(`/products/${id}/upload-images`, formData);
    return response.data;
    
  },


  updateStock: async (id, newStock) => {
    // ĐÃ SỬA: axiosInstance -> api
    const response = await api.put(`/products/${id}/stock`, { tonKho: newStock });
    return response.data;
  },


   // 9. Upload ảnh cho 1 biến thể
  uploadVariantImage: async (variantId, formData) => {
    const response = await api.post(`/products/variants/${variantId}/upload-image`, formData);
    return response.data;
  },

  // 10. Upload ảnh cho combo item
  uploadComboItemImage: async (comboItemId, formData) => {
    const response = await api.post(`/products/combo-items/${comboItemId}/upload-image`, formData);
    return response.data;
  },

};

