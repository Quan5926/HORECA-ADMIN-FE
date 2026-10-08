<template>
  <div class="font-general p-3 p-md-4 bg-light-smooth">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
      <div>
        <h3 class="fw-bold mb-1 text-gradient-brown">Danh Sách Khách Hàng</h3>
        <p class="text-muted small mb-0"><i class="bi bi-people-fill text-primary me-1"></i> Quản lý thông tin và phân hạng</p>
      </div>
      <div class="d-flex gap-2">
        <div class="input-group shadow-sm rounded-pill overflow-hidden bg-white border px-2" style="max-width: 300px;">
          <span class="input-group-text bg-transparent border-0"><i class="bi bi-search"></i></span>
          <input type="text" v-model="searchQuery" class="form-control border-0 shadow-none small" placeholder="Tìm tên, SĐT...">
        </div>
        <button class="btn btn-vipep-green text-white rounded-pill px-4 py-2 fw-bold shadow-soft hover-scale" @click="openForm()">
          <i class="bi bi-person-plus-fill me-2"></i>Thêm khách mới
        </button>
      </div>
    </div>

    <div class="card border-0 shadow-soft rounded-4 card-table-wrapper">
      <div class="table-responsive custom-scrollbar">
        <table class="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th class="ps-4 py-3">Khách Hàng</th>
              <th class="py-3">Phân Hạng</th>
              <th class="py-3">Tổng Chi Tiêu</th>
              <th class="py-3">Đơn Gần Nhất</th>
              <th class="pe-4 py-3 text-end">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in filteredCustomers" :key="c.id">
              <td class="ps-4">
                <div class="d-flex align-items-center gap-3">
                  <div class="avatar-circle" :style="`background: ${c.color}20; color: ${c.color}`">{{ c.name.charAt(0) }}</div>
                  <div>
                    <div class="fw-bold text-dark">{{ c.name }}</div>
                    <div class="x-small text-muted">{{ c.phone }}</div>
                  </div>
                </div>
              </td>
              <td><span :class="['rank-badge', `rank-${c.rank.toLowerCase()}`]">{{ c.rank }}</span></td>
              <td><div class="fw-bold text-vipep-dark">{{ c.totalSpent.toLocaleString() }}đ</div></td>
              <td><div class="small">{{ c.lastOrderDate }}</div></td>
              <td class="pe-4 text-end">
                <div class="d-flex gap-2 justify-content-end">
                  <button class="action-btn btn-view" @click="openHistory(c)" title="Xem Lịch sử"><i class="bi bi-clock-history"></i></button>
                  <button class="action-btn btn-edit" @click="openForm(c)" title="Chỉnh sửa"><i class="bi bi-pencil-square"></i></button>
                  <button class="action-btn btn-delete" @click="deleteCustomer(c.id)" title="Xóa"><i class="bi bi-trash"></i></button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredCustomers.length === 0">
              <td colspan="5" class="text-center py-4 text-muted">Không tìm thấy khách hàng nào.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="isFormOpen" class="glass-overlay" @click.self="isFormOpen = false">
      <div class="modal-premium animate-pop-in" style="max-width: 500px;">
        <div class="modal-premium-header bg-vipep-green text-white">
          <h5 class="mb-0 fw-bold">{{ editingId ? 'Cập Nhật Khách Hàng' : 'Thêm Khách Hàng Mới' }}</h5>
          <button class="btn-close-custom text-white" @click="isFormOpen = false"><i class="bi bi-x-lg"></i></button>
        </div>
        <form @submit.prevent="saveCustomer" class="p-4 bg-white">
          <div class="mb-3">
            <label class="form-label small fw-bold text-muted">Họ và Tên <span class="text-danger">*</span></label>
            <input type="text" v-model="formData.name" class="form-control rounded-3 bg-light border-0 py-2" required placeholder="Nhập tên khách hàng">
          </div>
          <div class="row mb-3 g-3">
            <div class="col-6">
              <label class="form-label small fw-bold text-muted">Số điện thoại <span class="text-danger">*</span></label>
              <input type="text" v-model="formData.phone" class="form-control rounded-3 bg-light border-0 py-2" required placeholder="09xxxx">
            </div>
            <div class="col-6">
              <label class="form-label small fw-bold text-muted">Phân hạng</label>
              <select v-model="formData.rank" class="form-select rounded-3 bg-light border-0 py-2">
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
                <option value="Diamond">Diamond</option>
              </select>
            </div>
          </div>
          <div class="mb-4">
            <label class="form-label small fw-bold text-muted">Ghi chú đặc biệt</label>
            <textarea v-model="formData.note" class="form-control rounded-3 bg-light border-0" rows="3" placeholder="Sở thích, lưu ý giao hàng..."></textarea>
          </div>
          <button type="submit" class="btn btn-vipep-green text-white w-100 py-2 fw-bold rounded-pill shadow-sm hover-scale">
            {{ editingId ? 'Lưu Thay Đổi' : 'Tạo Khách Hàng' }}
          </button>
        </form>
      </div>
    </div>

    <div v-if="selectedCustomer" class="glass-overlay" @click.self="selectedCustomer = null">
      <div class="modal-premium animate-pop-in" style="max-width: 800px;">
        <div class="modal-premium-header bg-dark-smooth">
          <div class="d-flex align-items-center gap-3">
            <div class="avatar-circle shadow-sm" :style="`background: white; color: ${selectedCustomer.color}`">
              {{ selectedCustomer.name.charAt(0) }}
            </div>
            <div>
              <h5 class="mb-0 fw-bold">{{ selectedCustomer.name }}</h5>
              <span class="x-small opacity-75">Lịch sử giao dịch & Thói quen mua sắm</span>
            </div>
          </div>
          <button class="btn-close-custom text-white" @click="selectedCustomer = null"><i class="bi bi-x-lg"></i></button>
        </div>

        <div class="modal-body p-4 bg-light-smooth">
          <div class="row g-3 mb-4">
            <div class="col-md-4">
              <div class="info-card p-3 rounded-4 bg-white shadow-sm border-0">
                <label class="x-small fw-bold text-muted text-uppercase mb-1 d-block">Tổng tích lũy</label>
                <div class="h5 fw-bold text-vipep-green mb-0">{{ selectedCustomer.totalSpent.toLocaleString() }}đ</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="info-card p-3 rounded-4 bg-white shadow-sm border-0">
                <label class="x-small fw-bold text-muted text-uppercase mb-1 d-block">Sản phẩm mua nhiều nhất</label>
                <div class="small fw-bold text-dark mb-0">Tiêu sọ, Bột nghệ</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="info-card p-3 rounded-4 bg-white shadow-sm border-0">
                <label class="x-small fw-bold text-muted text-uppercase mb-1 d-block">Tỉ lệ hoàn trả</label>
                <div class="small fw-bold text-danger mb-0">2% (Thấp)</div>
              </div>
            </div>
          </div>

          <label class="small fw-bold text-muted text-uppercase ls-1 mb-2 d-block">Các đơn hàng gần đây</label>
          <div class="history-list custom-scrollbar" style="max-height: 350px; overflow-y: auto;">
            <div v-for="order in orderHistory" :key="order.code" class="order-item p-3 mb-2 rounded-4 bg-white shadow-sm border-0 d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center gap-3">
                <div class="order-icon"><i class="bi bi-box-seam"></i></div>
                <div>
                  <div class="fw-bold small">{{ order.code }} <span class="badge bg-light text-dark ms-2 fw-normal">{{ order.date }}</span></div>
                  <div class="x-small text-muted">{{ order.items }}</div>
                </div>
              </div>
              <div class="text-end">
                <div class="fw-bold text-dark">{{ order.amount.toLocaleString() }}đ</div>
                <span :class="['badge rounded-pill', order.status === 'Hoàn tất' ? 'bg-success-light text-success' : 'bg-warning-light text-warning']" style="font-size: 10px;">
                  {{ order.status }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer p-3 bg-white border-top">
          <button class="btn btn-light rounded-pill px-4 fw-bold" @click="selectedCustomer = null">Đóng lại</button>
          <button class="btn btn-vipep-green text-white rounded-pill px-4 fw-bold">Xuất file báo cáo</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// State tìm kiếm & Hiển thị
const searchQuery = ref('');
const selectedCustomer = ref(null);

// State Form CRUD
const isFormOpen = ref(false);
const editingId = ref(null);
const formData = ref({ name: '', phone: '', rank: 'Silver', note: '' });

// Dữ liệu mẫu khách hàng (Đã thêm trường note)
const customers = ref([
  { id: 4421, name: 'Nguyễn Bích Liên', phone: '0901234567', rank: 'Diamond', totalSpent: 12500000, lastOrderDate: '12/03/2026', color: '#e74c3c', note: 'Khách sỉ lớn' },
  { id: 4422, name: 'Trần Minh Tâm', phone: '0933445566', rank: 'Gold', totalSpent: 5200000, lastOrderDate: '10/03/2026', color: '#3498db', note: '' },
  { id: 4423, name: 'Lê Mỹ Huyền', phone: '0702233445', rank: 'Silver', totalSpent: 2100000, lastOrderDate: '05/03/2026', color: '#27ae60', note: 'Hay mua giờ hành chính' },
]);

// Dữ liệu mẫu lịch sử đơn (Thực tế sẽ gọi API theo ID khách)
const orderHistory = ref([
  { code: '#HRC-9981', date: '12/03/2026', items: '3x Tiêu sọ, 2x Quế thanh', amount: 450000, status: 'Hoàn tất' },
  { code: '#HRC-8822', date: '25/02/2026', items: '10x Bột nghệ Vipep 500g', amount: 2100000, status: 'Hoàn tất' },
  { code: '#HRC-7755', date: '10/01/2026', items: '1x Set quà tặng đại lý', amount: 1200000, status: 'Đang giao' },
]);

// Lọc khách hàng
const filteredCustomers = computed(() => {
  return customers.value.filter(c => 
    c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    c.phone.includes(searchQuery.value)
  );
});

// ==============================
// CÁC HÀM XỬ LÝ CRUD
// ==============================

// 1. Xem lịch sử (Read)
const openHistory = (customer) => {
  selectedCustomer.value = customer;
};

// 2. Mở Form Thêm/Sửa (Create/Update Setup)
const openForm = (customer = null) => {
  if (customer) {
    editingId.value = customer.id;
    formData.value = { ...customer }; // Clone data để sửa
  } else {
    editingId.value = null;
    formData.value = { name: '', phone: '', rank: 'Silver', note: '' }; // Reset form
  }
  isFormOpen.value = true;
};

// 3. Lưu Khách hàng (Save)
const saveCustomer = () => {
  if (editingId.value) {
    // Chế độ Sửa
    const index = customers.value.findIndex(c => c.id === editingId.value);
    if (index !== -1) {
      customers.value[index] = { 
        ...customers.value[index], 
        ...formData.value 
      };
    }
  } else {
    // Chế độ Thêm mới
    customers.value.push({
      ...formData.value,
      id: Date.now(), // ID giả lập
      totalSpent: 0,
      lastOrderDate: 'Chưa có',
      color: '#' + Math.floor(Math.random()*16777215).toString(16) // Random màu Avatar
    });
  }
  isFormOpen.value = false;
};

// 4. Xóa Khách hàng (Delete)
const deleteCustomer = (id) => {
  if (confirm('Cảnh báo: Bạn có chắc chắn muốn xóa khách hàng này khỏi hệ thống?')) {
    customers.value = customers.value.filter(c => c.id !== id);
  }
};
</script>

<style scoped>
/* CSS nền tảng */
.bg-dark-smooth { background: #1e293b; color: white; }
.bg-success-light { background: #ecfdf5; }
.bg-warning-light { background: #fffbeb; }
.text-vipep-dark { color: #2c3e50; }
.text-vipep-green { color: #7eb33d; }

/* Nút bấm Vipep Green */
.btn-vipep-green { background-color: #7eb33d !important; border: none; transition: all 0.3s ease; }
.btn-vipep-green:hover { background-color: #6a9c32 !important; }
.hover-scale:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(126,179,61,0.3) !important; }

/* Bảng và Cuộn */
.card-table-wrapper { overflow: hidden; background: white; }
.table-responsive { max-height: calc(100vh - 200px); overflow: auto; position: relative; }
.table thead th { position: sticky; top: 0; z-index: 10; background-color: #f8fafc !important; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: 700; border-bottom: 2px solid #edf2f7; }
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

/* Action Buttons (Thêm hiệu ứng hover Sửa/Xóa) */
.action-btn { width: 34px; height: 34px; border-radius: 8px; border: none; background: #f1f5f9; color: #475569; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.btn-view:hover { background: #e2e8f0; color: #1e293b; }
.btn-edit:hover { background: #e0f2fe; color: #0ea5e9; }
.btn-delete:hover { background: #fee2e2; color: #ef4444; }

/* Lịch sử mua hàng Card */
.order-icon { width: 40px; height: 40px; border-radius: 12px; background: #f1f5f9; color: #64748b; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
.order-item { transition: all 0.2s; border: 1px solid transparent !important; }
.order-item:hover { transform: translateY(-2px); border-color: #7eb33d !important; }
.info-card { border: 1px solid #f1f5f9 !important; }

/* Avatar & Badges */
.avatar-circle { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px; }
.rank-badge { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; }
.rank-diamond { background: #f3e8ff; color: #9333ea; }
.rank-platinum { background: #f1f5f9; color: #475569; }
.rank-gold { background: #fef3c7; color: #d97706; }
.rank-silver { background: #f0fdf4; color: #16a34a; }

/* Modals & Overlay */
.glass-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 15px; }
.modal-premium { background: white; border-radius: 20px; overflow: hidden; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
.modal-premium-header { padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
.bg-vipep-green { background-color: #7eb33d; }
.btn-close-custom { background: none; border: none; font-size: 1.2rem; transition: transform 0.2s; }
.btn-close-custom:hover { transform: scale(1.2); }
.animate-pop-in { animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

@keyframes popIn {
  0% { opacity: 0; transform: scale(0.95) translateY(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
</style>