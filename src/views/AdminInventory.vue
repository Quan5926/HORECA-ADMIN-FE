<template>
  <div class="font-general p-3 p-md-4">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
      <div>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb mb-1 small">
            <li class="breadcrumb-item"><router-link to="/" class="text-muted text-decoration-none">Tổng quan</router-link></li>
            <li class="breadcrumb-item"><router-link to="/products" class="text-muted text-decoration-none">Sản phẩm</router-link></li>
            <li class="breadcrumb-item active fw-bold" aria-current="page">Cảnh báo tồn kho</li>
          </ol>
        </nav>
        <h4 class="fw-bold mb-0 text-main-brown">Cảnh báo tồn kho</h4>
      </div>
      <div>
        <button class="btn btn-outline-secondary rounded-pill shadow-sm fw-medium d-flex align-items-center gap-2">
          <i class="bi bi-download"></i> Xuất báo cáo
        </button>
      </div>
    </div>

    <div class="row g-3 mb-4">
      <div class="col-md-6 col-lg-4">
        <div class="bg-white rounded-4 shadow-sm p-3 d-flex align-items-center border-start border-4 border-warning">
          <div class="bg-warning bg-opacity-10 p-3 rounded-circle text-warning me-3">
            <i class="bi bi-exclamation-triangle-fill fs-4"></i>
          </div>
          <div>
            <p class="text-muted small mb-0 fw-bold">Sắp hết hàng (1 - 10)</p>
            <h4 class="fw-bold mb-0">
              <span v-if="isLoading" class="spinner-border spinner-border-sm text-warning"></span>
              <span v-else>{{ lowStockItems.length }}</span> 
              <span class="fs-6 fw-normal text-muted">sản phẩm</span>
            </h4>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-4">
        <div class="bg-white rounded-4 shadow-sm p-3 d-flex align-items-center border-start border-4 border-danger">
          <div class="bg-danger bg-opacity-10 p-3 rounded-circle text-danger me-3">
            <i class="bi bi-x-circle-fill fs-4"></i>
          </div>
          <div>
            <p class="text-muted small mb-0 fw-bold">Đã hết hàng (0)</p>
            <h4 class="fw-bold mb-0">
              <span v-if="isLoading" class="spinner-border spinner-border-sm text-danger"></span>
              <span v-else>{{ outOfStockItems.length }}</span> 
              <span class="fs-6 fw-normal text-muted">sản phẩm</span>
            </h4>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-4 shadow-sm p-4">
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h6 class="fw-bold mb-0">Danh sách cần nhập hàng ({{ allWarningItems.length }})</h6>
        <div class="input-group w-auto" style="max-width: 350px;">
          <span class="input-group-text bg-light border-0"><i class="bi bi-search"></i></span>
          <input 
            type="text" 
            class="form-control bg-light border-0 shadow-none" 
            placeholder="Tìm tên/Mã SP..."
            v-model="searchQuery"
            @keyup.enter="handleSearch"
          >
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light text-muted small">
            <tr>
              <th scope="col" class="fw-bold rounded-start">Sản phẩm</th>
              <th scope="col" class="fw-bold text-center">Phân loại</th>
              <th scope="col" class="fw-bold text-center">Mức cảnh báo</th>
              <th scope="col" class="fw-bold text-center">Tồn kho hiện tại</th>
              <th scope="col" class="fw-bold text-center">Trạng thái</th>
              <th scope="col" class="fw-bold text-end rounded-end" style="min-width: 150px;">Cập nhật nhanh</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="6" class="text-center py-5">
                <div class="spinner-border text-success" role="status"></div>
                <div class="mt-2 text-muted small">Đang kiểm tra kho hàng...</div>
              </td>
            </tr>

            <tr v-else-if="allWarningItems.length === 0">
              <td colspan="6" class="text-center text-muted py-5">
                <i class="bi bi-check-circle fs-1 text-success d-block mb-3"></i>
                <h6 class="fw-bold text-dark">Tuyệt vời!</h6>
                <p class="mb-0">Kho hàng đang rất dồi dào, không có sản phẩm nào thiếu hụt.</p>
              </td>
            </tr>

            <tr v-else v-for="item in paginatedWarningItems" :key="item.id">
              <td>
                <div class="d-flex align-items-center gap-3">
                  <div class="border bg-white rounded-3 d-flex align-items-center justify-content-center overflow-hidden shadow-sm" style="width: 45px; height: 45px;">
                    <img v-if="getProductImage(item)" :src="getProductImage(item)" style="width:100%; height:100%; object-fit:cover;">
                    <i v-else class="bi bi-image fs-5 text-muted opacity-50"></i>
                  </div>
                  <div>
                    <span class="fw-bold text-dark d-block text-truncate" style="max-width: 250px;" :title="item.tenSanPham">
                      {{ item.tenSanPham }}
                    </span>
                    <span class="small text-muted">SKU: {{ item.maSku || '---' }}</span>
                  </div>
                </div>
              </td>
              <td class="text-center small text-muted">{{ getCategoryName(item) }}</td>
              <td class="text-center text-muted fw-medium">{{ WARNING_THRESHOLD }}</td>
              <td class="text-center">
                <span class="fw-bold fs-5" :class="item.tonKho === 0 ? 'text-danger' : 'text-warning'">
                  {{ item.tonKho }}
                </span>
              </td>
              <td class="text-center">
                <span v-if="item.tonKho === 0" class="badge bg-danger-subtle text-danger rounded-pill px-3 py-2">Hết hàng</span>
                <span v-else class="badge bg-warning-subtle text-warning-emphasis rounded-pill px-3 py-2">Sắp hết</span>
              </td>
              <td class="text-end">
                <div class="input-group input-group-sm justify-content-end">
                  <input 
                    type="number" 
                    class="form-control text-center shadow-none border-secondary-subtle" 
                    style="max-width: 70px;" 
                    v-model="item.addAmount" 
                    placeholder="+0"
                    min="1"
                  >
                  <button class="btn btn-vipep-green text-white" @click="addStock(item)" :disabled="item.isUpdating">
                    <span v-if="item.isUpdating" class="spinner-border spinner-border-sm"></span>
                    <span v-else>Nhập</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <nav v-if="totalPages > 1 && !isLoading" class="mt-4 d-flex justify-content-between align-items-center border-top pt-4">
        <div class="text-muted small fw-medium">
          Trang <span class="text-dark">{{ currentPage }}</span> / {{ totalPages }}
        </div>
        <ul class="pagination custom-pagination mb-0">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link shadow-none" @click="changePage(currentPage - 1)">
              <i class="bi bi-chevron-left"></i>
            </button>
          </li>
          
          <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
            <button class="page-link shadow-none" @click="changePage(page)">{{ page }}</button>
          </li>

          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link shadow-none" @click="changePage(currentPage + 1)">
              <i class="bi bi-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated } from 'vue';
import { useToast } from 'vue-toastification';
import { adminProductService } from '@/services/productService'; 
import { API_BASE } from '@/config/api'
const toast = useToast();

// State
const products = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');

// Cấu hình
const WARNING_THRESHOLD = 10; 
const itemsPerPage = 5; // Số lượng hiển thị trên 1 trang
const currentPage = ref(1);

// ===============================================
// COMPUTED: LỌC & PHÂN TRANG (Client-side)
// ===============================================

// 1. Lấy toàn bộ danh sách cần cảnh báo
const allWarningItems = computed(() => {
  return products.value.filter(p => p.tonKho <= WARNING_THRESHOLD);
});

// Phục vụ hiển thị số lượng ở Summary Cards
const outOfStockItems = computed(() => allWarningItems.value.filter(p => p.tonKho === 0));
const lowStockItems = computed(() => allWarningItems.value.filter(p => p.tonKho > 0 && p.tonKho <= WARNING_THRESHOLD));

// 2. Tính toán tổng số trang
const totalPages = computed(() => {
  return Math.ceil(allWarningItems.value.length / itemsPerPage) || 1;
});

// 3. Lấy dữ liệu cho trang hiện tại
const paginatedWarningItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return allWarningItems.value.slice(start, end);
});

// ===============================================
// HELPER FUNCTIONS
// ===============================================
const getCategoryName = (product) => product.danhMuc || 'Chưa phân loại';

const getProductImage = (product) => {
  let path = product.anhSanPham || product.anhChinh || (product.danhSachAnh && product.danhSachAnh.length > 0 ? product.danhSachAnh[0] : null);
  if (!path) return null;
  if (path.startsWith('http') || path.startsWith('blob:')) return path;
  if (path.startsWith('/uploads/')) return `${API_BASE}${path}`;
  return `${API_BASE}/uploads/${path}`;
};

// ===============================================
// API CALLS & ACTIONS
// ===============================================

const fetchProducts = async () => {
  isLoading.value = true;
  try {
    // Ép lấy 1000 sản phẩm để tự lọc Tồn kho ở phía Client
    const data = await adminProductService.getProducts(
      1, 1000, searchQuery.value, '', ''
    );
    
    products.value = (data.content || []).map(p => ({
      ...p,
      addAmount: null,
      isUpdating: false
    }));

    // Reset về trang 1 nếu tổng trang hiện tại nhỏ hơn currentPage
    if (currentPage.value > totalPages.value) {
      currentPage.value = 1;
    }

  } catch (error) {
    console.error('Lỗi tải sản phẩm:', error);
    toast.error('Lỗi kết nối Server!');
  } finally {
    isLoading.value = false;
  }
};

// Xử lý tìm kiếm
const handleSearch = () => {
  currentPage.value = 1; // Tìm kiếm xong thì cho về trang 1
  fetchProducts();
};

// Xử lý chuyển trang
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Xử lý cập nhật kho
const addStock = async (item) => {
  const amount = parseInt(item.addAmount);
  
  if (!amount || amount <= 0) {
    toast.warning('Vui lòng nhập số lượng hợp lệ!');
    return;
  }

  item.isUpdating = true;

  try {
    toast.info('Đang lấy dữ liệu để bảo toàn ảnh...', { timeout: 1000 });
    
    // 1. Lấy Full data từ Server
    const fullItemData = await adminProductService.getProductById(item.id);
    const newStock = fullItemData.tonKho + amount; 
    
    // 2. LOGIC BẢO TOÀN ẢNH (Bắt chước trang Sửa Sản Phẩm)
    // Lấy danh sách ảnh hiện tại (từ danhSachAnh hoặc anhChinh)
    let oldImages = [];
    if (fullItemData.danhSachAnh && fullItemData.danhSachAnh.length > 0) {
      oldImages = fullItemData.danhSachAnh;
    } else if (fullItemData.anhChinh) {
      oldImages = [fullItemData.anhChinh];
    }

    // 3. Tạo payload chuẩn xác theo ý Backend
    const updatedProductData = {
      ...fullItemData,
      tonKho: newStock,
      danhSachAnhCu: oldImages,  // QUAN TRỌNG: Truyền ảnh cũ vào đây để BE giữ lại
      danhSachAnh: null,         // Ép null để BE không bị rối
      anhChinh: null,            // Ép null
      anhSanPham: null           // Ép null
    };
    
    // 4. Gửi lên Server
    await adminProductService.updateProduct(item.id, updatedProductData);
    
    // 5. Cập nhật UI
    item.tonKho = newStock;
    item.addAmount = null; 
    toast.success(`Đã cập nhật kho thành công, giữ nguyên ảnh gốc!`);

    setTimeout(() => {
      if (paginatedWarningItems.value.length === 0 && currentPage.value > 1) {
        currentPage.value--;
      }
    }, 100);

  } catch (error) {
    console.error('Lỗi khi nhập kho:', error);
    toast.error('Có lỗi xảy ra khi cập nhật kho!');
  } finally {
    item.isUpdating = false;
  }
};

// Lifecycle Hooks
onMounted(() => {
  fetchProducts();
});

// Chạy lại khi dùng keep-alive
onActivated(() => {
  fetchProducts();
});
</script>

<style scoped>
.font-general { font-family: 'Quicksand', sans-serif !important; }
.text-main-brown { color: #4A3018 !important; }
.text-vipep-green { color: #5b8e1d !important; }
.btn-vipep-green { background-color: #5b8e1d; border-color: #5b8e1d; }
.btn-vipep-green:hover { background-color: #4a7516; border-color: #4a7516; }

.form-control:focus {
  background-color: #fff !important;
  box-shadow: 0 0 0 3px rgba(91, 142, 29, 0.15) !important;
  border: 1px solid #5b8e1d !important;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Style cho phân trang */
.custom-pagination .page-link {
  color: #495057;
  border: 1px solid #dee2e6;
  margin: 0 3px;
  border-radius: 8px !important;
  transition: all 0.2s;
}
.custom-pagination .page-item.active .page-link {
  background-color: #5b8e1d;
  border-color: #5b8e1d;
  color: #fff;
}
.custom-pagination .page-link:hover {
  background-color: #e9ecef;
}
</style>