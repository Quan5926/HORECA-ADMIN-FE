import axios from 'axios';
import { API_BASE } from '@/config/api'
// Đường dẫn chuẩn trỏ tới ReviewAdminController
const ADMIN_API_URL = `${API_BASE}/api/admin/reviews`;

// Hàm lấy token từ localStorage
const getAuthHeader = () => {
  // Đã sửa 'token' thành 'admin_token' cho khớp với lúc đăng nhập
  const token = sessionStorage.getItem('admin_token'); 
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default {
  // 1. Lấy TẤT CẢ bình luận (để admin quản lý)
  getAllAdminReviews() {
    return axios.get(ADMIN_API_URL, {
      headers: getAuthHeader()
    });
  },

  // 2. Cập nhật trạng thái bình luận (Duyệt / Ẩn)
  // Truyền params để khớp với @RequestParam Integer status bên Backend
  updateStatus(id, status) {
    return axios.put(`${ADMIN_API_URL}/${id}/status`, null, {
      params: { status: status }, 
      headers: getAuthHeader()
    });
  },

  // 3. Xóa hẳn bình luận
  deleteReview(id) {
    return axios.delete(`${ADMIN_API_URL}/${id}`, {
      headers: getAuthHeader()
    });
  }
};
