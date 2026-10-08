<template>
  <div class="font-general p-3 p-md-4">
    <nav aria-label="breadcrumb" class="mb-4">
      <ol class="breadcrumb mb-1 small">
        <li class="breadcrumb-item"><router-link to="/" class="text-muted text-decoration-none">Tổng quan</router-link></li>
        <li class="breadcrumb-item active fw-bold" aria-current="page">Quản lý Đánh giá</li>
      </ol>
      <h4 class="fw-bold mb-0 text-main-brown">Đánh giá & Bình luận</h4>
    </nav>

    <div v-if="!isViewingDetail" class="bg-white rounded-4 shadow-sm p-4 animate-fade-in">
      
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div class="d-flex flex-column flex-md-row gap-3 w-100">
          
          <div class="input-group w-auto flex-grow-1" style="max-width: 350px;">
            <span class="input-group-text bg-light border-0"><i class="bi bi-search"></i></span>
            <input 
              type="text" 
              class="form-control bg-light border-0 shadow-none" 
              placeholder="Tìm theo nội dung, người gửi..."
              v-model="searchQuery"
              @input="currentPage = 1"
            >
          </div>
          
          <select class="form-select bg-light border-0 shadow-none w-auto" v-model="filterType" @change="currentPage = 1">
            <option value="ALL">Tất cả loại</option>
            <option value="SAN_PHAM">Đánh giá Sản phẩm</option>
            <option value="TIN_TUC">Bình luận Tin tức</option>
          </select>

          <select class="form-select bg-light border-0 shadow-none w-auto" v-model="filterStatus" @change="currentPage = 1">
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PENDING">Chờ duyệt</option>
            <option value="APPROVED">Đã duyệt</option>
          </select>

          <select class="form-select bg-light border-0 shadow-none w-auto" v-model="filterStars" @change="currentPage = 1" :disabled="filterType === 'TIN_TUC'">
            <option value="ALL">Tất cả số sao</option>
            <option value="5">5 Sao</option>
            <option value="4">4 Sao</option>
            <option value="3">3 Sao</option>
            <option value="2">2 Sao</option>
            <option value="1">1 Sao</option>
          </select>
        </div>
      </div>

      <div v-if="selectedIds.length > 0" class="mb-3 p-3 bg-danger-subtle rounded-3 d-flex justify-content-between align-items-center animate-fade-in">
        <span class="fw-bold text-danger">Đã chọn {{ selectedIds.length }} mục</span>
        <button @click="deleteMultiple" class="btn btn-danger btn-sm px-3 fw-medium rounded-pill shadow-sm">
          <i class="bi bi-trash3-fill me-1"></i> Xóa các mục đã chọn
        </button>
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light text-muted small">
            <tr>
              <th scope="col" class="rounded-start" style="width: 40px; text-align: center;">
                <input 
                  class="form-check-input cursor-pointer" 
                  type="checkbox" 
                  :checked="isAllSelected" 
                  @change="toggleSelectAll"
                >
              </th>
              <th scope="col" class="fw-bold" style="width: 25%;">Nơi bình luận</th>
              <th scope="col" class="fw-bold">Khách hàng</th>
              <th scope="col" class="fw-bold text-center">Đánh giá</th>
              <th scope="col" class="fw-bold" style="width: 25%;">Nội dung</th>
              <th scope="col" class="fw-bold text-center">Trạng thái</th>
              <th scope="col" class="fw-bold text-end rounded-end">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedReviews.length === 0">
              <td colspan="7" class="text-center py-5 text-muted">
                <i class="bi bi-inbox fs-2 d-block mb-2"></i> Không tìm thấy dữ liệu phù hợp.
              </td>
            </tr>
            
            <tr v-for="review in paginatedReviews" :key="review.id" :class="{'table-active': selectedIds.includes(review.id)}">
              <td class="text-center">
                <input 
                  class="form-check-input cursor-pointer" 
                  type="checkbox" 
                  :value="review.id" 
                  v-model="selectedIds"
                >
              </td>
              <td>
                <span class="badge mb-1" :class="review.loai === 'SAN_PHAM' ? 'bg-primary' : 'bg-info text-dark'">
                  {{ review.loai === 'SAN_PHAM' ? 'Sản phẩm' : 'Tin tức' }}
                </span>
                <span class="fw-bold text-dark d-block text-truncate" style="max-width: 200px;" :title="review.tenMucTieu">
                  {{ review.tenMucTieu }}
                </span>
                <span class="small text-muted"><i class="bi bi-clock me-1"></i>{{ formatDate(review.ngayTao) }}</span>
              </td>
              <td>
                <span class="fw-medium text-main-brown">{{ review.hoTen }}</span>
              </td>
              <td class="text-center text-warning small">
                <span v-if="review.loai === 'SAN_PHAM'">
                  <i v-for="n in 5" :key="n" class="bi" :class="n <= review.diemDanhGia ? 'bi-star-fill' : 'bi-star'"></i>
                </span>
                <span v-else class="text-muted fst-italic">-</span>
              </td>
              <td>
                <span class="text-muted small d-inline-block text-truncate" style="max-width: 200px;" :title="review.noiDung">
                  {{ review.noiDung || '(Chỉ đánh giá, không có bình luận)' }}
                </span>
              </td>
              <td class="text-center">
                <span class="badge rounded-pill border" 
                      :class="review.daDuyet === 1 ? 'bg-success-subtle text-success border-success' : 'bg-warning-subtle text-warning border-warning'">
                  {{ review.daDuyet === 1 ? 'Đã duyệt' : 'Chờ duyệt' }}
                </span>
              </td>
              <td class="text-end">
                <button v-if="review.daDuyet === 0" @click="toggleApproval(review)" class="btn btn-sm btn-light me-1 text-success hover-shadow shadow-sm" title="Duyệt nhanh">
                  <i class="bi bi-check-lg"></i>
                </button>
                <button v-else @click="toggleApproval(review)" class="btn btn-sm btn-light me-1 text-secondary hover-shadow shadow-sm" title="Ẩn đánh giá">
                  <i class="bi bi-eye-slash"></i>
                </button>
                <button @click="viewDetail(review)" class="btn btn-sm btn-light me-1 text-primary hover-shadow shadow-sm" title="Xem chi tiết">
                  <i class="bi bi-info-circle"></i>
                </button>
                <button @click="deleteReview(review.id)" class="btn btn-sm btn-light text-danger hover-shadow shadow-sm" title="Xóa">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="totalPages > 1" class="d-flex justify-content-between align-items-center mt-4">
        <span class="small text-muted">Hiển thị {{ paginatedReviews.length }} trên tổng số {{ filteredReviews.length }} kết quả</span>
        <nav aria-label="Page navigation">
          <ul class="pagination pagination-sm mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link shadow-none" @click="currentPage--"><i class="bi bi-chevron-left"></i></button>
            </li>
            <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
              <button class="page-link shadow-none" @click="currentPage = page">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link shadow-none" @click="currentPage++"><i class="bi bi-chevron-right"></i></button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div v-else class="bg-white rounded-4 shadow-sm p-4 animate-slide-up">
      <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h5 class="fw-bold mb-0 text-main-brown">
          <i class="bi bi-chat-left-quote"></i> Chi tiết #{{ selectedReview.id }} 
          <span class="badge ms-2 fs-6 align-middle" :class="selectedReview.loai === 'SAN_PHAM' ? 'bg-primary' : 'bg-info text-dark'">
            {{ selectedReview.loai === 'SAN_PHAM' ? 'Đánh giá Sản phẩm' : 'Bình luận Tin tức' }}
          </span>
        </h5>
        <button @click="isViewingDetail = false" class="btn btn-sm btn-outline-secondary rounded-pill px-3">
          <i class="bi bi-arrow-left me-1"></i> Quay lại
        </button>
      </div>

      <div class="row g-4">
        <div class="col-lg-8">
          <div class="bg-light p-4 rounded-3 border mb-4">
            <div class="d-flex justify-content-between mb-3">
              <div>
                <h6 class="fw-bold mb-1">Nội dung chi tiết:</h6>
                <div v-if="selectedReview.loai === 'SAN_PHAM'" class="text-warning mb-2 fs-5">
                  <i v-for="n in 5" :key="n" class="bi" :class="n <= selectedReview.diemDanhGia ? 'bi-star-fill' : 'bi-star'"></i>
                </div>
              </div>
              <span class="badge rounded-pill border align-self-start py-2 px-3" 
                    :class="selectedReview.daDuyet === 1 ? 'bg-success-subtle text-success border-success' : 'bg-warning-subtle text-warning border-warning'">
                {{ selectedReview.daDuyet === 1 ? 'Trạng thái: Đã duyệt' : 'Trạng thái: Chờ duyệt' }}
              </span>
            </div>
            <p class="mb-0 text-dark fs-6" style="line-height: 1.6;">
              "{{ selectedReview.noiDung || '(Không có nội dung)' }}"
            </p>

            <div v-if="selectedReview.hinhAnh" class="mt-4 pt-3 border-top">
              <h6 class="fw-bold mb-3 text-muted small"><i class="bi bi-images me-1"></i> File đính kèm từ khách:</h6>
              <div class="d-flex flex-wrap gap-3">
                <template v-for="(media, index) in getMediaList(selectedReview.hinhAnh)" :key="index">
                  
                  <video v-if="isVideo(media)" 
                         :src="getMediaUrl(media)" 
                         controls 
                         class="rounded-3 border shadow-sm bg-black"
                         style="width: 150px; height: 150px; object-fit: cover;">
                  </video>

                  <img v-else 
                       :src="getMediaUrl(media)" 
                       class="rounded-3 border shadow-sm cursor-pointer hover-zoom"
                       style="width: 150px; height: 150px; object-fit: cover;"
                       @click="openMedia(getMediaUrl(media))"
                       title="Nhấn để xem ảnh gốc" />
                       
                </template>
              </div>
            </div>
          </div>

          <div class="d-flex gap-2 mt-4">
            <button v-if="selectedReview.daDuyet === 0" @click="toggleApprovalDetail(1)" class="btn btn-vipep-green text-white flex-grow-1 py-2 fw-medium shadow-sm">
              <i class="bi bi-check-circle me-1"></i> Phê duyệt và Hiển thị
            </button>
            <button v-else @click="toggleApprovalDetail(0)" class="btn btn-secondary flex-grow-1 py-2 fw-medium shadow-sm">
              <i class="bi bi-eye-slash me-1"></i> Ẩn nội dung này
            </button>
            <button @click="deleteReviewDetail(selectedReview.id)" class="btn btn-outline-danger py-2 fw-medium shadow-sm px-4">
              <i class="bi bi-trash me-1"></i> Xóa
            </button>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="border rounded-3 p-3 mb-3">
            <label class="fw-bold small text-muted d-block mb-2 border-bottom pb-2">Người gửi</label>
            <div class="d-flex align-items-center gap-3">
              <div class="bg-secondary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center text-main-brown fw-bold fs-5" style="width: 45px; height: 45px;">
                {{ selectedReview.hoTen.charAt(0) }}
              </div>
              <div>
                <div class="fw-bold text-dark">{{ selectedReview.hoTen }}</div>
              </div>
            </div>
          </div>

          <div class="border rounded-3 p-3">
            <label class="fw-bold small text-muted d-block mb-2 border-bottom pb-2">
              Nơi bình luận ({{ selectedReview.loai === 'SAN_PHAM' ? 'Sản phẩm' : 'Bài viết' }})
            </label>
            <div class="fw-medium text-vipep-green mb-1">{{ selectedReview.tenMucTieu }}</div>
            <div class="small text-muted mt-2 border-top pt-2">
              <i class="bi bi-clock me-1"></i> Gửi lúc: {{ formatDate(selectedReview.ngayTao) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useToast } from "vue-toastification";
import axios from 'axios';
const toast = useToast();
import { API_BASE } from '@/config/api'


// State quản lý giao diện
const isViewingDetail = ref(false);
const selectedReview = ref({});

// State bộ lọc
const searchQuery = ref('');
const filterType = ref('ALL');
const filterStatus = ref('ALL');
const filterStars = ref('ALL');

// Dữ liệu
const reviewList = ref([]);
const currentPage = ref(1);
const itemsPerPage = 8;

// STATE QUẢN LÝ XÓA NHIỀU
const selectedIds = ref([]);

// Format ngày tháng
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', { 
    day: '2-digit', month: '2-digit', year: 'numeric', 
    hour: '2-digit', minute: '2-digit' 
  });
};

// Computed logic lọc dữ liệu
const filteredReviews = computed(() => {
  let result = reviewList.value;

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter(r => 
      (r.tenMucTieu?.toLowerCase().includes(query)) ||
      (r.hoTen?.toLowerCase().includes(query)) ||
      (r.noiDung?.toLowerCase().includes(query))
    );
  }

  if (filterType.value !== 'ALL') {
    result = result.filter(r => r.loai === filterType.value);
  }

  if (filterStatus.value !== 'ALL') {
    const isApproved = filterStatus.value === 'APPROVED' ? 1 : 0;
    result = result.filter(r => r.daDuyet === isApproved);
  }

  if (filterStars.value !== 'ALL' && filterType.value !== 'TIN_TUC') {
    result = result.filter(r => r.loai === 'SAN_PHAM' && r.diemDanhGia === parseInt(filterStars.value));
  }

  return result;
});

// Phân trang
const totalPages = computed(() => Math.ceil(filteredReviews.value.length / itemsPerPage));
const paginatedReviews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredReviews.value.slice(start, end);
});

// KIỂM TRA CHỌN TẤT CẢ
const isAllSelected = computed(() => {
  return paginatedReviews.value.length > 0 && selectedIds.value.length === paginatedReviews.value.length;
});

// RESET DANH SÁCH CHỌN KHI CHUYỂN TRANG
watch(currentPage, () => {
  selectedIds.value = [];
});

// CHỌN / BỎ CHỌN TẤT CẢ TRÊN TRANG HIỆN TẠI
const toggleSelectAll = (event) => {
  if (event.target.checked) {
    selectedIds.value = paginatedReviews.value.map(review => review.id);
  } else {
    selectedIds.value = [];
  }
};

// Fetch dữ liệu từ API
const fetchReviews = async () => {
  try {
    const token = sessionStorage.getItem('admin_token'); 
   const response = await axios.get(`${API_BASE}/api/admin/reviews`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    reviewList.value = response.data.map(item => ({
      id: item.id,
      loai: item.loai,
      tenMucTieu: item.tenBaiViet || (item.baiVietId ? `Bài viết #${item.baiVietId}` : 'N/A'),
      hoTen: item.hoTen || 'Khách hàng', 
      diemDanhGia: item.diemDanhGia,
      noiDung: item.noiDung,
      daDuyet: item.daDuyet ? 1 : 0,
      ngayTao: item.ngayTao,
      hinhAnh: item.hinhAnh // <-- THÊM DÒNG NÀY ĐỂ NHẬN CHUỖI ẢNH TỪ BACKEND
    }));

  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error("Phiên đăng nhập hết hạn!");
    } else {
      toast.error("Lỗi khi tải dữ liệu!");
    }
  }
};

const viewDetail = (review) => {
  selectedReview.value = { ...review };
  isViewingDetail.value = true;
};

const toggleApproval = async (review) => {
  const newStatus = review.daDuyet === 1 ? 0 : 1;
  try {
    const token = sessionStorage.getItem('admin_token');
    await axios.put(`${API_BASE}/api/admin/reviews/${review.id}/status`, null, {
      params: { status: newStatus },
      headers: { Authorization: `Bearer ${token}` }
    });
    
    review.daDuyet = newStatus;
    toast.success(newStatus === 1 ? 'Đã duyệt hiển thị!' : 'Đã ẩn nội dung!');
  } catch (error) {
    toast.error('Lỗi khi cập nhật trạng thái!');
  }
};

const toggleApprovalDetail = async (status) => {
  try {
    const token = sessionStorage.getItem('admin_token');
    await axios.put(`${API_BASE}/api/admin/reviews/${selectedReview.value.id}/status`, null, {
      params: { status: status },
      headers: { Authorization: `Bearer ${token}` }
    });
    
    selectedReview.value.daDuyet = status;
    const index = reviewList.value.findIndex(r => r.id === selectedReview.value.id);
    if (index !== -1) reviewList.value[index].daDuyet = status;

    toast.success(status === 1 ? 'Đã phê duyệt hiển thị!' : 'Đã ẩn nội dung!');
    isViewingDetail.value = false;
  } catch (error) {
    toast.error('Lỗi cập nhật!');
  }
};

// XÓA 1 MỤC
const deleteReview = async (id) => {
  if (!confirm('Bạn có chắc chắn muốn xóa vĩnh viễn nội dung này?')) return;
  try {
    const token = sessionStorage.getItem('admin_token'); 
    await axios.delete(`${API_BASE}/api/admin/reviews/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    reviewList.value = reviewList.value.filter(r => r.id !== id);
    toast.success('Đã xóa thành công khỏi hệ thống!');
  } catch (error) {
    toast.error('Xóa thất bại! Vui lòng kiểm tra quyền hạn.');
  }
};

const deleteReviewDetail = async (id) => {
  await deleteReview(id);
  isViewingDetail.value = false;
};

// XÓA NHIỀU MỤC CÙNG LÚC
const deleteMultiple = async () => {
  if (!confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn ${selectedIds.value.length} đánh giá đã chọn?`)) return;
  
  try {
    const token = sessionStorage.getItem('admin_token'); 
    
    // Cách này sẽ gọi nhiều API xóa liên tiếp (Phù hợp nếu Backend chưa có API xóa mảng ID)
    await Promise.all(selectedIds.value.map(id => 
      axios.delete(`${API_BASE}/api/admin/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ));

    // Cập nhật lại UI sau khi xóa thành công
    reviewList.value = reviewList.value.filter(r => !selectedIds.value.includes(r.id));
    selectedIds.value = [];
    
    toast.success('Đã xóa thành công các mục đã chọn!');
    
    // Chuyển về trang trước nếu trang hiện tại đã trống
    if (paginatedReviews.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }
  } catch (error) {
    console.error("Lỗi xóa nhiều:", error);
    toast.error('Xóa thất bại! Vui lòng thử lại.');
  }
};

onMounted(() => {
  fetchReviews();
});


const getMediaList = (hinhAnhStr) => {
  if (!hinhAnhStr) return [];
  return hinhAnhStr.split(',').filter(item => item.trim() !== '');
};

const getMediaUrl = (path) => {
  if (!path) return '';
  // Nếu path đã có sẵn http (link ngoài) thì giữ nguyên, nếu không thì nối với domain backend
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path}`;
};

const isVideo = (path) => {
  if (!path) return false;
  const ext = path.split('.').pop().toLowerCase();
  return ['mp4', 'webm', 'ogg', 'mov'].includes(ext);
};

const openMedia = (url) => {
  window.open(url, '_blank'); // Mở ảnh lớn sang tab mới
};
</script>

<style scoped>
.font-general { font-family: 'Quicksand', sans-serif !important; }
.text-main-brown { color: #4A3018 !important; }
.text-vipep-green { color: #5b8e1d !important; }
.btn-vipep-green { background-color: #5b8e1d; border-color: #5b8e1d; }
.btn-vipep-green:hover { background-color: #4a7516; }

/* CSS Phân trang */
.pagination .page-link { 
  color: #4A3018; 
  border: none; 
  margin: 0 3px; 
  border-radius: 8px !important; 
  cursor: pointer;
}
.pagination .active .page-link { background-color: #5b8e1d; color: white; }

/* Hiệu ứng hover & animation */
.hover-shadow:hover { 
  transform: translateY(-2px); 
  box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; 
  transition: 0.3s; 
}
.animate-fade-in { animation: fadeIn 0.4s ease; }
.animate-slide-up { animation: slideUp 0.4s ease; }

@keyframes fadeIn { 
  from { opacity: 0; } 
  to { opacity: 1; } 
}
@keyframes slideUp { 
  from { opacity: 0; transform: translateY(20px); } 
  to { opacity: 1; transform: translateY(0); } 
}

/* Các class mới thêm cho checkbox */
.cursor-pointer { cursor: pointer; }
.table-active { background-color: #f8f9fa !important; }

/* Thêm CSS cho ảnh đính kèm */
.hover-zoom { transition: transform 0.2s ease-in-out; }
.hover-zoom:hover { transform: scale(1.05); }
</style>