import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 50000,
});

api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('admin_token'); // ← sửa chỗ này
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  // ── LOGIN ──────────────────────────────────────────────────────
  adminLogin(identifier, password, recaptchaToken) {
    return api.post('/auth/admin-login', { identifier, password, recaptchaToken });
  },

  // ── REGISTER ADMIN ─────────────────────────────────────────────
  requestOtp(data) {
    return api.post('/auth/admin/register/request-otp', data);
  },

  verifyOtp(data) {
    return api.post('/auth/admin/register/verify', data);
  },

  // ── FORGOT PASSWORD ────────────────────────────────────────────
  forgotPasswordRequestOtp(data) {
    return api.post('/auth/forgot-password/request-otp', data);
  },

  forgotPasswordVerifyOtp(data) {
    return api.post('/auth/forgot-password/verify-otp', data);
  },

  forgotPasswordReset(data) {
    return api.post('/auth/forgot-password/reset', data);
  },
};