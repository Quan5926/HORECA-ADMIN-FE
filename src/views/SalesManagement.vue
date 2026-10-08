<template>
  <div class="page">

    <!-- HEADER -->
    <div class="header-card">
      <div class="header-top">
        <div class="header-info">
          <div class="header-eyebrow">
            <span class="eyebrow-dot"></span>
            <span>Flash Sale System</span>
          </div>
          <h1 class="header-title">Phiếu Giảm Giá</h1>
          <p class="header-sub">Quản lý Flash Sale giảm giá theo % gắn với sản phẩm cụ thể</p>
        </div>
        <div class="header-actions">
          <div class="search-box">
            <i class="bi bi-search"></i>
            <input v-model="searchQuery" type="text" placeholder="Tìm theo sản phẩm ID hoặc trạng thái...">
          </div>
          <button class="btn-primary" @click="openForm()">
            <i class="bi bi-plus-lg"></i>
            <span>Tạo flash sale</span>
          </button>
        </div>
      </div>

      <div class="stats-row">
        <div class="stat-card" v-for="s in stats" :key="s.label">
          <div class="stat-icon-wrap" :class="s.iconBg">
            <i :class="'bi ' + s.icon"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ s.value }}</div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
        </div>
      </div>

      <div class="filter-row">
        <button
          v-for="tab in filterTabs" :key="tab.value"
          :class="['filter-chip', activeFilter === tab.value ? 'filter-chip--active' : '']"
          @click="activeFilter = tab.value"
        >
          <span class="chip-dot" :class="tab.dot"></span>
          {{ tab.label }}
          <span class="chip-count">{{ getTabCount(tab.value) }}</span>
        </button>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="state-box">
      <div class="loader-ring"><div></div><div></div><div></div><div></div></div>
      <span>Đang tải dữ liệu...</span>
    </div>

    <!-- ERROR -->
    <div v-else-if="error" class="alert-error">
      <i class="bi bi-exclamation-triangle-fill"></i>
      <span>{{ error }}</span>
    </div>

    <!-- GRID -->
    <div v-else class="voucher-grid">
      <div
        v-for="(item, i) in filteredList" :key="item.id"
        class="voucher-card card--purple"
        :class="item.trangThaiHienThi === 'Đã kết thúc' ? 'card--expired' : ''"
        :style="`--delay:${i * 50}ms`"
      >
        <div class="card-accent"></div>

        <div class="card-header">
          <div class="card-type-badge">
            <i class="bi bi-lightning-charge-fill"></i>
            <span>Flash Sale</span>
          </div>
          <span :class="['status-pill', getStatusClass(item.trangThaiHienThi)]">
            <span class="status-dot"></span>
            {{ item.trangThaiHienThi }}
          </span>
        </div>

        <div class="card-discount">-{{ item.phanTramGiamGia }}%</div>

        <!-- Hiện tên sản phẩm nếu có, fallback về ID -->
        <p class="card-desc">
          <strong>{{ item.tenSanPham || ('Sản phẩm ID: ' + item.chiTietSanPhamId) }}</strong>
          <span v-if="item.tenBienThe" class="card-variant-badge">{{ item.tenBienThe }}</span>
        </p>

        <div class="meta-grid">
          <div class="meta-item">
            <span class="meta-key"><i class="bi bi-calendar-check"></i> Bắt đầu</span>
            <span class="meta-val">{{ formatDateVi(item.ngayBatDau) }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-key"><i class="bi bi-calendar-x"></i> Kết thúc</span>
            <span class="meta-val">{{ formatDateVi(item.ngayKetThuc) }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-key"><i class="bi bi-box-seam"></i> Chi tiết SP ID</span>
            <span class="meta-val highlight">{{ item.chiTietSanPhamId }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-key"><i class="bi bi-clock-history"></i> Tạo lúc</span>
            <span class="meta-val">{{ formatDateVi(item.ngayTao) }}</span>
          </div>
        </div>

        <div class="card-footer">
          <button class="btn-edit" @click="openForm(item)">
            <i class="bi bi-pencil-fill"></i> Cập nhật
          </button>
          <button
            class="btn-toggle"
            :class="item.trangThai ? 'btn-toggle--pause' : 'btn-toggle--play'"
            @click="toggleFlash(item)"
            :title="item.trangThai ? 'Tắt flash sale' : 'Kích hoạt'"
          >
            <i :class="'bi ' + (item.trangThai ? 'bi-pause-fill' : 'bi-play-fill')"></i>
          </button>
          <button class="btn-delete" @click="deleteFlash(item.id)" title="Xóa">
            <i class="bi bi-trash3-fill"></i>
          </button>
        </div>

        <div v-if="item.trangThaiHienThi === 'Đã kết thúc'" class="expired-overlay">
          <span>KẾT THÚC</span>
        </div>
      </div>

      <div v-if="filteredList.length === 0" class="empty-state">
        <div class="empty-icon-wrap"><i class="bi bi-lightning-charge"></i></div>
        <h5>Chưa có flash sale nào</h5>
        <p>Tạo đợt giảm giá theo % để kích cầu sản phẩm!</p>
        <button class="btn-primary" @click="openForm()">
          <i class="bi bi-plus-lg"></i><span>Tạo flash sale</span>
        </button>
      </div>
    </div>

    <!-- MODAL -->
    <Transition name="modal-fade">
      <div v-if="isFormOpen" class="modal-overlay" @click.self="closeForm">
        <Transition name="modal-slide">
          <div v-if="isFormOpen" class="modal-panel custom-scrollbar">

            <div class="modal-header">
              <div class="modal-header-left">
                <div class="modal-icon modal-icon--purple">
                  <i class="bi bi-lightning-charge-fill"></i>
                </div>
                <div>
                  <p class="modal-label">HORECA ONE · FLASH SALE</p>
                  <h5 class="modal-title">{{ editingId ? 'Cập nhật flash sale' : 'Tạo flash sale mới' }}</h5>
                </div>
              </div>
              <button class="modal-close-btn" @click="closeForm">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <form @submit.prevent="saveFlash" class="modal-body">

              <!-- SECTION 01: Chọn sản phẩm -->
              <div class="form-section">
                <div class="section-header">
                  <span class="section-num">01</span>
                  <span class="section-title">Chọn sản phẩm áp dụng</span>
                </div>
                <div class="form-grid">

                  <!-- Search box -->
                  <div class="field field--12 product-search-wrap">
                    <label class="field-label">Tìm sản phẩm <span class="req">*</span></label>
                    <div class="search-input-wrap">
                      <i class="bi bi-search search-icon-inner"></i>
                      <input
                        type="text"
                        v-model="productSearch"
                        @input="onProductSearchInput"
                        @focus="showProductDropdown = true"
                        class="field-input search-input-padded"
                        placeholder="Gõ tên sản phẩm để tìm kiếm..."
                        autocomplete="off"
                      >
                      <div v-if="productLoading" class="search-spinner"></div>
                      <button
                        v-if="selectedProduct && !productLoading"
                        type="button"
                        class="search-clear-btn"
                        @click="clearProductSelection"
                        title="Xóa lựa chọn"
                      >
                        <i class="bi bi-x-lg"></i>
                      </button>
                    </div>

                    <!-- Dropdown -->
                    <Transition name="dropdown-fade">
                      <div
                        v-if="showProductDropdown && (productList.length > 0 || productLoading)"
                        class="product-dropdown"
                      >
                        <div v-if="productLoading" class="dropdown-loading">
                          <div class="dropdown-spinner"></div>
                          <span>Đang tìm kiếm...</span>
                        </div>
                        <template v-else>
                          <div
                            v-for="p in productList"
                            :key="p.id"
                            class="dropdown-item"
                            @mousedown.prevent="selectProduct(p)"
                          >
                            <div class="dropdown-item-img">
                              <img
                                v-if="getProductThumb(p)"
                                :src="getProductThumb(p)"
                                :alt="p.tenSanPham"
                              >
                              <i v-else class="bi bi-box-seam"></i>
                            </div>
                            <div class="dropdown-item-info">
                              <div class="dropdown-item-name">{{ p.tenSanPham }}</div>
                              <div class="dropdown-item-meta">
                                ID: {{ p.id }}
                                <span v-if="p.chiTietSanPhams?.length" class="dropdown-item-variants">
                                  · {{ p.chiTietSanPhams.length }} biến thể
                                </span>
                              </div>
                            </div>
                            <i class="bi bi-chevron-right dropdown-item-arrow"></i>
                          </div>
                        </template>
                      </div>
                    </Transition>
                  </div>

                  <!-- Đã chọn sản phẩm: hiển thị preview -->
                  <Transition name="section-fade">
                    <div v-if="selectedProduct" class="field field--12">
                      <div class="selected-product-card">
                        <div class="selected-product-img">
                          <img
                            v-if="getProductThumb(selectedProduct)"
                            :src="getProductThumb(selectedProduct)"
                            :alt="selectedProduct.tenSanPham"
                          >
                          <i v-else class="bi bi-box-seam"></i>
                        </div>
                        <div class="selected-product-info">
                          <div class="selected-product-name">{{ selectedProduct.tenSanPham }}</div>
                          <div class="selected-product-id">ID sản phẩm: {{ selectedProduct.id }}</div>
                        </div>
                        <div class="selected-product-check">
                          <i class="bi bi-check-circle-fill"></i>
                        </div>
                      </div>
                    </div>
                  </Transition>

                  <!-- Chọn biến thể -->
                  <Transition name="section-fade">
                    <div
                      v-if="selectedProduct && variantList.length > 0"
                      class="field field--12"
                    >
                      <label class="field-label">
                        Chọn biến thể (size / màu)
                        <span class="req">*</span>
                      </label>

                      <div v-if="variantLoading" class="variant-loading">
                        <div class="dropdown-spinner"></div>
                        <span>Đang tải biến thể...</span>
                      </div>

                      <div v-else class="variant-grid">
                        <button
                          v-for="ct in variantList"
                          :key="ct.id"
                          type="button"
                          :class="['variant-chip', selectedChiTiet?.id === ct.id ? 'variant-chip--active' : '']"
                          @click="selectVariant(ct)"
                        >
                          <span
                            v-if="ct.mauSacHex"
                            class="variant-color-dot"
                            :style="{ background: ct.mauSacHex }"
                          ></span>
                          <span class="variant-chip-label">
                            {{ [ct.mauSac, ct.kichThuoc].filter(Boolean).join(' · ') || 'Mặc định' }}
                          </span>
                          <span class="variant-chip-id">ID: {{ ct.id }}</span>
                        </button>
                      </div>

                      <!-- Preview biến thể đã chọn -->
                      <Transition name="section-fade">
                        <div v-if="selectedChiTiet" class="variant-preview">
                          <i class="bi bi-check-circle-fill"></i>
                          <div class="variant-preview-info">
                            <span class="variant-preview-name">
                              {{ [selectedChiTiet.mauSac, selectedChiTiet.kichThuoc].filter(Boolean).join(' · ') || 'Mặc định' }}
                            </span>
                            <span class="variant-preview-detail">
                              Giá: <strong>{{ selectedChiTiet.giaBan?.toLocaleString('vi-VN') }}₫</strong>
                              &nbsp;·&nbsp;
                              Tồn kho: <strong>{{ selectedChiTiet.tonKho }}</strong>
                              &nbsp;·&nbsp;
                              Chi tiết ID: <strong>{{ selectedChiTiet.id }}</strong>
                            </span>
                          </div>
                        </div>
                      </Transition>
                    </div>
                  </Transition>

                  <!-- Trường hợp edit: hiển thị ID cũ nếu chưa chọn lại -->
                  <div v-if="editingId && !selectedProduct" class="field field--12">
                    <div class="edit-id-note">
                      <i class="bi bi-info-circle-fill"></i>
                      <span>Đang giữ Chi tiết SP ID: <strong>{{ formData.chiTietSanPhamId }}</strong>. Tìm sản phẩm ở trên để thay đổi.</span>
                    </div>
                  </div>

                </div>
              </div>

              <!-- SECTION 02: Phần trăm giảm giá -->
              <div class="form-section">
                <div class="section-header">
                  <span class="section-num">02</span>
                  <span class="section-title">Mức giảm giá</span>
                </div>
                <div class="form-grid">
                  <div class="field field--12">
                    <label class="field-label">Phần trăm giảm giá (%) <span class="req">*</span></label>
                    <div class="input-suffix">
                      <input
                        type="number"
                        v-model="formData.phanTramGiamGia"
                        class="field-input"
                        required
                        min="1"
                        max="100"
                        placeholder="VD: 20"
                      >
                      <span class="suffix-label">%</span>
                    </div>

                    <!-- Preview giá sau giảm -->
                    <Transition name="section-fade">
                      <div
                        v-if="selectedChiTiet && formData.phanTramGiamGia > 0"
                        class="price-preview"
                      >
                        <span class="price-preview-old">
                          {{ selectedChiTiet.giaBan?.toLocaleString('vi-VN') }}₫
                        </span>
                        <i class="bi bi-arrow-right"></i>
                        <span class="price-preview-new">
                          {{ Math.round(selectedChiTiet.giaBan * (1 - formData.phanTramGiamGia / 100)).toLocaleString('vi-VN') }}₫
                        </span>
                        <span class="price-preview-badge">-{{ formData.phanTramGiamGia }}%</span>
                      </div>
                    </Transition>
                  </div>
                </div>
              </div>

              <!-- SECTION 03: Thời gian -->
              <div class="form-section">
                <div class="section-header">
                  <span class="section-num">03</span>
                  <span class="section-title">Thời gian hiệu lực</span>
                </div>
                <div class="form-grid">
                  <div class="field field--6">
                    <label class="field-label">Ngày bắt đầu <span class="req">*</span></label>
                    <input type="datetime-local" v-model="formData.ngayBatDau" class="field-input" required>
                  </div>
                  <div class="field field--6">
                    <label class="field-label">Ngày kết thúc <span class="req">*</span></label>
                    <input type="datetime-local" v-model="formData.ngayKetThuc" class="field-input" required>
                  </div>
                </div>
              </div>

              <!-- SECTION 04: Trạng thái -->
              <div class="form-section">
                <div class="section-header">
                  <span class="section-num">04</span>
                  <span class="section-title">Trạng thái</span>
                </div>
                <div class="toggle-row" @click="formData.trangThai = !formData.trangThai">
                  <div class="toggle-switch-wrap" @click.stop>
                    <input class="toggle-switch-input" type="checkbox" v-model="formData.trangThai" id="toggle-flash">
                    <label class="toggle-switch toggle-switch--purple" for="toggle-flash"></label>
                  </div>
                  <div class="toggle-info">
                    <p class="toggle-name">Kích hoạt ngay</p>
                    <p class="toggle-desc">Flash sale sẽ chạy đúng thời gian đã chọn</p>
                  </div>
                </div>
              </div>

              <div v-if="formError" class="form-error">
                <i class="bi bi-exclamation-circle-fill"></i> {{ formError }}
              </div>

              <div class="modal-actions">
                <button type="button" class="btn-cancel" @click="closeForm">Hủy bỏ</button>
                <button type="submit" class="btn-submit btn-submit--purple" :disabled="saving">
                  <span v-if="saving" class="spinner"></span>
                  <i v-else class="bi bi-send-fill"></i>
                  {{ editingId ? 'Lưu thay đổi' : 'Tạo flash sale' }}
                </button>
              </div>
            </form>
          </div>
        </Transition>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { API_BASE } from '@/config/api';

const api = axios.create({ baseURL: `${API_BASE}/api` });
api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
const BASE = '/khuyen-mai-flash';

// ── List state ──
const flashList    = ref([]);
const loading      = ref(false);
const error        = ref('');
const searchQuery  = ref('');
const activeFilter = ref('all');

// ── Form state ──
const isFormOpen = ref(false);
const editingId  = ref(null);
const saving     = ref(false);
const formError  = ref('');

const defaultForm = () => ({
  chiTietSanPhamId: '',
  phanTramGiamGia:  '',
  ngayBatDau:       '',
  ngayKetThuc:      '',
  trangThai:        true,
  nguoiTao:         1,
  nguoiSua:         1,
});
const formData = ref(defaultForm());

// ── Product search state ──
const productSearch       = ref('');
const productList         = ref([]);
const productLoading      = ref(false);
const showProductDropdown = ref(false);
const selectedProduct     = ref(null);
const variantList         = ref([]);
const variantLoading      = ref(false);
const selectedChiTiet     = ref(null);
let searchDebounce        = null;

// ── Fetch flash list ──
const fetchAll = async () => {
  loading.value = true; error.value = '';
  try {
    const { data } = await api.get(BASE);
    // Enrich với tên sản phẩm nếu có thể
    flashList.value = data;
  } catch {
    error.value = 'Không thể tải danh sách flash sale. Vui lòng thử lại.';
  } finally {
    loading.value = false;
  }
};
onMounted(fetchAll);

// ── Product search ──
const onProductSearchInput = () => {
  clearTimeout(searchDebounce);
  showProductDropdown.value = true;
  if (!productSearch.value.trim()) {
    productList.value = [];
    return;
  }
  searchDebounce = setTimeout(searchProducts, 350);
};

const searchProducts = async () => {
  productLoading.value = true;
  try {
    const { data } = await api.get('/products/search', {
      params: { keyword: productSearch.value.trim(), size: 10 }
    });
    productList.value = data?.content || data?.data || data || [];
  } catch {
    productList.value = [];
  } finally {
    productLoading.value = false;
  }
};

const getProductThumb = (product) => {
  const raw = product?.anhDaiDien || product?.anhSanPham || product?.hinhAnh || product?.anh || '';
  if (!raw) return '';
  const first = raw.split('|||')[0].split(',')[0].trim().replace(/^["'\[]+|["'\]]+$/g, '');
  if (!first) return '';
  if (first.startsWith('http') || first.startsWith('data:')) return first;
  if (first.startsWith('/')) return `${API_BASE}${first}`;
  return `${API_BASE}/uploads/${first}`;
};

const selectProduct = async (product) => {
  selectedProduct.value = product;
  productSearch.value   = product.tenSanPham;
  showProductDropdown.value = false;
  selectedChiTiet.value = null;
  formData.value.chiTietSanPhamId = '';
  variantList.value = [];

  // Load chi tiết variants
  variantLoading.value = true;
  try {
    const { data } = await api.get(`/products/${product.id}`);
    selectedProduct.value = data;
    variantList.value = (data.chiTietSanPhams || []).filter(ct => ct.trangThai !== false);
    // Nếu chỉ có 1 biến thể, tự động chọn
    if (variantList.value.length === 1) {
      selectVariant(variantList.value[0]);
    }
  } catch {
    variantList.value = product.chiTietSanPhams?.filter(ct => ct.trangThai !== false) || [];
  } finally {
    variantLoading.value = false;
  }
};

const selectVariant = (ct) => {
  selectedChiTiet.value = ct;
  formData.value.chiTietSanPhamId = ct.id;
};

const clearProductSelection = () => {
  selectedProduct.value = null;
  selectedChiTiet.value = null;
  productSearch.value   = '';
  productList.value     = [];
  variantList.value     = [];
  formData.value.chiTietSanPhamId = '';
};

// ── Click outside để đóng dropdown ──
const handleClickOutside = (e) => {
  if (!e.target.closest('.product-search-wrap')) {
    showProductDropdown.value = false;
  }
};
onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));

// ── Save ──
const saveFlash = async () => {
  if (!formData.value.chiTietSanPhamId) {
    formError.value = 'Vui lòng chọn sản phẩm và biến thể.';
    return;
  }
  saving.value = true; formError.value = '';
  try {
    const payload = {
      ...formData.value,
      phanTramGiamGia:  Number(formData.value.phanTramGiamGia),
      chiTietSanPhamId: Number(formData.value.chiTietSanPhamId),
      ngayBatDau:  formData.value.ngayBatDau  ? formData.value.ngayBatDau.slice(0, 19)  : null,
      ngayKetThuc: formData.value.ngayKetThuc ? formData.value.ngayKetThuc.slice(0, 19) : null,
    };
    if (editingId.value) await api.put(`${BASE}/${editingId.value}`, payload);
    else await api.post(BASE, payload);
    await fetchAll();
    closeForm();
  } catch (e) {
    formError.value = e.response?.data?.message || e.response?.data || 'Có lỗi xảy ra, vui lòng thử lại.';
  } finally {
    saving.value = false;
  }
};

// ── Toggle / Delete ──
const toggleFlash = async (item) => {
  try { await api.patch(`${BASE}/${item.id}/toggle?nguoiSua=1`); await fetchAll(); }
  catch { alert('Không thể thay đổi trạng thái. Vui lòng thử lại.'); }
};

const deleteFlash = async (id) => {
  if (!confirm('Xóa flash sale này? Hành động không thể hoàn tác.')) return;
  try { await api.delete(`${BASE}/${id}`); flashList.value = flashList.value.filter(f => f.id !== id); }
  catch { alert('Không thể xóa. Vui lòng thử lại.'); }
};

// ── Open / Close form ──
const openForm = (item = null) => {
  formError.value = '';
  clearProductSelection();

  if (item) {
    editingId.value = item.id;
    formData.value = {
      chiTietSanPhamId: item.chiTietSanPhamId,
      phanTramGiamGia:  item.phanTramGiamGia,
      ngayBatDau:       item.ngayBatDau  ? item.ngayBatDau.slice(0, 16)  : '',
      ngayKetThuc:      item.ngayKetThuc ? item.ngayKetThuc.slice(0, 16) : '',
      trangThai:        item.trangThai,
      nguoiTao: 1, nguoiSua: 1,
    };
  } else {
    editingId.value = null;
    formData.value  = defaultForm();
  }
  isFormOpen.value = true;
};

const closeForm = () => {
  isFormOpen.value = false;
  clearProductSelection();
};

// ── Filters ──
const filterTabs = [
  { value: 'all',           label: 'Tất cả',       dot: '' },
  { value: 'Đang diễn ra', label: 'Đang diễn ra', dot: 'dot--purple' },
  { value: 'Sắp tới',      label: 'Sắp tới',      dot: 'dot--blue' },
  { value: 'Đã kết thúc',  label: 'Đã kết thúc',  dot: 'dot--gray' },
];

const getTabCount = (val) => val === 'all'
  ? flashList.value.length
  : flashList.value.filter(f => f.trangThaiHienThi === val).length;

const filteredList = computed(() =>
  flashList.value.filter(f => {
    const q = searchQuery.value.toLowerCase();
    const matchSearch = String(f.chiTietSanPhamId).includes(q)
      || (f.trangThaiHienThi || '').toLowerCase().includes(q)
      || (f.tenSanPham || '').toLowerCase().includes(q);
    const matchFilter = activeFilter.value === 'all' || f.trangThaiHienThi === activeFilter.value;
    return matchSearch && matchFilter;
  })
);

const stats = computed(() => [
  { label: 'Tổng flash sale', value: flashList.value.length,                                                   icon: 'bi-lightning-charge-fill', iconBg: 'icon--purple' },
  { label: 'Đang diễn ra',   value: flashList.value.filter(f => f.trangThaiHienThi === 'Đang diễn ra').length, icon: 'bi-broadcast-pin',         iconBg: 'icon--green'  },
  { label: 'Sắp tới',        value: flashList.value.filter(f => f.trangThaiHienThi === 'Sắp tới').length,      icon: 'bi-clock-history',         iconBg: 'icon--blue'   },
  { label: 'Đã kết thúc',    value: flashList.value.filter(f => f.trangThaiHienThi === 'Đã kết thúc').length,  icon: 'bi-archive',               iconBg: 'icon--gray'   },
]);

const formatDateVi = (s) => {
  if (!s) return '—';
  const d = new Date(s);
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
};

const getStatusClass = (s) => ({
  'Đang diễn ra': 'pill--purple',
  'Sắp tới':      'pill--blue',
  'Đã kết thúc':  'pill--gray',
})[s] || '';
</script>

<style scoped>
/* ══════════════════════════════════════════
   BASE — shared với CouponsManagement
══════════════════════════════════════════ */
.page {
  background: #f4f5f7;
  min-height: 100vh;
  padding: 24px;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  color: #1a1d23;
  font-size: 14px;
  line-height: 1.5;
}

/* ── HEADER ── */
.header-card {
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid #e8eaed;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.03);
}
.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 22px;
}
.header-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  font-weight: 600;
  color: #7c3aed;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 7px;
}
.eyebrow-dot {
  width: 6px; height: 6px;
  background: #7c3aed;
  border-radius: 50%;
  animation: pulse-dot 2s infinite;
}
@keyframes pulse-dot {
  0%, 100% { box-shadow: 0 0 0 0 rgba(124,58,237,0.4); }
  50%       { box-shadow: 0 0 0 5px rgba(124,58,237,0); }
}
.header-title { font-size: 1.65rem; font-weight: 700; color: #0f172a; margin: 0 0 4px; letter-spacing: -0.4px; }
.header-sub   { font-size: 13px; color: #6b7280; margin: 0; }
.header-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

.search-box {
  display: flex; align-items: center; gap: 8px;
  background: #f8f9fb; border: 1.5px solid #e5e7eb;
  border-radius: 10px; padding: 9px 14px; width: 280px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.search-box:focus-within { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.08); }
.search-box i { color: #9ca3af; font-size: 13px; flex-shrink: 0; }
.search-box input { border: none; outline: none; background: transparent; font-size: 13px; flex: 1; color: #111827; font-family: inherit; }
.search-box input::placeholder { color: #9ca3af; }

.btn-primary {
  display: inline-flex; align-items: center; gap: 7px;
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: #fff; border: none; border-radius: 10px;
  padding: 10px 20px; font-weight: 600; font-size: 13px;
  font-family: inherit; cursor: pointer; transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(124,58,237,0.25); white-space: nowrap;
}
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(124,58,237,0.35); }

/* Stats */
.stats-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 18px; }
.stat-card {
  display: flex; align-items: center; gap: 12px;
  background: #f8f9fb; border: 1px solid #f0f1f3;
  border-radius: 12px; padding: 14px 18px; flex: 1; min-width: 130px;
  transition: all 0.2s;
}
.stat-card:hover { background: #fff; border-color: #e5e7eb; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
.stat-icon-wrap {
  width: 40px; height: 40px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0;
}
.icon--purple { background: #ede9fe; color: #7c3aed; }
.icon--green  { background: #f0fdf4; color: #16a34a; }
.icon--blue   { background: #eff6ff; color: #2563eb; }
.icon--gray   { background: #f3f4f6; color: #6b7280; }
.stat-value { font-size: 1.4rem; font-weight: 700; color: #0f172a; line-height: 1; }
.stat-label { font-size: 11px; color: #6b7280; margin-top: 3px; font-weight: 500; }

/* Filters */
.filter-row { display: flex; gap: 8px; flex-wrap: wrap; }
.filter-chip {
  display: inline-flex; align-items: center; gap: 6px;
  background: #f8f9fb; border: 1.5px solid #e8eaed;
  border-radius: 8px; padding: 6px 13px;
  font-size: 12px; font-weight: 500; color: #6b7280;
  cursor: pointer; transition: all 0.18s; font-family: inherit;
}
.filter-chip:hover { border-color: #cbd5e1; color: #374151; background: #fff; }
.filter-chip--active { background: #0f172a; color: #fff; border-color: #0f172a; font-weight: 600; }
.filter-chip--active:hover { background: #1e293b; border-color: #1e293b; color: #fff; }

.chip-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; opacity: 0.5; }
.filter-chip--active .chip-dot { opacity: 0.7; }
.dot--purple { background: #7c3aed !important; opacity: 1 !important; }
.dot--blue   { background: #2563eb !important; opacity: 1 !important; }
.dot--gray   { background: #9ca3af !important; opacity: 1 !important; }

.chip-count {
  background: rgba(0,0,0,0.07); border-radius: 6px;
  padding: 1px 6px; font-size: 10px; font-weight: 700;
}
.filter-chip--active .chip-count { background: rgba(255,255,255,0.18); }

/* ── STATES ── */
.state-box { display: flex; align-items: center; justify-content: center; gap: 14px; padding: 64px 0; color: #6b7280; font-size: 13px; }
.loader-ring { display: inline-block; position: relative; width: 28px; height: 28px; }
.loader-ring div {
  box-sizing: border-box; display: block; position: absolute;
  width: 24px; height: 24px; margin: 2px;
  border: 2px solid transparent; border-top-color: #7c3aed;
  border-radius: 50%; animation: spin 0.8s cubic-bezier(0.5,0,0.5,1) infinite;
}
.loader-ring div:nth-child(2) { animation-delay: -0.1s; }
.loader-ring div:nth-child(3) { animation-delay: -0.2s; }
.loader-ring div:nth-child(4) { animation-delay: -0.3s; }
@keyframes spin { to { transform: rotate(360deg); } }
.alert-error { display: flex; align-items: center; gap: 10px; background: #fff1f2; border: 1px solid #fca5a5; border-radius: 10px; padding: 14px 18px; color: #dc2626; font-size: 13px; font-weight: 500; }

/* ── GRID ── */
.voucher-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 16px; }

/* ── CARD ── */
.voucher-card {
  background: #fff; border: 1px solid #e8eaed;
  border-radius: 16px; overflow: hidden; position: relative;
  transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
  animation: card-in 0.32s ease var(--delay, 0ms) backwards;
  display: flex; flex-direction: column;
}
@keyframes card-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
.voucher-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.04); border-color: #d1d5db; }
.card--expired { opacity: 0.6; }

.card-accent { height: 3px; }
.card--purple .card-accent { background: linear-gradient(90deg, #7c3aed, #a78bfa); }

.card-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 18px 8px;
}
.card-type-badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 10px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.5px; color: #7c3aed;
}
.status-pill {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 10px; font-weight: 600; padding: 3px 9px;
  border-radius: 100px; white-space: nowrap;
}
.status-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
.pill--purple { background: #ede9fe; color: #7c3aed; border: 1px solid #ddd6fe; }
.pill--blue   { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
.pill--gray   { background: #f3f4f6; color: #6b7280; border: 1px solid #e5e7eb; }

.card-discount {
  font-size: 1.75rem; font-weight: 800;
  color: #7c3aed; letter-spacing: -1px;
  padding: 0 18px 4px; line-height: 1;
}
.card-desc { font-size: 12px; color: #6b7280; margin: 0; padding: 0 18px 14px; line-height: 1.5; }
.card-desc strong { color: #374151; }

.meta-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 6px;
  margin: 0 18px 12px;
  background: #f8f9fb; border: 1px solid #f0f1f3;
  border-radius: 10px; padding: 10px 12px;
}
.meta-item { display: flex; flex-direction: column; gap: 2px; }
.meta-key  { font-size: 10px; color: #9ca3af; font-weight: 500; display: flex; align-items: center; gap: 4px; }
.meta-val  { font-size: 12px; font-weight: 600; color: #1a1d23; }
.meta-val.highlight { color: #7c3aed; }

.card-footer {
  display: flex; gap: 7px;
  padding: 10px 18px 16px;
  border-top: 1px solid #f0f1f3;
  margin-top: auto;
}
.btn-edit, .btn-toggle, .btn-delete {
  border-radius: 8px; padding: 7px 12px;
  font-size: 12px; font-weight: 600; cursor: pointer;
  transition: all 0.18s; font-family: inherit;
  display: inline-flex; align-items: center; gap: 5px;
  border: 1.5px solid #e8eaed; background: #f8f9fb; color: #374151;
}
.btn-edit { flex: 1; justify-content: center; }
.btn-edit:hover { background: #0f172a; color: #fff; border-color: #0f172a; }
.btn-toggle--pause { background: #fff7ed; border-color: #fed7aa; color: #c2410c; }
.btn-toggle--pause:hover { background: #c2410c; color: #fff; border-color: #c2410c; }
.btn-toggle--play { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }
.btn-toggle--play:hover { background: #15803d; color: #fff; border-color: #15803d; }
.btn-delete { background: #fff1f2; border-color: #fecdd3; color: #dc2626; }
.btn-delete:hover { background: #dc2626; color: #fff; border-color: #dc2626; }

.expired-overlay {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  pointer-events: none; z-index: 5;
}
.expired-overlay span {
  font-family: 'Courier New', monospace;
  font-weight: 800; font-size: 20px; letter-spacing: 5px;
  color: rgba(124,58,237,0.1); border: 3px solid rgba(124,58,237,0.1);
  padding: 6px 18px; border-radius: 6px;
  transform: rotate(-18deg); white-space: nowrap;
}

.empty-state {
  grid-column: 1 / -1; text-align: center;
  background: #fff; border: 2px dashed #e5e7eb;
  border-radius: 18px; padding: 72px 24px;
}
.empty-icon-wrap {
  width: 64px; height: 64px; background: #f8f9fb;
  border-radius: 16px; display: flex; align-items: center; justify-content: center;
  font-size: 26px; color: #d1d5db; margin: 0 auto 20px;
}
.empty-state h5 { font-weight: 700; color: #111827; margin-bottom: 6px; font-size: 16px; }
.empty-state p  { color: #6b7280; font-size: 13px; margin-bottom: 22px; }

/* ── MODAL ── */
.modal-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(15,23,42,0.5); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; padding: 16px;
}
.modal-panel {
  background: #fff; border-radius: 20px;
  width: 100%; max-width: 540px; max-height: 90vh; overflow-y: auto;
  box-shadow: 0 24px 64px rgba(0,0,0,0.2), 0 2px 10px rgba(0,0,0,0.08);
  border: 1px solid #e8eaed;
}
.modal-header {
  position: sticky; top: 0; z-index: 3;
  display: flex; align-items: center;
  padding: 20px 24px 16px; background: #fff;
  border-bottom: 1px solid #f0f1f3; gap: 14px;
}
.modal-header-left { display: flex; align-items: center; gap: 14px; flex: 1; }
.modal-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem; flex-shrink: 0;
}
.modal-icon--purple {
  background: linear-gradient(135deg, #ede9fe, #ddd6fe);
  color: #7c3aed; border: 1px solid #ddd6fe;
}
.modal-label { font-size: 10px; letter-spacing: 1.5px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin: 0; }
.modal-title { font-size: 15px; font-weight: 700; color: #0f172a; margin: 3px 0 0; }
.modal-close-btn {
  background: #f8f9fb; border: 1.5px solid #e8eaed; border-radius: 50%;
  width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #6b7280; font-size: 12px; transition: 0.18s; flex-shrink: 0;
}
.modal-close-btn:hover { background: #0f172a; color: #fff; border-color: #0f172a; }

.modal-body { padding: 0 24px 24px; }

.form-section { padding-top: 22px; }
.section-header {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 16px; padding-bottom: 10px;
  border-bottom: 1px solid #f0f1f3;
}
.section-num {
  width: 24px; height: 24px; background: #0f172a; color: #fff;
  border-radius: 6px; display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700; flex-shrink: 0;
}
.section-title { font-size: 13px; font-weight: 700; color: #0f172a; }

.form-grid { display: flex; flex-wrap: wrap; gap: 12px; }
.field { display: flex; flex-direction: column; }
.field--12 { flex: 0 0 100%; }
.field--6  { flex: 0 0 calc(50% - 6px); min-width: 0; }
@media (max-width: 480px) { .field--6 { flex: 0 0 100%; } }

.field-label { font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 7px; }
.req { color: #ef4444; }

.field-input {
  width: 100%; padding: 9px 12px;
  border: 1.5px solid #e8eaed; border-radius: 8px;
  font-size: 13px; font-family: inherit; color: #111827;
  background: #f8f9fb; outline: none;
  transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
  box-sizing: border-box; -webkit-appearance: none;
}
.field-input:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.08); background: #fff; }

.input-suffix { display: flex; }
.input-suffix .field-input { border-radius: 8px 0 0 8px; flex: 1; }
.suffix-label {
  background: #f3f4f6; color: #6b7280; padding: 0 14px;
  display: flex; align-items: center;
  font-weight: 600; font-size: 13px;
  border-radius: 0 8px 8px 0;
  border: 1.5px solid #e8eaed; border-left: none; flex-shrink: 0;
}

.toggle-row {
  display: flex; align-items: center; gap: 12px;
  border: 1.5px solid #e8eaed; border-radius: 8px;
  padding: 10px 13px; background: #f8f9fb; cursor: pointer;
  transition: border-color 0.18s;
}
.toggle-row:hover { border-color: #7c3aed; }
.toggle-switch-wrap { flex-shrink: 0; }
.toggle-switch-input { display: none; }
.toggle-switch {
  display: block; width: 38px; height: 22px;
  background: #d1d5db; border-radius: 100px; cursor: pointer;
  position: relative; transition: background 0.2s;
}
.toggle-switch::after {
  content: ''; position: absolute;
  width: 16px; height: 16px; background: #fff;
  border-radius: 50%; top: 3px; left: 3px;
  transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}
.toggle-switch--purple { }
.toggle-switch-input:checked + .toggle-switch { background: #7c3aed; }
.toggle-switch-input:checked + .toggle-switch::after { transform: translateX(16px); }
.toggle-name { font-size: 13px; font-weight: 600; color: #111827; margin: 0; }
.toggle-desc { font-size: 11px; color: #9ca3af; margin: 2px 0 0; }

.form-error {
  display: flex; align-items: center; gap: 8px;
  background: #fff1f2; border: 1px solid #fca5a5;
  border-radius: 8px; padding: 11px 14px;
  font-size: 13px; color: #dc2626; font-weight: 500; margin-top: 14px;
}

.modal-actions {
  display: flex; gap: 10px;
  border-top: 1px solid #f0f1f3; padding-top: 18px; margin-top: 22px;
}
.btn-cancel {
  flex: 1; background: #f8f9fb; border: 1.5px solid #e8eaed;
  border-radius: 10px; padding: 11px; font-weight: 600; color: #6b7280;
  cursor: pointer; font-size: 13px; font-family: inherit; transition: all 0.18s;
}
.btn-cancel:hover { border-color: #374151; color: #374151; background: #f0f1f3; }

.btn-submit {
  flex: 1.5; border: none; border-radius: 10px; padding: 11px;
  font-weight: 600; color: #fff; cursor: pointer; font-size: 13px;
  font-family: inherit; transition: all 0.2s;
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
}
.btn-submit--purple {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  box-shadow: 0 2px 8px rgba(124,58,237,0.3);
}
.btn-submit--purple:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(124,58,237,0.4); }
.btn-submit:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

.spinner {
  width: 15px; height: 15px;
  border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff;
  border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block;
}

.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.22s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-slide-enter-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-slide-leave-active { transition: all 0.2s ease; }
.modal-slide-enter-from { opacity: 0; transform: scale(0.94) translateY(18px); }
.modal-slide-leave-to   { opacity: 0; transform: scale(0.97) translateY(8px); }
/* ══ PRODUCT SEARCH ══ */
.product-search-wrap { position: relative; }

.search-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon-inner {
  position: absolute;
  left: 12px;
  color: #9ca3af;
  font-size: 13px;
  pointer-events: none;
  z-index: 1;
}
.search-input-padded { padding-left: 34px !important; padding-right: 60px !important; }

.search-spinner {
  position: absolute; right: 12px;
  width: 16px; height: 16px;
  border: 2px solid #e8eaed; border-top-color: #7c3aed;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
.search-clear-btn {
  position: absolute; right: 10px;
  width: 22px; height: 22px;
  background: #e5e7eb; border: none; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #6b7280; font-size: 9px;
  transition: all 0.18s;
}
.search-clear-btn:hover { background: #374151; color: #fff; }

/* Dropdown */
.product-dropdown {
  position: absolute; top: calc(100% + 4px); left: 0; right: 0;
  z-index: 999; background: #fff;
  border: 1.5px solid #e8eaed; border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  max-height: 240px; overflow-y: auto;
}
.dropdown-loading {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 16px; color: #9ca3af; font-size: 13px;
}
.dropdown-spinner {
  width: 16px; height: 16px; flex-shrink: 0;
  border: 2px solid #e8eaed; border-top-color: #7c3aed;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
.dropdown-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px; cursor: pointer;
  border-bottom: 1px solid #f0f1f3; transition: background 0.15s;
}
.dropdown-item:last-child { border-bottom: none; }
.dropdown-item:hover { background: #f5f3ff; }
.dropdown-item-img {
  width: 40px; height: 40px; border-radius: 8px;
  background: #f3f4f6; overflow: hidden; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  color: #d1d5db; font-size: 16px;
}
.dropdown-item-img img { width: 100%; height: 100%; object-fit: cover; }
.dropdown-item-info { flex: 1; min-width: 0; }
.dropdown-item-name { font-size: 13px; font-weight: 600; color: #111827; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dropdown-item-meta { font-size: 11px; color: #9ca3af; margin-top: 2px; }
.dropdown-item-variants { color: #7c3aed; font-weight: 500; }
.dropdown-item-arrow { color: #d1d5db; font-size: 11px; flex-shrink: 0; }

/* Selected product card */
.selected-product-card {
  display: flex; align-items: center; gap: 12px;
  background: #f5f3ff; border: 1.5px solid #ddd6fe;
  border-radius: 10px; padding: 12px 14px;
}
.selected-product-img {
  width: 44px; height: 44px; border-radius: 8px;
  background: #ede9fe; overflow: hidden; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  color: #a78bfa; font-size: 18px;
}
.selected-product-img img { width: 100%; height: 100%; object-fit: cover; }
.selected-product-info { flex: 1; min-width: 0; }
.selected-product-name { font-size: 13px; font-weight: 600; color: #4c1d95; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.selected-product-id   { font-size: 11px; color: #7c3aed; margin-top: 2px; }
.selected-product-check { color: #7c3aed; font-size: 20px; flex-shrink: 0; }

/* Variant grid */
.variant-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 2px; }
.variant-chip {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 13px; border-radius: 8px; font-size: 12px;
  font-weight: 500; cursor: pointer; font-family: inherit;
  border: 1.5px solid #e8eaed; background: #f8f9fb; color: #374151;
  transition: all 0.18s;
}
.variant-chip:hover { border-color: #7c3aed; color: #7c3aed; background: #f5f3ff; }
.variant-chip--active { border-color: #7c3aed; background: #ede9fe; color: #7c3aed; font-weight: 600; }
.variant-color-dot {
  width: 10px; height: 10px; border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.12); flex-shrink: 0;
}
.variant-chip-label { flex: 1; }
.variant-chip-id { font-size: 10px; color: #9ca3af; font-weight: 400; }
.variant-chip--active .variant-chip-id { color: #a78bfa; }

/* Variant preview */
.variant-preview {
  display: flex; align-items: flex-start; gap: 10px;
  background: #f0fdf4; border: 1.5px solid #bbf7d0;
  border-radius: 10px; padding: 10px 14px; margin-top: 10px;
  color: #16a34a;
}
.variant-preview > i { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
.variant-preview-info { display: flex; flex-direction: column; gap: 3px; }
.variant-preview-name { font-size: 13px; font-weight: 600; color: #15803d; }
.variant-preview-detail { font-size: 11px; color: #6b7280; }
.variant-preview-detail strong { color: #374151; }

/* Variant loading */
.variant-loading {
  display: flex; align-items: center; gap: 8px;
  color: #9ca3af; font-size: 13px; padding: 8px 0;
}

/* Edit note */
.edit-id-note {
  display: flex; align-items: center; gap: 8px;
  background: #fff7ed; border: 1.5px solid #fed7aa;
  border-radius: 8px; padding: 10px 14px;
  font-size: 12px; color: #92400e;
}
.edit-id-note i { color: #f59e0b; flex-shrink: 0; }

/* Price preview */
.price-preview {
  display: inline-flex; align-items: center; gap: 8px;
  margin-top: 8px; padding: 7px 12px;
  background: #f8f9fb; border: 1px solid #e8eaed;
  border-radius: 8px; font-size: 13px;
}
.price-preview-old { color: #9ca3af; text-decoration: line-through; font-size: 12px; }
.price-preview-new { color: #7c3aed; font-weight: 700; font-size: 15px; }
.price-preview-badge {
  background: #7c3aed; color: #fff;
  font-size: 10px; font-weight: 700;
  padding: 2px 7px; border-radius: 20px;
}

/* Card variant badge */
.card-variant-badge {
  display: inline-block; margin-left: 6px;
  background: #ede9fe; color: #7c3aed;
  font-size: 10px; font-weight: 600;
  padding: 1px 7px; border-radius: 20px;
  vertical-align: middle;
}

/* Transitions */
.dropdown-fade-enter-active, .dropdown-fade-leave-active { transition: all 0.18s ease; }
.dropdown-fade-enter-from, .dropdown-fade-leave-to { opacity: 0; transform: translateY(-6px); }

.section-fade-enter-active, .section-fade-leave-active { transition: all 0.25s ease; }
.section-fade-enter-from, .section-fade-leave-to { opacity: 0; transform: translateY(-8px); }
</style>