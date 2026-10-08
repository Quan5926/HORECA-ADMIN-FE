<template>
  <div class="font-general p-3 p-md-4 bg-light-smooth">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
      <div>
        <h3 class="fw-bold mb-1 text-gradient-brown">Vận Hành Đơn Hàng</h3>
        <p class="text-muted small mb-0"><i class="bi bi-lightning-charge-fill text-warning"></i> Hệ thống cập nhật thời gian thực</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-white shadow-sm rounded-4 px-3"><i class="bi bi-download me-2"></i>Xuất Excel</button>
        <button class="btn btn-vipep-green text-white rounded-4 px-4 py-2 fw-bold shadow-soft hover-scale" @click="openOrderForm()">
          <i class="bi bi-plus-lg me-2"></i>Tạo đơn mới
        </button>
      </div>
    </div>

    <div class="row g-3 mb-4 scroll-x-mobile flex-nowrap pb-2">
      <div v-for="s in steps" :key="s.value" class="col-md-3 col-lg shadow-hover">
        <div :class="['stat-card p-3 rounded-4 border-0 shadow-sm transition-all cursor-pointer', statusFilter === s.value ? 'active-stat' : '']" 
             @click="statusFilter = s.value"
             :style="`--card-color: ${s.color}`">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <div class="stat-icon" :style="`background: ${s.color}20; color: ${s.color}`">
              <i :class="s.icon"></i>
            </div>
            <span class="fw-bold fs-5" :style="`color: ${s.color}`">12</span>
          </div>
          <p class="mb-0 x-small fw-bold text-muted text-uppercase">{{ s.label }}</p>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-soft rounded-5 overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0 custom-table">
          <thead>
            <tr>
              <th class="ps-4">Mã Đơn</th>
              <th>Khách Hàng</th>
              <th>Sản Phẩm</th>
              <th>Giá Trị</th>
              <th class="text-center">Tiến Độ</th>
              <th class="text-end pe-4">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.id" class="order-item">
              <td class="ps-4">
                <span class="order-code-badge">#{{ order.code }}</span>
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <div class="avatar-glow me-3" :style="`background-image: linear-gradient(135deg, #4d3105, ${getStatusColor(order.status)})`">
                    {{ order.customerName[0] }}
                  </div>
                  <div>
                    <div class="fw-bold text-dark">{{ order.customerName }}</div>
                    <small class="text-muted"><i class="bi bi-phone me-1"></i>{{ order.phone }}</small>
                  </div>
                </div>
              </td>
              <td class="small text-secondary">
                <div v-if="order.items && order.items.length">
                  {{ order.items[0].name }} <span v-if="order.items.length > 1" class="badge bg-light text-dark">+{{ order.items.length - 1 }}</span>
                </div>
              </td>
              <td>
                <div class="fw-bold text-main-brown">{{ order.total.toLocaleString() }}đ</div>
              </td>
              <td class="text-center">
                <div class="status-pill shadow-sm" :style="`--status-color: ${getStatusColor(order.status)}`">
                   <span class="dot"></span> {{ getStatusLabel(order.status) }}
                </div>
              </td>
              <td class="text-end pe-4">
                <div class="action-buttons-wrap">
                  <button class="btn-custom btn-black" @click="viewDetail(order)" title="Xem chi tiết"><i class="bi bi-eye"></i></button>
                  <button class="btn-custom btn-gold" @click="openOrderForm(order)" title="Sửa đơn"><i class="bi bi-pencil"></i></button>
                  <button class="btn-custom btn-red" @click="deleteOrder(order.id)" title="Xóa"><i class="bi bi-trash"></i></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="selectedOrder" class="glass-overlay" @click.self="selectedOrder = null">
      <div class="modal-premium animate-pop-in">
        <div class="modal-premium-header" :style="`background: linear-gradient(135deg, #4d3105, ${getStatusColor(selectedOrder.status)})`">
          <div class="d-flex justify-content-between w-100">
            <div>
              <h4 class="mb-0 fw-bold text-white">Chi Tiết Đơn Hàng #{{ selectedOrder.code }}</h4>
              <span class="badge bg-white bg-opacity-25 mt-2">Ngày đặt: {{ selectedOrder.date }}</span>
            </div>
            <button class="btn-close btn-close-white" @click="selectedOrder = null"></button>
          </div>
        </div>

        <div class="p-4 bg-white">
          <div class="stepper-horizontal mb-5">
            <div v-for="(step, index) in steps.filter(x => x.value !== 'cancelled')" :key="index" 
                 class="step-node"
                 :class="{ 'active': isStepActive(step.value), 'done': isStepCompleted(step.value) }">
              <div class="step-circle" :title="step.label">
                <i :class="step.icon"></i>
              </div>
              <span class="step-text">{{ step.label }}</span>
            </div>
          </div>

          <div class="row g-4">
            <div class="col-md-5">
              <div class="card-info p-3 rounded-4 bg-light border-0">
                <h6 class="fw-bold mb-3"><i class="bi bi-geo-alt-fill me-2 text-danger"></i>Giao đến</h6>
                <p class="mb-1 fw-bold">{{ selectedOrder.customerName }}</p>
                <p class="mb-1 small text-muted">{{ selectedOrder.phone }}</p>
                <p class="mb-0 small text-muted">{{ selectedOrder.address }}</p>
              </div>
            </div>
            <div class="col-md-7">
               <div class="p-3 border rounded-4">
                  <h6 class="fw-bold mb-3 text-main-brown">Sản phẩm đã đặt</h6>
                  <div v-for="item in selectedOrder.items" :key="item.id" class="d-flex justify-content-between mb-2 pb-2 border-bottom border-dashed">
                    <span class="small">{{ item.name }} <strong>x{{ item.qty }}</strong></span>
                    <span class="fw-bold small">{{ (item.price * item.qty).toLocaleString() }}đ</span>
                  </div>
                  <div class="d-flex justify-content-between mt-3">
                    <span class="fw-bold">TỔNG CỘNG:</span>
                    <h4 class="fw-bold text-danger mb-0">{{ selectedOrder.total.toLocaleString() }}đ</h4>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div class="p-3 bg-light d-flex justify-content-center gap-3 rounded-bottom-5">
           <button class="btn btn-secondary rounded-pill px-4 fw-bold" @click="selectedOrder = null">Quay lại</button>
           <button class="btn btn-dark rounded-pill px-4 fw-bold shadow-sm" @click="updateOrderStatus(selectedOrder, 'shipping')">Tiếp tục giao hàng</button>
           <button class="btn btn-vipep-green text-white rounded-pill px-4 fw-bold shadow-sm" @click="updateOrderStatus(selectedOrder, 'completed')">Hoàn tất đơn</button>
        </div>
      </div>
    </div>

    <div v-if="isFormOpen" class="glass-overlay" @click.self="isFormOpen = false">
      <div class="modal-premium animate-pop-in" style="max-width: 600px;">
        <div class="modal-premium-header bg-vipep-green">
          <div class="d-flex justify-content-between w-100 align-items-center">
            <h4 class="mb-0 fw-bold text-white">{{ formOrder.id ? 'Cập Nhật Đơn Hàng' : 'Tạo Đơn Hàng Mới' }}</h4>
            <button class="btn-close btn-close-white" @click="isFormOpen = false"></button>
          </div>
        </div>
        <form @submit.prevent="saveOrder" class="p-4 bg-white">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label small fw-bold">Tên khách hàng</label>
              <input type="text" class="form-control bg-light border-0 py-2 rounded-3" v-model="formOrder.customerName" required>
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold">Số điện thoại</label>
              <input type="text" class="form-control bg-light border-0 py-2 rounded-3" v-model="formOrder.phone" required>
            </div>
            <div class="col-12">
              <label class="form-label small fw-bold">Địa chỉ giao hàng</label>
              <input type="text" class="form-control bg-light border-0 py-2 rounded-3" v-model="formOrder.address" required>
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold">Trạng thái đơn</label>
              <select class="form-select bg-light border-0 py-2 rounded-3" v-model="formOrder.status">
                <option v-for="s in steps" :key="s.value" :value="s.value">{{ s.label }}</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold">Tổng tiền (VNĐ)</label>
              <input type="number" class="form-control bg-light border-0 py-2 rounded-3 fw-bold text-danger" v-model="formOrder.total" required>
            </div>
          </div>
          <div class="mt-4 pt-3 border-top d-flex gap-2">
            <button type="button" class="btn btn-dark flex-grow-1 py-2 fw-bold rounded-pill" @click="isFormOpen = false">Hủy bỏ</button>
            <button type="submit" class="btn btn-vipep-green text-white flex-grow-1 py-2 fw-bold rounded-pill shadow-sm">Lưu đơn hàng</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const steps = [
  { label: 'Chờ xác nhận', value: 'pending', icon: 'bi bi-hourglass-split', color: '#ff9800' },
  { label: 'Đã xác nhận', value: 'confirmed', icon: 'bi bi-check2-circle', color: '#00bcd4' },
  { label: 'Đang đóng gói', value: 'packing', icon: 'bi bi-box-seam', color: '#9c27b0' },
  { label: 'Đã giao cho ĐVVC', value: 'handed', icon: 'bi bi-building-up', color: '#3f51b5' },
  { label: 'Đang giao hàng', value: 'shipping', icon: 'bi bi-truck', color: '#2196f3' },
  { label: 'Hoàn thành', value: 'completed', icon: 'bi bi-bag-check-fill', color: '#4caf50' },
  { label: 'Đã hủy', value: 'cancelled', icon: 'bi bi-x-octagon', color: '#f44336' }
];

const statusFilter = ref('all');
const orders = ref([
  { id: 1, code: 'HRC-001', customerName: 'Trần Đại Nghĩa', phone: '0912345678', date: '13/03/2026', total: 1500000, status: 'packing', address: '47 Hàng Chiếu, Hoàn Kiếm, HN', items: [{name: 'Tiêu sọ Vipep', qty: 10, price: 150000}] },
  { id: 2, code: 'HRC-002', customerName: 'Phan Thị Bích', phone: '0988777111', date: '12/03/2026', total: 850000, status: 'pending', address: 'Quận 3, TP.HCM', items: [{name: 'Ớt bột Hàn Quốc', qty: 5, price: 170000}] }
]);

const selectedOrder = ref(null);
const isFormOpen = ref(false);
const formOrder = ref({});

const filteredOrders = computed(() => statusFilter.value === 'all' ? orders.value : orders.value.filter(o => o.status === statusFilter.value));

const getStatusLabel = (val) => steps.find(s => s.value === val)?.label;
const getStatusColor = (val) => steps.find(s => s.value === val)?.color || '#999';

const openOrderForm = (order = null) => {
  if (order) {
    formOrder.value = { ...order };
  } else {
    formOrder.value = { id: null, code: 'HRC-' + Math.floor(Math.random()*1000), customerName: '', phone: '', address: '', total: 0, status: 'pending', date: new Date().toLocaleDateString('vi-VN'), items: [] };
  }
  isFormOpen.value = true;
};

const saveOrder = () => {
  if (formOrder.value.id) {
    const idx = orders.value.findIndex(o => o.id === formOrder.value.id);
    orders.value[idx] = { ...formOrder.value };
  } else {
    formOrder.value.id = Date.now();
    orders.value.unshift({ ...formOrder.value });
  }
  isFormOpen.value = false;
};

const deleteOrder = (id) => {
  if (confirm('Bạn chắc chắn muốn xóa đơn hàng này?')) {
    orders.value = orders.value.filter(o => o.id !== id);
  }
};

const viewDetail = (order) => { selectedOrder.value = order; };
const updateOrderStatus = (order, newStatus) => { 
  const target = orders.value.find(o => o.id === order.id);
  if(target) target.status = newStatus;
  selectedOrder.value = null; 
};

const isStepActive = (val) => selectedOrder.value?.status === val;
const isStepCompleted = (val) => {
  const currentIdx = steps.findIndex(s => s.value === selectedOrder.value?.status);
  const stepIdx = steps.findIndex(s => s.value === val);
  return stepIdx < currentIdx;
};
</script>

<style scoped>
.bg-light-smooth { background-color: #f4f7f6; min-height: 100vh; }
.text-gradient-brown { background: linear-gradient(135deg, #4d3105, #7eb33d); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.bg-vipep-green { background-color: #7eb33d !important; }
.btn-vipep-green { background-color: #7eb33d !important; border: none; }
.btn-vipep-green:hover { background-color: #6a9a32 !important; }
.text-main-brown { color: #4d3105 !important; }
.shadow-soft { box-shadow: 0 10px 30px rgba(0,0,0,0.05) !important; }

/* Stat Cards */
.stat-card { background: white; transition: 0.3s; border: 2px solid transparent !important; min-width: 140px; }
.stat-card:hover { transform: translateY(-5px); border-color: var(--card-color) !important; }
.active-stat { background: var(--card-color) !important; }
.active-stat p, .active-stat .fw-bold { color: white !important; }
.stat-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
.x-small { font-size: 10px; }

/* Buttons Custom */
.action-buttons-wrap { display: flex; gap: 6px; justify-content: flex-end; }
.btn-custom { width: 32px; height: 32px; border-radius: 8px; border: none; color: white; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
.btn-black { background: #333; } .btn-black:hover { background: #000; }
.btn-gold { background: #ffc107; } .btn-gold:hover { background: #e0a800; }
.btn-red { background: #dc3545; } .btn-red:hover { background: #c82333; }
.hover-scale:hover { transform: scale(1.03); }

/* Table Styling */
.custom-table thead th { background: #f8f9fa; border: none; padding: 15px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #777; }
.order-item:hover { background: #fcfbf9; }
.order-code-badge { background: #f0f0f0; padding: 4px 10px; border-radius: 6px; font-weight: bold; color: #4d3105; font-size: 13px; }
.avatar-glow { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }

/* Status Pill */
.status-pill { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 15px; font-size: 11px; font-weight: bold; background: white; color: var(--status-color); border: 1.5px solid var(--status-color); }
.status-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--status-color); margin-right: 6px; animation: pulse 1.5s infinite; }

/* Stepper 7 Steps */
.stepper-horizontal { display: flex; justify-content: space-between; position: relative; padding: 10px 0; }
.stepper-horizontal::before { content: ""; position: absolute; top: 30px; left: 5%; width: 90%; height: 2px; background: #eee; z-index: 1; }
.step-node { position: relative; z-index: 2; flex: 1; text-align: center; }
.step-circle { width: 35px; height: 35px; border-radius: 50%; background: white; border: 2px solid #eee; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: #ccc; transition: 0.4s; font-size: 0.9rem; }
.step-text { font-size: 9px; font-weight: bold; color: #999; display: block; line-height: 1.2; }

.step-node.done .step-circle { border-color: #7eb33d; background: #7eb33d; color: white; }
.step-node.active .step-circle { border-color: #4d3105; background: #4d3105; color: white; transform: scale(1.15); box-shadow: 0 4px 10px rgba(0,0,0,0.2); }

/* Modal Premium */
.glass-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); backdrop-filter: blur(6px); z-index: 9999; display: flex; align-items: center; justify-content: center; }
.modal-premium { background: white; border-radius: 30px; width: 95%; max-width: 850px; overflow: hidden; animation: popIn 0.3s ease-out; }
.modal-premium-header { padding: 30px; color: white; }

@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
@keyframes popIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
</style>