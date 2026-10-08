import axios from 'axios';
import { API_BASE } from '@/config/api'
const API_URL = import.meta.env.VITE_API_URL || `${API_BASE}/api`;
// Hàm lấy token từ localStorage
const getAuthHeader = () => {
  // Đảm bảo key này KHỚP HOÀN TOÀN với lúc bạn lưu token khi đăng nhập thành công
  const token = sessionStorage.getItem('admin_token'); 
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default {
  // 1. Lấy tất cả danh sách liên hệ
  getAllContacts(params) {
    return axios.get(`${API_URL}/admin/lien-he`, {
      params: params,
      headers: getAuthHeader()
    });
  },

  // 2. Lấy chi tiết một liên hệ theo ID
  getContactById(id) {
    return axios.get(`${API_URL}/admin/lien-he/${id}`, {
      headers: getAuthHeader()
    });
  },

  // 3. Cập nhật trạng thái xử lý tin nhắn
  updateContactStatus(id, statusData) {
    return axios.patch(`${API_URL}/admin/lien-he/${id}/status`, statusData, {
      headers: getAuthHeader()
    });
  },

  // 4. Xóa hẳn liên hệ
  deleteContact(id) {
    return axios.delete(`${API_URL}/admin/lien-he/${id}`, {
      headers: getAuthHeader()
    });
  },

  // 5. Lấy thông tin công ty hiện tại (API này public nên không bắt buộc có token, nhưng nếu muốn bạn vẫn có thể truyền)
  getCompanyInfo() {
    return axios.get(`${API_URL}/thong-tin-cong-ty`); 
  },

  // 6. Cập nhật thông tin công ty (Admin)
  updateCompanyInfo(data) {
    return axios.put(`${API_URL}/admin/thong-tin-cong-ty`, data, {
      headers: getAuthHeader()
    });
  }
};
