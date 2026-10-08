<template>
  <div class="font-general p-3 p-md-4 bg-light-smooth">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
      <div>
        <h3 class="fw-bold mb-1 text-gradient-brown">Quản Lý Nhân Viên</h3>
        <p class="text-muted small mb-0"><i class="bi bi-person-vcard-fill text-primary me-1"></i> Hồ sơ & Phân quyền hệ thống</p>
      </div>
      <div class="d-flex flex-wrap gap-2">
        <select v-model="roleFilter" class="form-select shadow-sm border-0 rounded-pill px-3 small" style="width: 160px; font-size: 14px;">
          <option value="">Tất cả vai trò</option>
          <option value="Admin">Admin</option>
          <option value="Quản lý">Quản lý</option>
          <option value="Kế toán">Kế toán</option>
          <option value="Kho">Kho</option>
          <option value="CSKH">CSKH</option>
        </select>
        
        <div class="input-group shadow-sm rounded-pill overflow-hidden bg-white border px-2" style="max-width: 250px;">
          <span class="input-group-text bg-transparent border-0"><i class="bi bi-search text-muted"></i></span>
          <input type="text" v-model="searchQuery" class="form-control border-0 shadow-none small" placeholder="Tên, Email...">
        </div>
        
        <button class="btn btn-vipep-green text-white rounded-pill px-4 py-2 fw-bold shadow-soft hover-scale" @click="openForm()">
          <i class="bi bi-plus-lg me-1"></i> Thêm nhân viên
        </button>
      </div>
    </div>

    <div class="card border-0 shadow-soft rounded-4 card-table-wrapper">
      <div class="table-responsive custom-scrollbar">
        <table class="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th class="ps-4 py-3">Nhân Viên</th>
              <th class="py-3">Vai Trò</th>
              <th class="py-3">Trạng Thái</th>
              <th class="py-3">Ngày Tham Gia</th>
              <th class="pe-4 py-3 text-end">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="staff in filteredStaff" :key="staff.id">
              <td class="ps-4">
                <div class="d-flex align-items-center gap-3">
                  <div class="avatar-circle" :style="`background: ${staff.color}20; color: ${staff.color}`">
                    {{ staff.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <div class="fw-bold text-dark">{{ staff.name }}</div>
                    <div class="x-small text-muted">{{ staff.email }} | {{ staff.phone }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span :class="['badge-role', getRoleClass(staff.role)]">{{ staff.role }}</span>
              </td>
              <td>
                <span :class="['badge-status', staff.status === 'Đang làm việc' ? 'status-active' : 'status-locked']">
                  <i :class="staff.status === 'Đang làm việc' ? 'bi bi-check-circle-fill' : 'bi bi-lock-fill'" class="me-1"></i>
                  {{ staff.status }}
                </span>
              </td>
              <td><div class="small text-muted">{{ staff.joinDate }}</div></td>
              <td class="pe-4 text-end">
                <div class="d-flex gap-2 justify-content-end">
                  <button class="action-btn btn-edit" @click="openForm(staff)" title="Sửa thông tin"><i class="bi bi-pencil-square"></i></button>
                  <button :class="['action-btn', staff.status === 'Đang làm việc' ? 'btn-lock' : 'btn-unlock']" 
                          @click="toggleStatus(staff)" 
                          :title="staff.status === 'Đang làm việc' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'">
                    <i :class="staff.status === 'Đang làm việc' ? 'bi bi-lock' : 'bi bi-unlock'"></i>
                  </button>
                  <button class="action-btn btn-delete" @click="deleteStaff(staff.id)" title="Xóa nhân viên"><i class="bi bi-trash"></i></button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredStaff.length === 0">
              <td colspan="5" class="text-center py-5 text-muted">
                <i class="bi bi-inbox fs-1 d-block mb-2 opacity-50"></i> Không tìm thấy nhân viên nào phù hợp.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="isFormOpen" class="glass-overlay" @click.self="isFormOpen = false">
      <div class="modal-premium animate-pop-in" style="max-width: 550px;">
        <div class="modal-premium-header bg-vipep-green text-white">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-person-badge fs-4"></i>
            <h5 class="mb-0 fw-bold">{{ editingId ? 'Cập Nhật Hồ Sơ' : 'Thêm Nhân Viên Mới' }}</h5>
          </div>
          <button class="btn-close-custom text-white" @click="isFormOpen = false"><i class="bi bi-x-lg"></i></button>
        </div>
        
        <form @submit.prevent="saveStaff" class="p-4 bg-white">
          <div class="row g-3 mb-3">
            <div class="col-12">
              <label class="form-label small fw-bold text-muted">Họ và Tên <span class="text-danger">*</span></label>
              <input type="text" v-model="formData.name" class="form-control rounded-3 bg-light border-0 py-2" required placeholder="Nhập tên nhân viên">
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold text-muted">Email <span class="text-danger">*</span></label>
              <input type="email" v-model="formData.email" class="form-control rounded-3 bg-light border-0 py-2" required placeholder="email@onehoreca.vn">
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold text-muted">Số điện thoại</label>
              <input type="text" v-model="formData.phone" class="form-control rounded-3 bg-light border-0 py-2" placeholder="09xxxx">
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold text-muted">Phân quyền (Vai trò) <span class="text-danger">*</span></label>
              <select v-model="formData.role" class="form-select rounded-3 bg-light border-0 py-2" required>
                <option value="Admin">Admin (Toàn quyền)</option>
                <option value="Quản lý">Quản lý</option>
                <option value="Kế toán">Kế toán</option>
                <option value="Kho">Nhân viên Kho</option>
                <option value="CSKH">Chăm sóc khách hàng</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold text-muted">Trạng thái</label>
              <select v-model="formData.status" class="form-select rounded-3 bg-light border-0 py-2">
                <option value="Đang làm việc">Đang làm việc (Active)</option>
                <option value="Tạm khóa">Tạm khóa (Banned)</option>
              </select>
            </div>
          </div>
          
          <div class="d-flex gap-2 mt-4 pt-2 border-top">
            <button type="button" class="btn btn-light w-50 py-2 fw-bold rounded-pill" @click="isFormOpen = false">Hủy bỏ</button>
            <button type="submit" class="btn btn-vipep-green text-white w-50 py-2 fw-bold rounded-pill shadow-sm hover-scale">
              {{ editingId ? 'Lưu Thay Đổi' : 'Tạo Tài Khoản' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// --- State Lọc & Tìm kiếm ---
const searchQuery = ref('');
const roleFilter = ref('');

// --- State Modal Form ---
const isFormOpen = ref(false);
const editingId = ref(null);
const formData = ref({
  name: '', email: '', phone: '', role: 'CSKH', status: 'Đang làm việc'
});

// --- Mock Data: Danh sách nhân viên ---
const staffList = ref([
  { id: 1, name: 'Lê Tuấn Vũ', email: 'vult@onehoreca.vn', phone: '0901234567', role: 'Admin', status: 'Đang làm việc', joinDate: '01/01/2026', color: '#e74c3c' },
  { id: 2, name: 'Trần Thị Mai', email: 'maitt@onehoreca.vn', phone: '0933445566', role: 'Kế toán', status: 'Đang làm việc', joinDate: '15/01/2026', color: '#9b59b6' },
  { id: 3, name: 'Nguyễn Văn Hải', email: 'hainv@onehoreca.vn', phone: '0912345678', role: 'Kho', status: 'Đang làm việc', joinDate: '10/02/2026', color: '#e67e22' },
  { id: 4, name: 'Phạm Thu Thảo', email: 'thaopt@onehoreca.vn', phone: '0988776655', role: 'CSKH', status: 'Tạm khóa', joinDate: '20/02/2026', color: '#27ae60' },
  { id: 5, name: 'Hoàng Minh Tuấn', email: 'tuanhm@onehoreca.vn', phone: '0709988776', role: 'Quản lý', status: 'Đang làm việc', joinDate: '05/03/2026', color: '#2980b9' },
]);

// --- Computed: Lọc danh sách ---
const filteredStaff = computed(() => {
  return staffList.value.filter(staff => {
    const matchSearch = staff.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                        staff.email.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchRole = roleFilter.value === '' || staff.role === roleFilter.value;
    return matchSearch && matchRole;
  });
});

// --- Hàm chức năng UI (Render CSS Class) ---
const getRoleClass = (role) => {
  switch(role) {
    case 'Admin': return 'role-admin';
    case 'Quản lý': return 'role-manager';
    case 'Kế toán': return 'role-accountant';
    case 'Kho': return 'role-warehouse';
    case 'CSKH': return 'role-cskh';
    default: return 'role-default';
  }
};

const getRandomColor = () => {
  const colors = ['#e74c3c', '#9b59b6', '#3498db', '#1abc9c', '#f1c40f', '#e67e22', '#34495e'];
  return colors[Math.floor(Math.random() * colors.length)];
};

// --- CRUD Operations ---

// Mở Form (Create/Update)
const openForm = (staff = null) => {
  if (staff) {
    editingId.value = staff.id;
    formData.value = { ...staff }; // Clone dữ liệu để sửa
  } else {
    editingId.value = null;
    formData.value = { name: '', email: '', phone: '', role: 'CSKH', status: 'Đang làm việc' }; // Reset form
  }
  isFormOpen.value = true;
};

// Lưu thông tin (Save)
const saveStaff = () => {
  if (editingId.value) {
    // Sửa
    const index = staffList.value.findIndex(s => s.id === editingId.value);
    if (index !== -1) {
      staffList.value[index] = { ...staffList.value[index], ...formData.value };
    }
  } else {
    // Thêm mới
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    
    staffList.value.unshift({
      ...formData.value,
      id: Date.now(),
      joinDate: formattedDate,
      color: getRandomColor()
    });
  }
  isFormOpen.value = false;
};

// Xóa nhân viên (Delete)
const deleteStaff = (id) => {
  if (confirm('Cảnh báo: Bạn có chắc chắn muốn xóa nhân viên này khỏi hệ thống?')) {
    staffList.value = staffList.value.filter(s => s.id !== id);
  }
};

// Thay đổi trạng thái nhanh (Khóa / Mở khóa)
const toggleStatus = (staff) => {
  staff.status = staff.status === 'Đang làm việc' ? 'Tạm khóa' : 'Đang làm việc';
};
</script>

<style scoped>
/* Màu sắc & Hiệu ứng nền tảng */
.bg-light-smooth { background-color: #f8fafc; min-height: 100vh; }
.text-gradient-brown { background: linear-gradient(90deg, #4A3018, #8B5E34); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.text-vipep-green { color: #7eb33d; }
.bg-vipep-green { background-color: #7eb33d; }
.btn-vipep-green { background-color: #7eb33d !important; border: none; transition: all 0.3s ease; }
.btn-vipep-green:hover { background-color: #6a9c32 !important; }
.hover-scale:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(126,179,61,0.3) !important; }

/* Bảng và Scrollbar */
.card-table-wrapper { overflow: hidden; background: white; }
.table-responsive { max-height: calc(100vh - 200px); overflow: auto; position: relative; }
.table thead th { position: sticky; top: 0; z-index: 10; background-color: #f8fafc !important; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: 700; border-bottom: 2px solid #edf2f7; }
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

/* Avatar nhân viên */
.avatar-circle { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px; flex-shrink: 0;}

/* Badge Vai trò */
.badge-role { padding: 5px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; display: inline-block; }
.role-admin { background: #ffe4e6; color: #e11d48; }
.role-manager { background: #e0f2fe; color: #0284c7; }
.role-accountant { background: #f3e8ff; color: #9333ea; }
.role-warehouse { background: #ffedd5; color: #ea580c; }
.role-cskh { background: #dcfce7; color: #16a34a; }
.role-default { background: #f1f5f9; color: #475569; }

/* Badge Trạng thái */
.badge-status { padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; display: inline-flex; align-items: center; }
.status-active { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
.status-locked { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }

/* Action Buttons (Thao tác) */
.action-btn { width: 34px; height: 34px; border-radius: 8px; border: none; background: #f1f5f9; color: #64748b; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s; margin-left: 4px; }
.btn-edit:hover { background: #e0f2fe; color: #0ea5e9; }
.btn-lock:hover { background: #fff7ed; color: #ea580c; }
.btn-unlock:hover { background: #ecfdf5; color: #10b981; }
.btn-delete:hover { background: #fee2e2; color: #ef4444; }

/* Modal Overlay & Animation */
.glass-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 15px; }
.modal-premium { background: white; border-radius: 20px; overflow: hidden; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
.modal-premium-header { padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
.btn-close-custom { background: none; border: none; font-size: 1.2rem; transition: transform 0.2s; opacity: 0.8; }
.btn-close-custom:hover { transform: scale(1.2); opacity: 1; }
.animate-pop-in { animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

@keyframes popIn {
  0% { opacity: 0; transform: scale(0.95) translateY(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
