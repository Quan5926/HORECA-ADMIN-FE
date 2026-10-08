<template>
  <div class="font-general p-3 p-md-4 bg-light min-vh-100">
    <div class="mb-4">
      <h4 class="fw-bold text-main-brown">Quản lý Liên hệ & Thông tin Công ty</h4>
      <p class="text-muted small">Phản hồi tin nhắn khách hàng và cập nhật thông tin hiển thị trên website.</p>
    </div>

    <ul class="nav nav-pills mb-4 bg-white p-2 rounded-4 shadow-sm d-inline-flex border">
      <li class="nav-item">
        <button class="nav-link px-4 py-2 rounded-3 fw-bold transition-all" 
                :class="{ 'active bg-vipep-green text-white': activeTab === 'inbox', 'text-secondary': activeTab !== 'inbox' }" 
                @click="activeTab = 'inbox'">
          <i class="bi bi-chat-dots me-2"></i>Hộp thư khách hàng
        </button>
      </li>
      <li class="nav-item ms-2">
        <button class="nav-link px-4 py-2 rounded-3 fw-bold transition-all" 
                :class="{ 'active bg-vipep-green text-white': activeTab === 'config', 'text-secondary': activeTab !== 'config' }" 
                @click="activeTab = 'config'">
          <i class="bi bi-gear-fill me-2"></i>Thông tin công ty
        </button>
      </li>
    </ul>

    <div v-if="activeTab === 'inbox'" class="animate-fade-in">
       <div class="row g-3 mb-4 align-items-center">
        <div class="col-md-4">
          <div class="bg-white p-3 rounded-4 shadow-sm border-start border-4 border-danger d-flex justify-content-between align-items-center">
            <div>
              <p class="text-muted small mb-1 fw-bold">Tin nhắn chưa đọc</p>
              <h4 class="fw-bold mb-0 text-danger">{{ unreadCount }}</h4>
            </div>
            <i class="bi bi-envelope-exclamation fs-3 opacity-25 text-danger"></i>
          </div>
        </div>

        <div class="col-md-8 text-end animate-fade-in" v-if="selectedIds.length > 0">
           <span class="text-muted small fw-bold me-3">Đã chọn: <span class="text-danger">{{ selectedIds.length }}</span> liên hệ</span>
           <button class="btn btn-danger px-4 py-2 rounded-pill fw-bold shadow-sm" @click="deleteMultipleContacts">
             <i class="bi bi-trash3-fill me-2"></i>Xóa các mục đã chọn
           </button>
        </div>
      </div>

      <div class="bg-white rounded-4 shadow-sm p-4">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light text-muted small">
              <tr>
                <th class="rounded-start text-center" style="width: 40px;">
                   <input class="form-check-input border-secondary" type="checkbox" 
                          :checked="isAllSelected" 
                          @change="toggleSelectAll">
                </th>
                <th class="fw-bold">Thời gian</th>
                <th class="fw-bold">Khách hàng</th>
                <th class="fw-bold" style="width: 35%;">Tiêu đề & Nội dung</th>
                <th class="fw-bold text-center">Trạng thái</th>
                <th class="fw-bold text-end rounded-end">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="paginatedContacts.length === 0">
                <td colspan="6" class="text-center py-4 text-muted">Không có tin nhắn nào trong trang này.</td>
              </tr>
              <tr v-for="contact in paginatedContacts" :key="contact.id" :class="{'bg-light': selectedIds.includes(contact.id)}">
                <td class="text-center">
                  <input class="form-check-input border-secondary" type="checkbox" 
                         :value="contact.id" 
                         v-model="selectedIds">
                </td>
                <td class="small text-muted">{{ contact.ngayTao }}</td>
                <td>
                  <div class="fw-bold text-dark">{{ contact.hoTen }}</div>
                  <div class="small text-muted"><i class="bi bi-telephone-fill me-1"></i>{{ contact.soDienThoai }}</div>
                  <div class="small text-muted"><i class="bi bi-envelope-fill me-1"></i>{{ contact.email }}</div>
                </td>
                <td>
                  <p class="mb-1 fw-bold small text-dark text-truncate" style="max-width: 300px;">{{ contact.tieuDe }}</p>
                  <p class="mb-0 small text-muted text-truncate" style="max-width: 300px;">{{ contact.noiDung }}</p>
                </td>
                <td class="text-center">
                  <span class="badge rounded-pill px-3 py-2" :class="getStatusClass(contact.trangThai)">
                    {{ getStatusText(contact.trangThai) }}
                  </span>
                </td>
                <td class="text-end">
                  <button class="btn btn-sm btn-light text-primary me-1 shadow-sm" @click="openModal(contact)" title="Xem chi tiết">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button class="btn btn-sm btn-light text-danger shadow-sm" @click="deleteContact(contact.id)" title="Xóa tin nhắn">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex justify-content-between align-items-center mt-4 border-top pt-3" v-if="totalPages > 1">
          <p class="text-muted small mb-0">Hiển thị <span class="fw-bold text-dark">{{ paginatedContacts.length }}</span> / <span class="fw-bold text-dark">{{ contacts.length }}</span> tin nhắn</p>
          <ul class="pagination pagination-sm mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link text-success" @click="changePage(currentPage - 1)">«</button>
            </li>
            <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
              <button class="page-link" :class="currentPage === page ? 'bg-vipep-green border-vipep-green text-white' : 'text-success'" @click="changePage(page)">
                {{ page }}
              </button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link text-success" @click="changePage(currentPage + 1)">»</button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'config'" class="animate-fade-in">
      <div class="row g-4">
        <div class="col-lg-7">
          <div class="bg-white rounded-4 shadow-sm p-4 h-100">
            <h6 class="fw-bold mb-4 border-bottom pb-3 text-main-brown"><i class="bi bi-pencil-square me-2"></i>Cập nhật thông tin công ty</h6>
            
            <form @submit.prevent="saveCompanyInfo">
              <div class="row g-3">
                <div class="col-md-12">
                  <label class="form-label small fw-bold text-secondary">Tên Công ty hiển thị</label>
                  <input type="text" class="form-control bg-light border-0 shadow-none py-2" v-model="companyInfo.name" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-secondary">Số Hotline / Điện thoại</label>
                  <input type="text" class="form-control bg-light border-0 shadow-none py-2" v-model="companyInfo.phone" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-secondary">Email nhận thư</label>
                  <input type="email" class="form-control bg-light border-0 shadow-none py-2" v-model="companyInfo.email" required>
                </div>
                <div class="col-md-12">
                  <label class="form-label small fw-bold text-secondary">Địa chỉ Văn phòng</label>
                  <input type="text" class="form-control bg-light border-0 shadow-none py-2" v-model="companyInfo.office" required>
                </div>
                <div class="col-md-12">
                  <label class="form-label small fw-bold text-secondary">Địa chỉ Nhà máy sản xuất</label>
                  <input type="text" class="form-control bg-light border-0 shadow-none py-2" v-model="companyInfo.factory">
                </div>
                <div class="col-md-12">
                  <label class="form-label small fw-bold text-secondary">Link nhúng Google Maps (Iframe SRC)</label>
                  <textarea class="form-control bg-light border-0 shadow-none py-2" rows="3" v-model="companyInfo.mapUrl" required></textarea>
                  <div class="form-text small mt-2">Ví dụ: <code>https://www.google.com/maps/embed?pb=...</code> (Chỉ copy phần link bên trong thuộc tính src="...")</div>
                </div>
              </div>

              <div class="mt-4 pt-3 border-top">
                <button type="submit" class="btn btn-vipep-green text-white px-4 py-2 rounded-pill fw-bold shadow-hover">
                  <i class="bi bi-save me-2"></i> Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>

        <div class="col-lg-5">
          <div class="bg-white rounded-4 shadow-sm p-4 h-100">
            <h6 class="fw-bold mb-4 border-bottom pb-3 text-main-brown"><i class="bi bi-eye me-2"></i>Xem trước hiển thị (Website)</h6>
            <div class="preview-fe p-4 rounded-4 border bg-light">
              <h5 class="fw-bold text-main-brown mb-4">{{ companyInfo.name }}</h5>
              <div class="d-flex mb-3 align-items-start">
                <div class="bg-white text-main-brown rounded-circle p-2 me-3 border shadow-sm d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;"><i class="bi bi-geo-alt-fill"></i></div>
                <div><h6 class="fw-bold mb-1 small">Văn phòng</h6><p class="text-muted mb-0 small">{{ companyInfo.office }}</p></div>
              </div>
              <div class="d-flex mb-3 align-items-start">
                <div class="bg-white text-main-brown rounded-circle p-2 me-3 border shadow-sm d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;"><i class="bi bi-telephone-fill"></i></div>
                <div><h6 class="fw-bold mb-1 small">Hotline</h6><p class="text-main-brown fw-bold mb-0">{{ companyInfo.phone }}</p></div>
              </div>
              <div class="d-flex align-items-start">
                <div class="bg-white text-main-brown rounded-circle p-2 me-3 border shadow-sm d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;"><i class="bi bi-envelope-fill"></i></div>
                <div><h6 class="fw-bold mb-1 small">Email</h6><p class="text-muted mb-0 small">{{ companyInfo.email }}</p></div>
              </div>

              <div class="mt-4 rounded-4 overflow-hidden border shadow-sm" style="height: 200px; background-color: #e9ecef;">
                <iframe v-if="companyInfo.mapUrl" :src="companyInfo.mapUrl" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
                <div v-else class="w-100 h-100 d-flex align-items-center justify-content-center text-muted small">Chưa có bản đồ</div>
              </div>
            </div>
            
            <div class="alert alert-warning mt-4 small border-0 shadow-sm rounded-3">
              <i class="bi bi-info-circle-fill me-2"></i>
              Mọi thay đổi tại đây sẽ lập tức được cập nhật lên trang Liên hệ, Footer và các nút Hotline trên giao diện của khách hàng.
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedContact" class="custom-modal-overlay" @click.self="closeModal">
       <div class="custom-modal bg-white rounded-4 shadow-lg p-4 animate-slide-down">
          <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
              <h5 class="fw-bold text-main-brown mb-0">Chi tiết liên hệ</h5>
              <button class="btn-close" @click="closeModal"></button>
          </div>
          
          <div class="row g-3 mb-4">
              <div class="col-md-6">
                <p class="mb-1 small text-muted">Họ và tên khách hàng</p>
                <p class="fw-bold text-dark mb-0">{{ selectedContact.hoTen }}</p>
              </div>
              <div class="col-md-6">
                <p class="mb-1 small text-muted">Thời gian gửi</p>
                <p class="fw-bold text-dark mb-0">{{ selectedContact.ngayTao }}</p>
              </div>
              <div class="col-md-6">
                <p class="mb-1 small text-muted">Số điện thoại</p>
                <p class="fw-bold text-primary mb-0"><a :href="'tel:' + selectedContact.soDienThoai">{{ selectedContact.soDienThoai }}</a></p>
              </div>
              <div class="col-md-6">
                <p class="mb-1 small text-muted">Email</p>
                <p class="fw-bold text-primary mb-0"><a :href="'mailto:' + selectedContact.email">{{ selectedContact.email }}</a></p>
              </div>
          </div>

          <div class="bg-light p-3 rounded-4 border mb-4">
              <p class="mb-2 small text-muted fw-bold">Tiêu đề: <span class="text-dark">{{ selectedContact.tieuDe }}</span></p>
              <p class="mb-1 small text-muted fw-bold">Nội dung:</p>
              <p class="mb-0 text-dark" style="white-space: pre-wrap;">{{ selectedContact.noiDung }}</p>
          </div>

          <div class="row g-3 mb-4">
            <div class="col-md-12">
              <label class="form-label small fw-bold text-secondary">Cập nhật trạng thái xử lý</label>
              <select class="form-select bg-light border-0 shadow-none py-2" v-model="selectedContact.trangThai">
                  <option value="CHUA_DOC">🔴 Chưa đọc / Chờ xử lý</option>
                  <option value="DA_DOC">🟡 Đã xem (Đang xử lý)</option>
                  <option value="DA_TRA_LOI">🟢 Đã hoàn tất / Đã trả lời</option>
              </select>
            </div>
            <div class="col-md-12">
              <label class="form-label small fw-bold text-secondary">Ghi chú nội bộ (Khách hàng không thấy)</label>
              <textarea class="form-control bg-light border-0 shadow-none" v-model="selectedContact.ghiChuAdmin" rows="3" placeholder="Ghi chú lại tiến độ, nhân viên phụ trách, hoặc kết quả tư vấn..."></textarea>
            </div>
          </div>

          <div class="text-end pt-3 border-top">
              <button class="btn btn-light px-4 py-2 rounded-pill me-2 fw-bold" @click="closeModal">Hủy</button>
              <button class="btn btn-vipep-green text-white px-4 py-2 rounded-pill fw-bold shadow-hover" @click="saveContactStatus">
                <i class="bi bi-check2-circle me-1"></i> Lưu trạng thái
              </button>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
// Đảm bảo đường dẫn service chuẩn nhé!
import adminContactService from '@/services/adminContactService'; 

const toast = useToast();

const activeTab = ref('inbox');
const contacts = ref([]);
const companyInfo = ref({ name: '', phone: '', email: '', office: '', factory: '', mapUrl: '' });
const selectedContact = ref(null);

// ================= PHÂN TRANG & XÓA NHIỀU =================
const itemsPerPage = 8; // Số liên hệ hiển thị trên mỗi trang
const currentPage = ref(1);
const selectedIds = ref([]); // Mảng chứa ID các liên hệ được check

// Data cho trang hiện tại
const paginatedContacts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return contacts.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(contacts.value.length / itemsPerPage));

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    selectedIds.value = []; // Reset list check khi chuyển trang
  }
};

// Check xem tất cả các item ở "trang hiện tại" đã được chọn chưa
const isAllSelected = computed(() => {
  return paginatedContacts.value.length > 0 && 
         paginatedContacts.value.every(c => selectedIds.value.includes(c.id));
});

// Toggle nút Check All (chỉ check/uncheck các item ở trang hiện tại)
const toggleSelectAll = (event) => {
  if (event.target.checked) {
    // Thêm các ID của trang hiện tại chưa có trong selectedIds
    const currentIds = paginatedContacts.value.map(c => c.id);
    selectedIds.value = [...new Set([...selectedIds.value, ...currentIds])];
  } else {
    // Bỏ các ID của trang hiện tại khỏi selectedIds
    const currentIds = paginatedContacts.value.map(c => c.id);
    selectedIds.value = selectedIds.value.filter(id => !currentIds.includes(id));
  }
};

// ==========================================================

const unreadCount = computed(() => contacts.value.filter(c => c.trangThai === 'CHUA_DOC').length);

onMounted(() => {
  fetchContacts();
  fetchCompanyInfo();
});

// ================= GỌI API =================
const fetchContacts = async () => {
  try {
    const response = await adminContactService.getAllContacts();
    contacts.value = response.data; 
  } catch (error) {
    console.error('Lỗi khi tải liên hệ:', error);
    toast.error('Không thể tải danh sách liên hệ!');
  }
};

const fetchCompanyInfo = async () => {
  try {
    const response = await adminContactService.getCompanyInfo();
    if (response.data) companyInfo.value = response.data;
  } catch (error) {
    console.error('Lỗi khi tải thông tin công ty:', error);
  }
};

const saveCompanyInfo = async () => {
  try {
    await adminContactService.updateCompanyInfo(companyInfo.value);
    toast.success('Cập nhật thông tin công ty thành công!');
  } catch (error) {
    console.error('Lỗi cập nhật:', error);
    toast.error('Có lỗi xảy ra khi lưu thông tin công ty.');
  }
};

const saveContactStatus = async () => {
  try {
    const statusData = {
      trangThai: selectedContact.value.trangThai,
      ghiChuAdmin: selectedContact.value.ghiChuAdmin
    };

    await adminContactService.updateContactStatus(selectedContact.value.id, statusData);
    
    const index = contacts.value.findIndex(c => c.id === selectedContact.value.id);
    if(index !== -1) {
        contacts.value[index].trangThai = selectedContact.value.trangThai;
        contacts.value[index].ghiChuAdmin = selectedContact.value.ghiChuAdmin;
    }

    toast.success('Đã cập nhật trạng thái xử lý!');
    closeModal();
  } catch (error) {
    console.error('Lỗi lưu trạng thái:', error);
    toast.error('Không thể cập nhật trạng thái.');
  }
};

// Xóa 1 liên hệ
const deleteContact = async (id) => { 
  if(confirm('⚠️ Bạn có chắc chắn muốn xóa tin nhắn này vĩnh viễn?')) {
      try {
        await adminContactService.deleteContact(id);
        contacts.value = contacts.value.filter(c => c.id !== id);
        
        // Cập nhật lại UI nếu trang hiện tại bị rỗng do xóa hết
        if (paginatedContacts.value.length === 0 && currentPage.value > 1) {
           currentPage.value--;
        }
        
        toast.success('Đã xóa tin nhắn thành công!');
      } catch (error) {
        console.error('Lỗi xóa tin nhắn:', error);
        toast.error('Lỗi không thể xóa tin nhắn này.');
      }
  }
};

// Xóa NHIỀU liên hệ cùng lúc
const deleteMultipleContacts = async () => {
  if(confirm(`⚠️ Bạn có chắc chắn muốn xóa vĩnh viễn ${selectedIds.value.length} tin nhắn đã chọn?`)) {
      try {
        // Gọi API xóa từng item trong mảng (Do API delete của bạn đang là delete 1 id)
        // Nếu backend có hỗ trợ API xóa mảng ID thì gọi API đó sẽ tối ưu hơn
        const deletePromises = selectedIds.value.map(id => adminContactService.deleteContact(id));
        await Promise.all(deletePromises);

        // Lọc bỏ những item đã xóa khỏi danh sách FE
        contacts.value = contacts.value.filter(c => !selectedIds.value.includes(c.id));
        
        toast.success(`Đã xóa thành công ${selectedIds.value.length} tin nhắn!`);
        selectedIds.value = []; // Reset mảng chọn
        
        // Điều chỉnh trang nếu trang hiện tại rỗng
        if (paginatedContacts.value.length === 0 && currentPage.value > 1) {
           currentPage.value = 1;
        }

      } catch (error) {
        console.error('Lỗi xóa nhiều tin nhắn:', error);
        toast.error('Có lỗi xảy ra trong quá trình xóa. Vui lòng thử lại hoặc F5.');
      }
  }
};

// ================= UI HELPER =================
const getStatusText = (status) => {
    const map = { 'CHUA_DOC': 'Chưa đọc', 'DA_DOC': 'Đang xử lý', 'DA_TRA_LOI': 'Đã hoàn tất' };
    return map[status] || 'Không rõ';
};

const getStatusClass = (status) => {
    const map = {
        'CHUA_DOC': 'bg-danger-subtle text-danger border border-danger-subtle',
        'DA_DOC': 'bg-warning-subtle text-warning border border-warning-subtle',
        'DA_TRA_LOI': 'bg-success-subtle text-success border border-success-subtle'
    };
    return map[status] || 'bg-secondary';
};

const openModal = (contact) => { 
    selectedContact.value = JSON.parse(JSON.stringify(contact)); 
    if (selectedContact.value.trangThai === 'CHUA_DOC') {
        selectedContact.value.trangThai = 'DA_DOC';
    }
};

const closeModal = () => {
    selectedContact.value = null;
};
</script>

<style scoped>
/* Typography & Base Colors */
.font-general { font-family: 'Quicksand', sans-serif !important; }
.text-main-brown { color: #4A3018 !important; }
.bg-vipep-green { background-color: #5b8e1d !important; }
.btn-vipep-green { background-color: #5b8e1d; border-color: #5b8e1d; }
.btn-vipep-green:hover { background-color: #4a7516; border-color: #4a7516; }
.border-vipep-green { border-color: #5b8e1d !important; }

/* Transitions & Animations */
.transition-all { transition: all 0.3s ease; }
.shadow-hover { transition: all 0.3s ease; }
.shadow-hover:hover { box-shadow: 0 5px 15px rgba(91, 142, 29, 0.3) !important; transform: translateY(-2px); }

.animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
@keyframes fadeIn { 
  from { opacity: 0; transform: translateY(10px); } 
  to { opacity: 1; transform: translateY(0); } 
}

/* Forms */
.form-control:focus, .form-select:focus, .form-check-input:focus {
  background-color: #fff !important;
  box-shadow: 0 0 0 3px rgba(91, 142, 29, 0.15) !important;
  border-color: #5b8e1d !important;
}

/* Checked State for Checkbox */
.form-check-input:checked {
  background-color: #dc3545; /* Màu đỏ Danger cho nút xóa */
  border-color: #dc3545;
}

/* Modal Overlay & Styling */
.custom-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.custom-modal {
  width: 100%;
  max-width: 650px;
  max-height: 90vh;
  overflow-y: auto;
}

.animate-slide-down { animation: slideDown 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); }
@keyframes slideDown { 
  from { opacity: 0; transform: translateY(-30px); } 
  to { opacity: 1; transform: translateY(0); } 
}

/* Custom Scrollbar */
.custom-modal::-webkit-scrollbar { width: 6px; }
.custom-modal::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
.custom-modal::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 10px; }
.custom-modal::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
</style>