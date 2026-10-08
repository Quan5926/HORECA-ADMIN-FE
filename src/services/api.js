import axios from "axios";
import { API_BASE } from '@/config/api'
const api = axios.create({
  baseURL: "${API_BASE}/api",
  withCredentials: true
});

export default api;

