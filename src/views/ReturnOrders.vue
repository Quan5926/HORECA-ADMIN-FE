<template>
  <div class="font-general p-3 p-md-4 bg-light-smooth">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
      <div>
        <h3 class="fw-bold mb-1 text-gradient-brown">Quản Lý Đổi Trả</h3>
        <p class="text-muted small mb-0"><i class="bi bi-arrow-left-right text-primary me-1"></i> Xử lý thu hồi, hoàn tiền và kiểm kho</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-white shadow-sm rounded-pill px-3 fw-bold small"><i class="bi bi-printer me-2"></i>In báo cáo</button>
        <button class="btn btn-vipep-green text-white rounded-pill px-4 py-2 fw-bold shadow-soft hover-scale" @click="isFormOpen = true">
          <i class="bi bi-plus-lg me-2"></i>Tạo phiếu mới
        </button>
      </div>
    </div>

    <div class="row g-3 mb-4">
      <div v-for="s in returnSteps" :key="s.value" class="col-md-4">
        <div :class="['stat-card p-3 rounded-4 border-0 shadow-sm transition-all cursor-pointer', statusFilter === s.value ? 'active-stat' : '']" 
             @click="statusFilter = s.value"
             :style="`--card-color: ${s.color}`">
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-3">
              <div class="stat-icon" :style="`background: ${statusFilter === s.value ? '#ffffff40' : s.color + '20'}; color: ${statusFilter === s.value ? '#fff' : s.color}`">
                <i :class="s.icon"></i>
              </div>
              <span class="fw-bold text-uppercase small ls-1">{{ s.label }}</span>
            </div>
            <span class="fw-bold fs-4">{{ returns.filter(r => r.status === s.value).length }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-soft rounded-4 card-table-wrapper">
      <div class="table-responsive custom-scrollbar">
        <table class="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th class="ps-4 py-3">Mã Phiếu</th>
              <th class="py-3">Khách Hàng</th>
              <th class="py-3">Nội dung xử lý</th>
              <th class="py-3">Hoàn tiền</th>
              <th class="py-3 text-center">Trạng Thái</th>
              <th class="pe-4 py-3 text-end">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredReturns" :key="item.id" class="return-row">
              <td class="ps-4">
                <span class="badge-code">#RET-{{ item.id }}</span>
              </td>
              <td>
                <div class="fw-bold text-dark mb-0 text-truncate" style="max-width: 150px;">{{ item.customerName }}</div>
                <div class="text-muted x-small"><i class="bi bi-telephone me-1"></i>{{ item.phone }}</div>
              </td>
              <td>
                <div class="small fw-semibold text-truncate" style="max-width: 250px;">{{ item.reason }}</div>
                <div :class="['type-tag mt-1', item.type === 'exchange' ? 'tag-blue' : 'tag-orange']">
                  {{ item.type === 'exchange' ? 'Đổi hàng' : 'Trả hàng' }}
                </div>
              </td>
              <td>
                <span class="fw-bold text-danger">{{ item.refund.toLocaleString() }}đ</span>
              </td>
              <td class="text-center">
                <div class="status-badge" :style="`--bg: ${getStepInfo(item.status).color}`">
                  {{ getStepInfo(item.status).label }}
                </div>
              </td>
              <td class="pe-4 text-end">
                <div class="d-flex gap-2 justify-content-end align-items-center">
                  <button class="action-btn btn-view" @click="viewDetail(item)" title="Xem chi tiết"><i class="bi bi-eye-fill"></i></button>
                  <button v-if="item.status !== 'completed'" class="action-btn btn-done" @click="completeReturn(item)" title="Xác nhận"><i class="bi bi-check-all"></i></button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredReturns.length === 0">
              <td colspan="6" class="text-center py-5 text-muted">
                <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                Không có phiếu đổi trả nào ở trạng thái này.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="selectedReturn" class="glass-overlay" @click.self="selectedReturn = null">
      <div class="modal-premium animate-pop-in">
        <div class="modal-premium-header">
          <div class="d-flex align-items-center gap-3">
             <div class="header-icon"><i class="bi bi-file-earmark-text"></i></div>
             <div>
               <h5 class="mb-0 fw-bold">Chi Tiết Phiếu #{{ selectedReturn.id }}</h5>
               <span class="x-small opacity-75">Đơn hàng gốc: {{ selectedReturn.orderCode }}</span>
             </div>
          </div>
          <button class="btn-close-custom" @click="selectedReturn = null"><i class="bi bi-x-lg"></i></button>
        </div>
        
        <div class="modal-body p-4">
          <div class="row g-3">
            <div class="col-md-6">
               <div class="info-group">
                 <label>Khách hàng</label>
                 <div class="val fw-bold">{{ selectedReturn.customerName }}</div>
                 <div class="val small">{{ selectedReturn.phone }}</div>
                 <div class="val x-small text-muted">{{ selectedReturn.address }}</div>
               </div>
            </div>
            <div class="col-md-6">
               <div class="info-group h-100">
                 <label>Trạng thái hiện tại</label>
                 <div class="val mb-2">
                   <span class="status-badge w-100 py-2 justify-content-center" :style="`--bg: ${getStepInfo(selectedReturn.status).color}`">
                      {{ getStepInfo(selectedReturn.status).label }}
                   </span>
                 </div>
                 <div class="d-flex justify-content-between small">
                    <span class="text-muted">Hoàn tiền:</span>
                    <span class="fw-bold text-danger">{{ selectedReturn.refund.toLocaleString() }}đ</span>
                 </div>
               </div>
            </div>
            
            <div class="col-12 mt-3">
              <label class="small fw-bold text-muted text-uppercase ls-1">Sản phẩm đổi trả ({{ selectedReturn.products.length }})</label>
              <div class="product-list-mini mt-2">
                <div v-for="(p, i) in selectedReturn.products" :key="i" class="p-item">
                   <div class="d-flex justify-content-between align-items-center">
                     <div>
                        <div class="small fw-bold">{{ p.name }}</div>
                        <div class="x-small text-muted italic">Lý do: {{ p.note }}</div>
                     </div>
                     <div class="badge bg-light text-dark rounded-pill border">x{{ p.qty }}</div>
                   </div>
                </div>
              </div>
            </div>

            <div class="col-12 mt-3">
              <label class="small fw-bold text-muted text-uppercase ls-1">Lý do chi tiết</label>
              <div class="reason-box">"{{ selectedReturn.reason }}"</div>
            </div>
          </div>
        </div>

        <div class="modal-footer p-3 bg-light d-flex gap-2">
            <button class="btn btn-white flex-grow-1 rounded-pill fw-bold" @click="selectedReturn = null">Đóng cửa sổ</button>
            <button v-if="selectedReturn.status !== 'completed'" class="btn btn-vipep-green text-white flex-grow-1 rounded-pill fw-bold" @click="completeReturn(selectedReturn)">Xác nhận hoàn tất</button>
        </div>
      </div>
    </div>
    
    <div v-if="isFormOpen" class="glass-overlay" @click.self="isFormOpen = false">
      <div class="modal-premium animate-pop-in" style="max-width: 500px;">
        <div class="modal-premium-header bg-vipep-green">
           <h5 class="mb-0 fw-bold text-white">Tạo Phiếu Đổi Trả</h5>
           <button class="btn-close-custom text-white" @click="isFormOpen = false"><i class="bi bi-x-lg"></i></button>
        </div>
        <form @submit.prevent="saveReturn" class="p-4 bg-white">
          <div class="mb-3">
            <label class="form-label small fw-bold">Mã đơn hàng gốc</label>
            <input type="text" class="form-control rounded-3 border-light-2 bg-light shadow-none" placeholder="#HRC..." required>
          </div>
          <div class="row g-3 mb-3">
            <div class="col-6">
              <label class="form-label small fw-bold">Loại xử lý</label>
              <select class="form-select rounded-3 border-light-2 bg-light shadow-none" v-model="newReturn.type">
                <option value="return">Trả hàng</option>
                <option value="exchange">Đổi hàng</option>
              </select>
            </div>
            <div class="col-6">
              <label class="form-label small fw-bold">Tiền hoàn</label>
              <input type="number" class="form-control rounded-3 border-light-2 bg-light shadow-none" v-model="newReturn.refund">
            </div>
          </div>
          <div class="mb-4">
            <label class="form-label small fw-bold">Lý do</label>
            <textarea class="form-control rounded-3 border-light-2 bg-light shadow-none" rows="3" v-model="newReturn.reason"></textarea>
          </div>
          <button type="submit" class="btn btn-vipep-green text-white w-100 py-2 fw-bold rounded-pill shadow-soft">Xác nhận tạo phiếu</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const returnSteps = [
  { label: 'Chờ tiếp nhận', value: 'pending', icon: 'bi bi-clock-fill', color: '#f39c12' },
  { label: 'Đang xử lý', value: 'processing', icon: 'bi bi-truck', color: '#3498db' },
  { label: 'Hoàn tất', value: 'completed', icon: 'bi bi-check-circle-fill', color: '#27ae60' }
];

const statusFilter = ref('pending');
const isFormOpen = ref(false);
const selectedReturn = ref(null);
const newReturn = ref({ type: 'return', refund: 0, reason: '' });

const returns = ref([
  { 
    id: 1024, orderCode: '#HRC-9981', customerName: 'Nguyễn Bích Liên', phone: '0901234xxx', 
    address: '123 Cách Mạng Tháng 8, Q.3, TP.HCM', reason: 'Hũ bị hở seal dẫn đến mốc sản phẩm bên trong', 
    type: 'return', refund: 150000, status: 'pending',
    products: [{ name: 'Tiêu sọ Vipep 100g', sku: 'TS100', qty: 2, note: 'Bị hở seal' }]
  },
  { 
    id: 1025, orderCode: '#HRC-8822', customerName: 'Văn Phòng ABC', phone: '028.3844xxx', 
    address: '45 Lê Duẩn, Quận 1, TP.HCM', reason: 'Giao sai kích thước hũ yêu cầu', 
    type: 'exchange', refund: 0, status: 'processing',
    products: [{ name: 'Bột Nghệ Vipep', sku: 'NG500', qty: 5, note: 'Cần đổi hũ 200g' }]
  },
  { 
    id: 1026, orderCode: '#HRC-7755', customerName: 'Trần Minh Tâm', phone: '0933445xxx', 
    address: 'Kiệt 44, Điện Biên Phủ, Đà Nẵng', reason: 'Hàng bị vỡ trong quá trình vận chuyển', 
    type: 'return', refund: 320000, status: 'pending',
    products: [
      { name: 'Dầu mè nguyên chất', sku: 'DM250', qty: 1, note: 'Vỡ chai thủy tinh' },
      { name: 'Hạt nêm rau củ', sku: 'RC500', qty: 1, note: 'Bị dính dầu' }
    ]
  },
  { 
    id: 1027, orderCode: '#HRC-1122', customerName: 'Lê Thị Mỹ', phone: '0702233xxx', 
    address: 'Chung cư Blue Sky, Tân Bình, TP.HCM', reason: 'Sản phẩm sắp hết hạn sử dụng', 
    type: 'exchange', refund: 0, status: 'completed',
    products: [{ name: 'Quế thanh Vipep', sku: 'QT50', qty: 10, note: 'Date còn 2 tháng' }]
  }
]);

const filteredReturns = computed(() => returns.value.filter(r => r.status === statusFilter.value));
const getStepInfo = (val) => returnSteps.find(s => s.value === val) || {label: 'N/A', color: '#999'};

const viewDetail = (item) => { selectedReturn.value = item; };
const completeReturn = (item) => {
  if(confirm('Xác nhận đã xử lý hoàn tất?')) {
    item.status = 'completed';
    selectedReturn.value = null;
  }
};
const saveReturn = () => {
  alert('Đã tạo phiếu thành công!');
  isFormOpen.value = false;
};
</script>

<style scoped>
.bg-light-smooth { background-color: #f8fafc; min-height: 100vh; }
.text-gradient-brown { background: linear-gradient(135deg, #4d3105, #7eb33d); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.ls-1 { letter-spacing: 0.5px; }

/* FIX MÀU NÚT VIPEP GREEN */
.btn-vipep-green { 
  background-color: #7eb33d !important; 
  border-color: #7eb33d !important;
  transition: all 0.3s ease;
}
.btn-vipep-green:hover { 
  background-color: #6a9c32 !important; 
  box-shadow: 0 8px 20px rgba(126, 179, 61, 0.35) !important;
  transform: translateY(-2px);
}

.hover-scale:active { transform: scale(0.95); }

/* Stat Card */
.stat-card { background: white; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.active-stat { background: var(--card-color) !important; color: white !important; transform: translateY(-3px); }
.stat-icon { width: 45px; height: 45px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; }

/* TABLE FIX: Ngăn chặn dải trắng văng ra ngoài */
.card-table-wrapper {
  overflow: hidden;
  border: none;
  background: white;
}

.table-responsive {
  max-height: 600px;
  overflow-y: auto;
  overflow-x: auto;
  position: relative;
  border-radius: 16px;
}

.table {
  width: 100%;
  border-collapse: separate; /* Quan trọng để giữ bo góc và sticky hoạt động cùng lúc */
  border-spacing: 0;
}

.table thead th {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f8fafc !important; /* Màu nền của header */
  color: #64748b;
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 700;
  border-bottom: 2px solid #edf2f7;
  box-shadow: inset 0 -1px 0 #edf2f7; /* Thay thế border vì sticky th khó hiển thị border-bottom */
}

/* Các UI khác */
.badge-code { background: #f1f5f9; color: #475569; padding: 4px 10px; border-radius: 8px; font-family: monospace; font-weight: bold; font-size: 12px; }
.type-tag { display: inline-block; padding: 2px 10px; border-radius: 6px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
.tag-blue { background: #e0f2fe; color: #0369a1; }
.tag-orange { background: #ffedd5; color: #9a3412; }
.status-badge { display: inline-flex; align-items: center; padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: bold; color: white; background: var(--bg); box-shadow: 0 4px 10px -2px var(--bg); }
.action-btn { width: 34px; height: 34px; border-radius: 10px; border: none; display: inline-flex; align-items: center; justify-content: center; transition: 0.2s; font-size: 1rem; }
.btn-view { background: #f1f5f9; color: #475569; }
.btn-view:hover { background: #1e293b; color: #fff; }
.btn-done { background: #ecfdf5; color: #059669; }
.btn-done:hover { background: #059669; color: #fff; }

/* Modal */
.glass-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(8px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 15px; }
.modal-premium { background: white; border-radius: 24px; width: 100%; max-width: 650px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
.modal-premium-header { padding: 20px 24px; background: #1e293b; color: white; display: flex; justify-content: space-between; align-items: center; }
.header-icon { width: 40px; height: 40px; background: rgba(255,255,255,0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
.btn-close-custom { background: none; border: none; color: #94a3b8; font-size: 1.2rem; transition: 0.2s; }
.btn-close-custom:hover { color: white; transform: rotate(90deg); }

.info-group { background: #f8fafc; padding: 15px; border-radius: 16px; border: 1px solid #f1f5f9; }
.info-group label { display: block; font-size: 10px; text-transform: uppercase; font-weight: bold; color: #64748b; margin-bottom: 5px; }
.product-list-mini { border: 1px solid #f1f5f9; border-radius: 12px; overflow: hidden; }
.p-item { padding: 10px 15px; background: white; border-bottom: 1px solid #f1f5f9; }
.p-item:last-child { border-bottom: none; }
.reason-box { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px; border-radius: 8px; font-style: italic; font-size: 13px; margin-top: 8px; color: #92400e; }

.x-small { font-size: 11px; }
.border-light-2 { border: 1.5px solid #e2e8f0 !important; }
.animate-pop-in { animation: popIn 0.25s cubic-bezier(0.26, 0.53, 0.74, 1.48); }
@keyframes popIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

/* Tùy chỉnh thanh cuộn cho table */
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
</style>