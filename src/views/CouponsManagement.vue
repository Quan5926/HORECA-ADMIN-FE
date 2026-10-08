<template>
  <div class="page">

    <!-- HEADER -->
    <div class="header-card">
      <div class="header-top">
        <div class="header-info">
          <div class="header-eyebrow">
            <span class="eyebrow-dot"></span>
            <span>Voucher System</span>
          </div>
          <h1 class="header-title">Mã Giảm Giá</h1>
          <p class="header-sub">Quản lý chương trình khuyến mãi & tri ân khách hàng</p>
        </div>
        <div class="header-actions">
          <div class="search-box">
            <i class="bi bi-search"></i>
            <input v-model="searchQuery" type="text" placeholder="Tìm mã voucher...">
          </div>
          <button class="btn-primary" @click="openForm()">
            <i class="bi bi-plus-lg"></i>
            <span>Tạo mã mới</span>
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
          v-for="f in filters" :key="f.val"
          :class="['filter-chip', activeFilter === f.val ? 'filter-chip--active' : '']"
          @click="activeFilter = f.val"
        >
          <span class="chip-dot" :class="f.dot"></span>
          {{ f.label }}
          <span class="chip-count">{{ getCount(f.val) }}</span>
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
        v-for="(coupon, i) in filteredCoupons" :key="coupon.id"
        class="voucher-card"
        :class="[`card--${getCardTheme(coupon.loaiGiam)}`, coupon.trangThaiHienThi === 'Đã hết hạn' ? 'card--expired' : '']"
        :style="`--delay:${i * 50}ms`"
      >
        <div class="card-accent"></div>

        <div class="card-header">
          <div class="card-type-badge">
            <i :class="'bi ' + getTypeIcon(coupon.loaiGiam)"></i>
            <span>{{ getTypeLabel(coupon.loaiGiam) }}</span>
          </div>
          <span :class="['status-pill', getStatusClass(coupon.trangThaiHienThi)]">
            <span class="status-dot"></span>
            {{ coupon.trangThaiHienThi }}
          </span>
        </div>

        <div class="card-discount">{{ formatDiscountShort(coupon) }}</div>
        <p class="card-desc">{{ coupon.moTa || 'Không có mô tả' }}</p>

        <div class="code-box">
          <span class="code-label">MÃ</span>
          <span class="code-text">{{ coupon.maVoucher }}</span>
          <button class="copy-btn" @click="copyCode(coupon.maVoucher)" title="Sao chép">
            <i class="bi bi-copy"></i>
          </button>
        </div>

        <div class="meta-grid">
          <div class="meta-item">
            <span class="meta-key"><i class="bi bi-calendar-check"></i> Bắt đầu</span>
            <span class="meta-val">{{ formatDateVi(coupon.ngayBatDau) }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-key"><i class="bi bi-calendar-x"></i> Kết thúc</span>
            <span class="meta-val">{{ formatDateVi(coupon.ngayKetThuc) }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-key"><i class="bi bi-bag-check"></i> Đơn tối thiểu</span>
            <span class="meta-val highlight">{{ formatCurrency(coupon.donToiThieu) }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-key"><i class="bi bi-people"></i> Đối tượng</span>
            <span class="meta-val">{{ getDoiTuongLabel(coupon.doiTuong) }}</span>
          </div>
        </div>

        <div class="usage-section" v-if="coupon.gioiHanSuDung">
          <div class="usage-header">
            <span class="usage-label"><i class="bi bi-bar-chart-fill"></i> Đã dùng</span>
            <span class="usage-count">
              <b>{{ coupon.daSuDung }}</b> / {{ coupon.gioiHanSuDung }}
            </span>
          </div>
          <div class="progress-track">
            <div
              class="progress-fill"
              :class="getProgressClass(coupon)"
              :style="`width:${Math.min((coupon.daSuDung/coupon.gioiHanSuDung)*100,100)}%`"
            ></div>
          </div>
        </div>
        <div class="usage-unlimited" v-else>
          <i class="bi bi-infinity"></i> Không giới hạn lượt dùng
        </div>

        <div class="card-footer">
          <button class="btn-edit" @click="openForm(coupon)">
            <i class="bi bi-pencil-fill"></i> Chỉnh sửa
          </button>
          <button
            class="btn-toggle"
            :class="coupon.trangThaiHoatDong ? 'btn-toggle--pause' : 'btn-toggle--play'"
            @click="toggleVoucher(coupon)"
            :title="coupon.trangThaiHoatDong ? 'Tạm dừng' : 'Kích hoạt'"
          >
            <i :class="'bi ' + (coupon.trangThaiHoatDong ? 'bi-pause-fill' : 'bi-play-fill')"></i>
          </button>
          <button class="btn-delete" @click="deleteVoucher(coupon.id)" title="Xóa">
            <i class="bi bi-trash3-fill"></i>
          </button>
        </div>

        <div v-if="coupon.trangThaiHienThi === 'Đã hết hạn'" class="expired-overlay">
          <span>HẾT HẠN</span>
        </div>
      </div>

      <div v-if="filteredCoupons.length === 0" class="empty-state">
        <div class="empty-icon-wrap"><i class="bi bi-ticket-perforated"></i></div>
        <h5>Chưa có voucher nào</h5>
        <p>Tạo mã giảm giá đầu tiên để bắt đầu chương trình khuyến mãi</p>
        <button class="btn-primary" @click="openForm()">
          <i class="bi bi-plus-lg"></i><span>Tạo mã mới</span>
        </button>
      </div>
    </div>

    <!-- ── MODAL ── -->
    <Transition name="modal-fade">
      <div v-if="isFormOpen" class="modal-overlay" @click.self="closeForm">
        <Transition name="modal-slide">
          <div v-if="isFormOpen" class="modal-panel custom-scrollbar">

            <div class="modal-header">
              <div class="modal-header-left">
                <div class="modal-icon">
                  <i class="bi bi-ticket-perforated-fill"></i>
                </div>
                <div>
                  <p class="modal-label">HORECA ONE · VOUCHER</p>
                  <h5 class="modal-title">{{ editingId ? 'Cập nhật mã giảm giá' : 'Tạo mã giảm giá mới' }}</h5>
                </div>
              </div>
              <button class="modal-close-btn" @click="closeForm">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <form @submit.prevent="saveVoucher" class="modal-body">

              <!-- Section 01: Thông tin cơ bản -->
              <div class="form-section">
                <div class="section-header">
                  <span class="section-num">01</span>
                  <span class="section-title">Thông tin cơ bản</span>
                </div>
                <div class="form-grid">
                  <div class="field field--7">
                    <label class="field-label">Mã code <span class="req">*</span></label>
                    <div class="input-addon">
                      <input
                        type="text" v-model="formData.maVoucher"
                        class="field-input mono" required placeholder="VD: SUMMER2026"
                        @input="formData.maVoucher = formData.maVoucher.toUpperCase().replace(/\s/g,'')"
                      >
                      <button type="button" class="addon-btn" @click="generateCode" title="Tạo ngẫu nhiên">
                        <i class="bi bi-shuffle"></i>
                      </button>
                    </div>
                  </div>
                  <div class="field field--5">
                    <label class="field-label">Số lượng phát hành</label>
                    <input type="number" v-model="formData.gioiHanSuDung" class="field-input" min="0" placeholder="0 = không giới hạn">
                    <p class="field-hint">0 = không giới hạn</p>
                  </div>
                  <div class="field field--12">
                    <label class="field-label">Mô tả ngắn</label>
                    <input type="text" v-model="formData.moTa" class="field-input" placeholder="VD: Giảm cho khách hàng mới mua đơn đầu tiên">
                  </div>
                </div>
              </div>

              <!-- Section 02: Loại giảm -->
              <div class="form-section">
                <div class="section-header">
                  <span class="section-num">02</span>
                  <span class="section-title">Loại & giá trị giảm</span>
                </div>

                <div class="type-tabs">
                  <button
                    type="button"
                    v-for="t in discountTypes" :key="t.val"
                    :class="['type-tab', formData.loaiGiam === t.val ? `type-tab--active type-tab--${t.color}` : '']"
                    @click="formData.loaiGiam = t.val"
                  >
                    <i :class="'bi ' + t.icon"></i>
                    <span>{{ t.label }}</span>
                  </button>
                </div>

                <div class="form-grid" v-if="formData.loaiGiam !== 'FREESHIP'">
                  <div class="field field--6">
                    <label class="field-label">
                      {{ formData.loaiGiam === 'PHAN_TRAM' ? 'Mức giảm (%)' : 'Số tiền giảm (VNĐ)' }}
                      <span class="req">*</span>
                    </label>
                    <div class="input-suffix">
                      <input type="number" v-model="formData.giaTriGiam" class="field-input" required min="1" :max="formData.loaiGiam === 'PHAN_TRAM' ? 100 : undefined">
                      <span class="suffix-label">{{ formData.loaiGiam === 'PHAN_TRAM' ? '%' : '₫' }}</span>
                    </div>
                  </div>
                  <div class="field field--6" v-if="formData.loaiGiam === 'PHAN_TRAM'">
                    <label class="field-label">Giảm tối đa (VNĐ) <span class="opt">tùy chọn</span></label>
                    <div class="input-suffix">
                      <input type="number" v-model="formData.giamToiDa" class="field-input" min="0" placeholder="Không giới hạn">
                      <span class="suffix-label">₫</span>
                    </div>
                  </div>
                </div>

                <div v-else class="info-note note--green">
                  <i class="bi bi-truck-front-fill"></i>
                  Voucher sẽ miễn toàn bộ phí vận chuyển khi áp dụng.
                </div>
              </div>

              <!-- Section 03: Điều kiện áp dụng -->
              <div class="form-section">
                <div class="section-header">
                  <span class="section-num">03</span>
                  <span class="section-title">Điều kiện áp dụng</span>
                </div>
                <div class="form-grid">

                  <!-- Phạm vi sản phẩm -->
                  <div class="field field--6">
                    <label class="field-label">Phạm vi sản phẩm</label>
                    <div class="select-wrapper">
                      <select v-model="formData.phamViApDung" class="field-input field-select" @change="onPhamViChange">
                        <option value="ALL">Tất cả sản phẩm</option>
                        <option value="CATEGORY">Theo danh mục</option>
                        <option value="SPECIFIC">Sản phẩm cụ thể</option>
                      </select>
                      <i class="bi bi-chevron-down select-arrow"></i>
                    </div>
                  </div>

                  <!-- Đối tượng khách hàng -->
                  <div class="field field--6">
                    <label class="field-label">Đối tượng khách hàng</label>
                    <div class="select-wrapper">
                      <select v-model="formData.doiTuong" class="field-input field-select" @change="onDoiTuongChange">
                        <option value="ALL">Tất cả khách hàng</option>
                        <option value="NEW">Khách hàng mới</option>
                        <option value="VIP">Khách VIP / Thân thiết</option>
                        <option value="SPECIFIC">Khách hàng cụ thể</option>
                      </select>
                      <i class="bi bi-chevron-down select-arrow"></i>
                    </div>
                  </div>

                  <!-- ── DANH MỤC ── -->
                  <div class="field field--12" v-if="formData.phamViApDung === 'CATEGORY'">
                    <label class="field-label">
                      Chọn danh mục <span class="req">*</span>
                      <span v-if="loadingCategories" class="loading-inline">
                        <i class="bi bi-arrow-clockwise spin"></i> Đang tải...
                      </span>
                    </label>

                    <!-- Đã xác nhận: hiện tóm tắt + nút Sửa -->
                    <div v-if="!showDanhMucPicker && formData.danhMucIds?.length" class="ms-reopen">
                      <div class="ms-reopen-info">
                        <i class="bi bi-tag-fill"></i>
                        Đã chọn <b>{{ formData.danhMucIds.length }}</b> danh mục
                      </div>
                      <button type="button" class="ms-reopen-btn" @click="showDanhMucPicker = true">
                        <i class="bi bi-pencil-fill"></i> Sửa
                      </button>
                    </div>

                    <!-- Picker -->
                    <template v-if="showDanhMucPicker || !formData.danhMucIds?.length">
                      <div class="multi-select-box">
                        <div v-if="categories.length === 0 && !loadingCategories" class="multi-empty">
                          Không có danh mục nào
                        </div>
                        <label
                          v-for="cat in categories" :key="cat.id"
                          class="multi-item"
                          :class="formData.danhMucIds?.includes(cat.id) ? 'multi-item--checked' : ''"
                        >
                          <input type="checkbox" :value="cat.id" v-model="formData.danhMucIds" class="multi-checkbox">
                          <span class="multi-icon"><i class="bi bi-tag-fill"></i></span>
                          <span class="multi-label">{{ cat.tenDanhMuc || cat.name || cat.ten }}</span>
                          <i class="bi bi-check2 multi-check"></i>
                        </label>
                      </div>
                      <!-- Footer nằm NGOÀI multi-select-box -->
                      <div class="ms-footer">
                        <span class="ms-footer-count">
                          Đã chọn <b>{{ formData.danhMucIds?.length || 0 }}</b> danh mục
                        </span>
                        <button type="button" class="ms-confirm-btn" @click="closeDanhMucPicker">
                          <i class="bi bi-check2"></i> Xác nhận
                        </button>
                      </div>
                    </template>
                  </div>

                  <!-- ── SẢN PHẨM CỤ THỂ ── -->
                  <div class="field field--12" v-if="formData.phamViApDung === 'SPECIFIC'">
                    <label class="field-label">
                      Chọn sản phẩm <span class="req">*</span>
                      <span v-if="loadingProducts" class="loading-inline">
                        <i class="bi bi-arrow-clockwise spin"></i> Đang tải...
                      </span>
                    </label>

                    <!-- Đã xác nhận: hiện tóm tắt + nút Sửa -->
                    <div v-if="!showSanPhamPicker && formData.sanPhamIds?.length" class="ms-reopen">
                      <div class="ms-reopen-info">
                        <i class="bi bi-box-seam"></i>
                        Đã chọn <b>{{ formData.sanPhamIds.length }}</b> sản phẩm
                      </div>
                      <button type="button" class="ms-reopen-btn" @click="showSanPhamPicker = true">
                        <i class="bi bi-pencil-fill"></i> Sửa
                      </button>
                    </div>

                    <!-- Picker -->
                    <template v-if="showSanPhamPicker || !formData.sanPhamIds?.length">
                      <div class="search-inline">
                        <i class="bi bi-search"></i>
                        <input v-model="productSearch" type="text" placeholder="Tìm sản phẩm...">
                      </div>
                      <div class="multi-select-box multi-select-box--tall">
                        <div v-if="filteredProducts.length === 0 && !loadingProducts" class="multi-empty">
                          Không tìm thấy sản phẩm nào
                        </div>
                        <label
                          v-for="prod in filteredProducts" :key="prod.id"
                          class="multi-item"
                          :class="formData.sanPhamIds?.includes(prod.id) ? 'multi-item--checked' : ''"
                        >
                          <input type="checkbox" :value="prod.id" v-model="formData.sanPhamIds" class="multi-checkbox">
                          <span class="multi-icon"><i class="bi bi-box-seam"></i></span>
                          <span class="multi-label">{{ prod.tenSanPham || prod.name || prod.ten }}</span>
                          <i class="bi bi-check2 multi-check"></i>
                        </label>
                      </div>
                      <!-- Footer nằm NGOÀI multi-select-box -->
                      <div class="ms-footer">
                        <span class="ms-footer-count">
                          Đã chọn <b>{{ formData.sanPhamIds?.length || 0 }}</b> sản phẩm
                        </span>
                        <button type="button" class="ms-confirm-btn" @click="closeSanPhamPicker">
                          <i class="bi bi-check2"></i> Xác nhận
                        </button>
                      </div>
                    </template>
                  </div>

                  <!-- ── KHÁCH HÀNG CỤ THỂ ── -->
                  <div class="field field--12" v-if="formData.doiTuong === 'SPECIFIC'">
                    <label class="field-label">
                      Chọn khách hàng <span class="req">*</span>
                      <span v-if="loadingCustomers" class="loading-inline">
                        <i class="bi bi-arrow-clockwise spin"></i> Đang tải...
                      </span>
                    </label>

                    <!-- Đã xác nhận: hiện tóm tắt + nút Sửa -->
                    <div v-if="!showKhachHangPicker && formData.khachHangIds?.length" class="ms-reopen">
                      <div class="ms-reopen-info">
                        <i class="bi bi-person-fill"></i>
                        Đã chọn <b>{{ formData.khachHangIds.length }}</b> khách hàng
                      </div>
                      <button type="button" class="ms-reopen-btn" @click="showKhachHangPicker = true">
                        <i class="bi bi-pencil-fill"></i> Sửa
                      </button>
                    </div>

                    <!-- Picker -->
                    <template v-if="showKhachHangPicker || !formData.khachHangIds?.length">
                      <div class="search-inline">
                        <i class="bi bi-search"></i>
                        <input v-model="customerSearch" type="text" placeholder="Tìm khách hàng...">
                      </div>
                      <div class="multi-select-box multi-select-box--tall">
                        <div v-if="filteredCustomers.length === 0 && !loadingCustomers" class="multi-empty">
                          Không tìm thấy khách hàng nào
                        </div>
                        <label
                          v-for="cust in filteredCustomers" :key="cust.id"
                          class="multi-item"
                          :class="formData.khachHangIds?.includes(cust.id) ? 'multi-item--checked' : ''"
                        >
                          <input type="checkbox" :value="cust.id" v-model="formData.khachHangIds" class="multi-checkbox">
                          <span class="multi-icon"><i class="bi bi-person-fill"></i></span>
                          <div class="multi-label-group">
                            <span class="multi-label">{{ cust.hoTen || cust.name || cust.ho + ' ' + cust.ten }}</span>
                            <span class="multi-sub">{{ cust.email || cust.soDienThoai || '' }}</span>
                          </div>
                          <i class="bi bi-check2 multi-check"></i>
                        </label>
                      </div>
                      <!-- Footer nằm NGOÀI multi-select-box -->
                      <div class="ms-footer">
                        <span class="ms-footer-count">
                          Đã chọn <b>{{ formData.khachHangIds?.length || 0 }}</b> khách hàng
                        </span>
                        <button type="button" class="ms-confirm-btn" @click="closeKhachHangPicker">
                          <i class="bi bi-check2"></i> Xác nhận
                        </button>
                      </div>
                    </template>
                  </div>

                  <div class="field field--6">
                    <label class="field-label">Giá trị đơn tối thiểu (VNĐ) <span class="req">*</span></label>
                    <div class="input-suffix">
                      <input type="number" v-model="formData.donToiThieu" class="field-input" required min="0" placeholder="0 = không yêu cầu">
                      <span class="suffix-label">₫</span>
                    </div>
                  </div>

                  <div class="field field--6">
                    <label class="field-label">&nbsp;</label>
                    <div class="toggle-row" @click="formData.moiKhach1Lan = !formData.moiKhach1Lan">
                      <div class="toggle-switch-wrap" @click.stop>
                        <input class="toggle-switch-input" type="checkbox" v-model="formData.moiKhach1Lan" id="toggle-1lan">
                        <label class="toggle-switch" for="toggle-1lan"></label>
                      </div>
                      <div class="toggle-info">
                        <p class="toggle-name">Mỗi khách 1 lần</p>
                        <p class="toggle-desc">Ngăn dùng nhiều lần / tài khoản</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section 04: Thời gian -->
              <div class="form-section">
                <div class="section-header">
                  <span class="section-num">04</span>
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

              <div v-if="formError" class="form-error">
                <i class="bi bi-exclamation-circle-fill"></i> {{ formError }}
              </div>

              <div class="modal-actions">
                <button type="button" class="btn-cancel" @click="closeForm">Hủy bỏ</button>
                <button type="submit" class="btn-submit" :disabled="saving">
                  <span v-if="saving" class="spinner"></span>
                  <i v-else class="bi bi-send-fill"></i>
                  {{ editingId ? 'Lưu thay đổi' : 'Phát hành voucher' }}
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
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { API_BASE } from '@/config/api';

const api = axios.create({ baseURL: `${API_BASE}/api` });
api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
const BASE = '/ma-giam-gia';

// ── State ─────────────────────────────────
const couponsList  = ref([]);
const loading      = ref(false);
const error        = ref('');
const searchQuery  = ref('');
const activeFilter = ref('all');
const isFormOpen   = ref(false);
const editingId    = ref(null);
const saving       = ref(false);
const formError    = ref('');

// Dynamic data
const categories        = ref([]);
const products          = ref([]);
const customers         = ref([]);
const loadingCategories = ref(false);
const loadingProducts   = ref(false);
const loadingCustomers  = ref(false);
const productSearch     = ref('');
const customerSearch    = ref('');

// Picker visibility
const showDanhMucPicker   = ref(false);
const showSanPhamPicker   = ref(false);
const showKhachHangPicker = ref(false);

const closeDanhMucPicker   = () => { showDanhMucPicker.value   = false; };
const closeSanPhamPicker   = () => { showSanPhamPicker.value   = false; };
const closeKhachHangPicker = () => { showKhachHangPicker.value = false; };

// ── Form default ──────────────────────────
const defaultForm = () => ({
  maVoucher: '', loaiGiam: 'PHAN_TRAM', giaTriGiam: 0, giamToiDa: null,
  donToiThieu: 0, gioiHanSuDung: 100, ngayBatDau: '', ngayKetThuc: '',
  moTa: '', phamViApDung: 'ALL', doiTuong: 'ALL', moiKhach1Lan: true,
  trangThaiHoatDong: true, nguoiTao: 1, nguoiSua: 1,
  danhMucIds: [], sanPhamIds: [], khachHangIds: [],
});
const formData = ref(defaultForm());

// ── Fetch coupons ─────────────────────────
const fetchAll = async () => {
  loading.value = true; error.value = '';
  try { const { data } = await api.get(BASE); couponsList.value = data; }
  catch { error.value = 'Không thể tải danh sách voucher. Vui lòng thử lại.'; }
  finally { loading.value = false; }
};
onMounted(fetchAll);

// ── Dynamic data loaders ──────────────────
const loadCategories = async () => {
  if (categories.value.length > 0) return;
  loadingCategories.value = true;
  try {
    const { data } = await api.get('/categories');
    categories.value = Array.isArray(data) ? data : (data.content || data.data || []);
  } catch { categories.value = []; }
  finally { loadingCategories.value = false; }
};

const loadProducts = async () => {
  if (products.value.length > 0) return;
  loadingProducts.value = true;
  try {
    const { data } = await api.get('/products');
    products.value = Array.isArray(data) ? data : (data.content || data.data || []);
  } catch { products.value = []; }
  finally { loadingProducts.value = false; }
};

const loadCustomers = async () => {
  if (customers.value.length > 0) return;
  loadingCustomers.value = true;
  await new Promise(r => setTimeout(r, 300));
  customers.value = [
    { id: 1, hoTen: 'Nguyễn Văn An',  email: 'an.nguyen@gmail.com',  soDienThoai: '0901234567' },
    { id: 2, hoTen: 'Trần Thị Bích',  email: 'bich.tran@yahoo.com',  soDienThoai: '0912345678' },
    { id: 3, hoTen: 'Lê Minh Hoàng',  email: 'hoang.le@hotmail.com', soDienThoai: '0923456789' },
    { id: 4, hoTen: 'Phạm Thị Lan',   email: 'lan.pham@gmail.com',   soDienThoai: '0934567890' },
    { id: 5, hoTen: 'Vũ Đức Thành',   email: 'thanh.vu@company.vn',  soDienThoai: '0945678901' },
  ];
  // TODO: swap khi có API
  // try {
  //   const { data } = await api.get('/khach-hang');
  //   customers.value = Array.isArray(data) ? data : (data.content || data.data || []);
  // } catch { customers.value = []; }
  loadingCustomers.value = false;
};

const onPhamViChange = () => {
  formData.value.danhMucIds = [];
  formData.value.sanPhamIds = [];
  showDanhMucPicker.value  = false;
  showSanPhamPicker.value  = false;
  if (formData.value.phamViApDung === 'CATEGORY') { loadCategories(); showDanhMucPicker.value = true; }
  if (formData.value.phamViApDung === 'SPECIFIC')  { loadProducts();   showSanPhamPicker.value  = true; }
};

const onDoiTuongChange = () => {
  formData.value.khachHangIds = [];
  showKhachHangPicker.value = false;
  if (formData.value.doiTuong === 'SPECIFIC') { loadCustomers(); showKhachHangPicker.value = true; }
};

const filteredProducts = computed(() => {
  const q = productSearch.value.toLowerCase();
  if (!q) return products.value;
  return products.value.filter(p => (p.tenSanPham || p.name || p.ten || '').toLowerCase().includes(q));
});

const filteredCustomers = computed(() => {
  const q = customerSearch.value.toLowerCase();
  if (!q) return customers.value;
  return customers.value.filter(c =>
    (c.hoTen || c.name || (c.ho + ' ' + c.ten) || '').toLowerCase().includes(q) ||
    (c.email || '').toLowerCase().includes(q) ||
    (c.soDienThoai || '').includes(q)
  );
});

// ── Save ──────────────────────────────────
const saveVoucher = async () => {
  saving.value = true; formError.value = '';
  try {
    const payload = {
      ...formData.value,
      maVoucher:     formData.value.maVoucher.toUpperCase(),
      gioiHanSuDung: formData.value.gioiHanSuDung == 0 ? null : formData.value.gioiHanSuDung,
      giamToiDa:     formData.value.giamToiDa || null,
      ngayBatDau:    formData.value.ngayBatDau  ? formData.value.ngayBatDau.slice(0, 19)  : null,
      ngayKetThuc:   formData.value.ngayKetThuc ? formData.value.ngayKetThuc.slice(0, 19) : null,
    };
    if (editingId.value) await api.put(`${BASE}/${editingId.value}`, payload);
    else                 await api.post(BASE, payload);
    await fetchAll(); closeForm();
  } catch (e) {
    formError.value = e.response?.data?.message || e.response?.data || 'Có lỗi xảy ra, vui lòng thử lại.';
  } finally { saving.value = false; }
};

const toggleVoucher = async (coupon) => {
  try { await api.patch(`${BASE}/${coupon.id}/toggle?nguoiSua=1`); await fetchAll(); }
  catch { alert('Không thể thay đổi trạng thái.'); }
};

const deleteVoucher = async (id) => {
  if (!confirm('Xóa vĩnh viễn mã giảm giá này?')) return;
  try { await api.delete(`${BASE}/${id}`); couponsList.value = couponsList.value.filter(c => c.id !== id); }
  catch { alert('Không thể xóa voucher.'); }
};

// ── Open / Close form ─────────────────────
const openForm = (coupon = null) => {
  formError.value = ''; productSearch.value = ''; customerSearch.value = '';
  showDanhMucPicker.value   = false;
  showSanPhamPicker.value   = false;
  showKhachHangPicker.value = false;
  if (coupon) {
    editingId.value = coupon.id;
    formData.value = {
      maVoucher:         coupon.maVoucher,
      loaiGiam:          coupon.loaiGiam,
      giaTriGiam:        coupon.giaTriGiam,
      giamToiDa:         coupon.giamToiDa,
      donToiThieu:       coupon.donToiThieu,
      gioiHanSuDung:     coupon.gioiHanSuDung ?? 0,
      ngayBatDau:        coupon.ngayBatDau  ? coupon.ngayBatDau.slice(0, 16)  : '',
      ngayKetThuc:       coupon.ngayKetThuc ? coupon.ngayKetThuc.slice(0, 16) : '',
      moTa:              coupon.moTa ?? '',
      phamViApDung:      coupon.phamViApDung ?? 'ALL',
      doiTuong:          coupon.doiTuong    ?? 'ALL',
      moiKhach1Lan:      coupon.moiKhach1Lan ?? true,
      trangThaiHoatDong: coupon.trangThaiHoatDong,
      nguoiTao: 1, nguoiSua: 1,
      danhMucIds:  coupon.danhMucIds  || [],
      sanPhamIds:  coupon.sanPhamIds  || [],
      khachHangIds: coupon.khachHangIds || [],
    };
    if (coupon.phamViApDung === 'CATEGORY') loadCategories();
    if (coupon.phamViApDung === 'SPECIFIC')  loadProducts();
    if (coupon.doiTuong     === 'SPECIFIC')  loadCustomers();
  } else {
    editingId.value = null;
    formData.value  = defaultForm();
  }
  isFormOpen.value = true;
};
const closeForm = () => { isFormOpen.value = false; };

// ── Utils ─────────────────────────────────
const generateCode = () => {
  const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  formData.value.maVoucher = 'VIPEP' + Array.from({ length: 5 }, () => c[Math.floor(Math.random() * c.length)]).join('');
};
const copyCode = (code) => navigator.clipboard.writeText(code).then(() => alert(`Đã sao chép: ${code}`));

const filters = [
  { val: 'all',          label: 'Tất cả',       dot: '' },
  { val: 'Đang diễn ra', label: 'Đang diễn ra', dot: 'dot--green'  },
  { val: 'Sắp tới',      label: 'Sắp tới',      dot: 'dot--blue'   },
  { val: 'Đã hết hạn',   label: 'Đã hết hạn',   dot: 'dot--gray'   },
  { val: 'Tạm dừng',     label: 'Tạm dừng',     dot: 'dot--orange' },
  { val: 'Hết lượt',     label: 'Hết lượt',     dot: 'dot--red'    },
];

const discountTypes = [
  { val: 'PHAN_TRAM', label: 'Theo %',    icon: 'bi-percent',   color: 'amber' },
  { val: 'CO_DINH',   label: 'Cố định',   icon: 'bi-cash-coin', color: 'blue'  },
  { val: 'FREESHIP',  label: 'Free ship', icon: 'bi-truck',     color: 'green' },
];

const getCount = (val) =>
  val === 'all'
    ? couponsList.value.length
    : couponsList.value.filter(c => c.trangThaiHienThi === val).length;

const filteredCoupons = computed(() => couponsList.value.filter(c => {
  const q = searchQuery.value.toLowerCase();
  return (c.maVoucher.toLowerCase().includes(q) || (c.moTa || '').toLowerCase().includes(q))
    && (activeFilter.value === 'all' || c.trangThaiHienThi === activeFilter.value);
}));

const stats = computed(() => [
  { label: 'Tổng voucher', value: couponsList.value.length,                                                    icon: 'bi-ticket-perforated-fill', iconBg: 'icon--amber' },
  { label: 'Đang diễn ra', value: couponsList.value.filter(c => c.trangThaiHienThi === 'Đang diễn ra').length, icon: 'bi-broadcast-pin',          iconBg: 'icon--green' },
  { label: 'Sắp tới',      value: couponsList.value.filter(c => c.trangThaiHienThi === 'Sắp tới').length,      icon: 'bi-hourglass-split',        iconBg: 'icon--blue'  },
  { label: 'Đã hết hạn',   value: couponsList.value.filter(c => c.trangThaiHienThi === 'Đã hết hạn').length,  icon: 'bi-archive',                iconBg: 'icon--gray'  },
]);

const formatCurrency = (v) =>
  v != null ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v) : '0 ₫';

const formatDateVi = (s) => {
  if (!s) return '—';
  const d = new Date(s);
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
};

const formatDiscountShort = (c) => {
  if (c.loaiGiam === 'FREESHIP')   return 'Free Ship';
  if (c.loaiGiam === 'PHAN_TRAM')  return `-${c.giaTriGiam}%`;
  return new Intl.NumberFormat('vi-VN', { notation: 'compact', maximumFractionDigits: 0 }).format(c.giaTriGiam) + '₫';
};

const getCardTheme     = (l) => ({ PHAN_TRAM: 'amber', CO_DINH: 'blue', FREESHIP: 'green' })[l] || 'amber';
const getTypeIcon      = (l) => ({ PHAN_TRAM: 'bi-percent', CO_DINH: 'bi-cash-coin', FREESHIP: 'bi-truck' })[l] || 'bi-tag';
const getTypeLabel     = (l) => ({ PHAN_TRAM: 'Phần trăm', CO_DINH: 'Cố định', FREESHIP: 'Free ship' })[l] || l;
const getDoiTuongLabel = (v) => ({ ALL: 'Tất cả', NEW: 'Khách mới', VIP: 'Khách VIP', SPECIFIC: 'Cụ thể' })[v] || v;
const getStatusClass   = (s) => ({ 'Đang diễn ra': 'pill--green', 'Sắp tới': 'pill--blue', 'Đã hết hạn': 'pill--gray', 'Tạm dừng': 'pill--orange', 'Hết lượt': 'pill--red' })[s] || '';
const getProgressClass = (c) => {
  const r = c.daSuDung / c.gioiHanSuDung;
  return r >= 1 ? 'prog--red' : r >= 0.8 ? 'prog--orange' : 'prog--green';
};
</script>

<style scoped>
/* ══════════════════════════════════════════
   BASE
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

/* ══════════════════════════════════════════
   HEADER
══════════════════════════════════════════ */
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
  color: #f97316;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 7px;
}
.eyebrow-dot {
  width: 6px; height: 6px;
  background: #f97316;
  border-radius: 50%;
  animation: pulse-dot 2s infinite;
}
@keyframes pulse-dot {
  0%, 100% { box-shadow: 0 0 0 0 rgba(249,115,22,0.4); }
  50%       { box-shadow: 0 0 0 5px rgba(249,115,22,0); }
}
.header-title { font-size: 1.65rem; font-weight: 700; color: #0f172a; margin: 0 0 4px; letter-spacing: -0.4px; }
.header-sub   { font-size: 13px; color: #6b7280; margin: 0; }
.header-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

.search-box {
  display: flex; align-items: center; gap: 8px;
  background: #f8f9fb; border: 1.5px solid #e5e7eb;
  border-radius: 10px; padding: 9px 14px; width: 240px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.search-box:focus-within { border-color: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.08); }
.search-box i { color: #9ca3af; font-size: 13px; flex-shrink: 0; }
.search-box input { border: none; outline: none; background: transparent; font-size: 13px; flex: 1; color: #111827; font-family: inherit; }
.search-box input::placeholder { color: #9ca3af; }

.btn-primary {
  display: inline-flex; align-items: center; gap: 7px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: #fff; border: none; border-radius: 10px;
  padding: 10px 20px; font-weight: 600; font-size: 13px;
  font-family: inherit; cursor: pointer;
  transition: all 0.2s; box-shadow: 0 2px 8px rgba(249,115,22,0.25);
  white-space: nowrap;
}
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(249,115,22,0.35); }

/* Stats */
.stats-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 18px; }
.stat-card {
  display: flex; align-items: center; gap: 12px;
  background: #f8f9fb; border: 1px solid #f0f1f3;
  border-radius: 12px; padding: 14px 18px;
  flex: 1; min-width: 130px; transition: all 0.2s;
}
.stat-card:hover { background: #fff; border-color: #e5e7eb; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
.stat-icon-wrap {
  width: 40px; height: 40px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0;
}
.icon--amber { background: #fff7ed; color: #f97316; }
.icon--green { background: #f0fdf4; color: #16a34a; }
.icon--blue  { background: #eff6ff; color: #2563eb; }
.icon--gray  { background: #f3f4f6; color: #6b7280; }
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
.dot--green  { background: #16a34a !important; opacity: 1 !important; }
.dot--blue   { background: #2563eb !important; opacity: 1 !important; }
.dot--gray   { background: #9ca3af !important; opacity: 1 !important; }
.dot--orange { background: #f97316 !important; opacity: 1 !important; }
.dot--red    { background: #dc2626 !important; opacity: 1 !important; }
.chip-count { background: rgba(0,0,0,0.07); border-radius: 6px; padding: 1px 6px; font-size: 10px; font-weight: 700; }
.filter-chip--active .chip-count { background: rgba(255,255,255,0.18); }

/* ══════════════════════════════════════════
   STATES
══════════════════════════════════════════ */
.state-box { display: flex; align-items: center; justify-content: center; gap: 14px; padding: 64px 0; color: #6b7280; font-size: 13px; }
.loader-ring { display: inline-block; position: relative; width: 28px; height: 28px; }
.loader-ring div {
  box-sizing: border-box; display: block; position: absolute;
  width: 24px; height: 24px; margin: 2px;
  border: 2px solid transparent; border-top-color: #f97316;
  border-radius: 50%; animation: spin 0.8s cubic-bezier(0.5,0,0.5,1) infinite;
}
.loader-ring div:nth-child(2) { animation-delay: -0.1s; }
.loader-ring div:nth-child(3) { animation-delay: -0.2s; }
.loader-ring div:nth-child(4) { animation-delay: -0.3s; }
@keyframes spin { to { transform: rotate(360deg); } }
.alert-error {
  display: flex; align-items: center; gap: 10px;
  background: #fff1f2; border: 1px solid #fca5a5;
  border-radius: 10px; padding: 14px 18px;
  color: #dc2626; font-size: 13px; font-weight: 500;
}

/* ══════════════════════════════════════════
   GRID
══════════════════════════════════════════ */
.voucher-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 16px; }

/* ══════════════════════════════════════════
   VOUCHER CARD
══════════════════════════════════════════ */
.voucher-card {
  background: #fff; border: 1px solid #e8eaed;
  border-radius: 16px; overflow: hidden; position: relative;
  transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
  animation: card-in 0.32s ease var(--delay, 0ms) backwards;
  display: flex; flex-direction: column;
}
@keyframes card-in {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: none; }
}
.voucher-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.04); border-color: #d1d5db; }
.voucher-card--expired { opacity: 0.6; }

.card-accent { height: 3px; background: #e5e7eb; }
.card--amber .card-accent { background: linear-gradient(90deg, #f97316, #fb923c); }
.card--blue  .card-accent { background: linear-gradient(90deg, #2563eb, #60a5fa); }
.card--green .card-accent { background: linear-gradient(90deg, #16a34a, #4ade80); }

.card-header { display: flex; justify-content: space-between; align-items: center; padding: 14px 18px 8px; }
.card-type-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #9ca3af; }
.card--amber .card-type-badge { color: #f97316; }
.card--blue  .card-type-badge { color: #2563eb; }
.card--green .card-type-badge { color: #16a34a; }

.status-pill { display: inline-flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 600; padding: 3px 9px; border-radius: 100px; white-space: nowrap; }
.status-dot  { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
.pill--green  { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.pill--blue   { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
.pill--gray   { background: #f3f4f6; color: #6b7280; border: 1px solid #e5e7eb; }
.pill--orange { background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; }
.pill--red    { background: #fff1f2; color: #dc2626; border: 1px solid #fecdd3; }

.card-discount { font-size: 1.75rem; font-weight: 800; color: #0f172a; letter-spacing: -1px; padding: 0 18px 4px; line-height: 1; }
.card--amber .card-discount { color: #ea580c; }
.card--blue  .card-discount { color: #1d4ed8; }
.card--green .card-discount { color: #15803d; }
.card-desc { font-size: 12px; color: #6b7280; margin: 0; padding: 0 18px 14px; line-height: 1.5; flex-grow: 0; }

.code-box { display: flex; align-items: center; gap: 8px; margin: 0 18px 14px; background: #f8f9fb; border: 1.5px dashed #d1d5db; border-radius: 8px; padding: 8px 12px; }
.code-label { font-size: 9px; font-weight: 800; letter-spacing: 1px; color: #9ca3af; flex-shrink: 0; }
.code-text  { flex: 1; font-family: 'Courier New', monospace; font-weight: 700; font-size: 13px; color: #0f172a; letter-spacing: 2px; }
.copy-btn   { background: none; border: none; color: #9ca3af; cursor: pointer; padding: 3px 6px; border-radius: 5px; font-size: 12px; transition: 0.15s; }
.copy-btn:hover { background: #e5e7eb; color: #374151; }

.meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin: 0 18px 12px; background: #f8f9fb; border: 1px solid #f0f1f3; border-radius: 10px; padding: 10px 12px; }
.meta-item { display: flex; flex-direction: column; gap: 2px; }
.meta-key  { font-size: 10px; color: #9ca3af; font-weight: 500; display: flex; align-items: center; gap: 4px; }
.meta-val  { font-size: 12px; font-weight: 600; color: #1a1d23; }
.meta-val.highlight { color: #dc2626; }

.usage-section  { padding: 0 18px 12px; }
.usage-header   { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.usage-label    { font-size: 10px; color: #9ca3af; font-weight: 600; display: flex; align-items: center; gap: 4px; }
.usage-count    { font-size: 11px; color: #374151; font-weight: 600; }
.usage-count b  { color: #0f172a; }
.progress-track { height: 5px; background: #f0f1f3; border-radius: 100px; overflow: hidden; }
.progress-fill  { height: 100%; border-radius: 100px; transition: width 0.6s ease; }
.prog--green  { background: linear-gradient(90deg, #34d399, #10b981); }
.prog--orange { background: linear-gradient(90deg, #fbbf24, #f59e0b); }
.prog--red    { background: linear-gradient(90deg, #f87171, #ef4444); }
.usage-unlimited { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #9ca3af; font-weight: 500; padding: 0 18px 12px; }

.card-footer { display: flex; gap: 7px; padding: 10px 18px 16px; border-top: 1px solid #f0f1f3; margin-top: auto; }
.btn-edit, .btn-toggle, .btn-delete {
  border-radius: 8px; padding: 7px 12px; font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all 0.18s; font-family: inherit;
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

.expired-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; z-index: 5; }
.expired-overlay span { font-family: 'Courier New', monospace; font-weight: 800; font-size: 20px; letter-spacing: 5px; color: rgba(220,38,38,0.1); border: 3px solid rgba(220,38,38,0.1); padding: 6px 18px; border-radius: 6px; transform: rotate(-18deg); white-space: nowrap; }

.empty-state { grid-column: 1 / -1; text-align: center; background: #fff; border: 2px dashed #e5e7eb; border-radius: 18px; padding: 72px 24px; }
.empty-icon-wrap { width: 64px; height: 64px; background: #f8f9fb; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 26px; color: #d1d5db; margin: 0 auto 20px; }
.empty-state h5 { font-weight: 700; color: #111827; margin-bottom: 6px; font-size: 16px; }
.empty-state p  { color: #6b7280; font-size: 13px; margin-bottom: 22px; }

/* ══════════════════════════════════════════
   MODAL
══════════════════════════════════════════ */
.modal-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(15,23,42,0.5); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; padding: 16px;
}
.modal-panel {
  background: #fff; border-radius: 20px;
  width: 100%; max-width: 660px; max-height: 90vh;
  overflow-y: auto;
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
.modal-icon { width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #fff7ed, #ffedd5); color: #f97316; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; border: 1px solid #fed7aa; }
.modal-label { font-size: 10px; letter-spacing: 1.5px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin: 0; }
.modal-title { font-size: 15px; font-weight: 700; color: #0f172a; margin: 3px 0 0; }
.modal-close-btn { background: #f8f9fb; border: 1.5px solid #e8eaed; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #6b7280; font-size: 12px; transition: 0.18s; flex-shrink: 0; }
.modal-close-btn:hover { background: #0f172a; color: #fff; border-color: #0f172a; }

.modal-body { padding: 0 24px 24px; }
.form-section { padding-top: 22px; }
.section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid #f0f1f3; }
.section-num { width: 24px; height: 24px; background: #0f172a; color: #fff; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; flex-shrink: 0; }
.section-title { font-size: 13px; font-weight: 700; color: #0f172a; }

.form-grid { display: flex; flex-wrap: wrap; gap: 12px; }
.field { display: flex; flex-direction: column; }
.field--12 { flex: 0 0 100%; }
.field--7  { flex: 0 0 calc(58% - 6px); min-width: 0; }
.field--5  { flex: 0 0 calc(42% - 6px); min-width: 0; }
.field--6  { flex: 0 0 calc(50% - 6px); min-width: 0; }
@media (max-width: 520px) { .field--7, .field--5, .field--6 { flex: 0 0 100%; } }

.field-label { font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 7px; display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }
.req { color: #ef4444; }
.opt { font-weight: 400; color: #9ca3af; font-size: 11px; }
.field-hint { font-size: 11px; color: #9ca3af; margin: 5px 0 0; }

.field-input { width: 100%; padding: 9px 12px; border: 1.5px solid #e8eaed; border-radius: 8px; font-size: 13px; font-family: inherit; color: #111827; background: #f8f9fb; outline: none; transition: border-color 0.18s, box-shadow 0.18s, background 0.18s; box-sizing: border-box; -webkit-appearance: none; }
.field-input:focus { border-color: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.08); background: #fff; }
.mono { font-family: 'Courier New', monospace; letter-spacing: 2px; font-weight: 700; }
.field-select { cursor: pointer; }

.input-addon { display: flex; }
.input-addon .field-input { border-radius: 8px 0 0 8px; flex: 1; }
.addon-btn { background: #0f172a; color: #fff; border: none; padding: 0 14px; border-radius: 0 8px 8px 0; cursor: pointer; font-size: 14px; transition: 0.18s; }
.addon-btn:hover { background: #1e293b; }

.input-suffix { display: flex; }
.input-suffix .field-input { border-radius: 8px 0 0 8px; flex: 1; }
.suffix-label { background: #f3f4f6; color: #6b7280; padding: 0 14px; display: flex; align-items: center; font-weight: 600; font-size: 13px; border-radius: 0 8px 8px 0; border: 1.5px solid #e8eaed; border-left: none; flex-shrink: 0; }

.type-tabs { display: flex; border: 1.5px solid #e8eaed; border-radius: 10px; overflow: hidden; margin-bottom: 14px; background: #f8f9fb; }
.type-tab { flex: 1; background: transparent; border: none; padding: 11px 8px; font-size: 13px; font-weight: 600; color: #9ca3af; cursor: pointer; transition: all 0.18s; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 7px; }
.type-tab + .type-tab { border-left: 1.5px solid #e8eaed; }
.type-tab--amber { background: #fff7ed !important; color: #c2410c !important; }
.type-tab--blue  { background: #eff6ff !important; color: #1d4ed8 !important; }
.type-tab--green { background: #f0fdf4 !important; color: #15803d !important; }

.info-note { border-radius: 8px; padding: 12px 14px; font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 9px; }
.note--green { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }

.select-wrapper { position: relative; }
.select-wrapper .field-select { padding-right: 36px; }
.select-arrow { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #9ca3af; font-size: 12px; pointer-events: none; }

/* Multi-select */
.multi-select-box { border: 1.5px solid #e8eaed; border-radius: 8px; overflow-y: auto; max-height: 200px; background: #fff; }
.multi-select-box--tall { max-height: 240px; }
.multi-empty { padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; }
.multi-item { display: flex; align-items: center; gap: 10px; padding: 9px 13px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid #f8f9fb; }
.multi-item:last-child { border-bottom: none; }
.multi-item:hover { background: #f8f9fb; }
.multi-item--checked { background: #fff7ed; }
.multi-item--checked:hover { background: #ffedd5; }
.multi-checkbox { display: none; }
.multi-icon { width: 28px; height: 28px; border-radius: 7px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #9ca3af; flex-shrink: 0; }
.multi-item--checked .multi-icon { background: #fff7ed; color: #f97316; }
.multi-label { font-size: 13px; font-weight: 500; color: #1a1d23; flex: 1; }
.multi-label-group { display: flex; flex-direction: column; flex: 1; }
.multi-sub   { font-size: 11px; color: #9ca3af; }
.multi-check { color: #9ca3af; font-size: 14px; opacity: 0; transition: opacity 0.15s; }
.multi-item--checked .multi-check { opacity: 1; color: #f97316; }

/* ── Multi-select footer (NGOÀI multi-select-box) ── */
.ms-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 13px;
  border: 1.5px solid #e8eaed;
  border-top: none;
  border-radius: 0 0 8px 8px;
  background: #f8f9fb;
}
.ms-footer-count { font-size: 12px; color: #6b7280; }
.ms-footer-count b { color: #f97316; font-weight: 700; }
.ms-confirm-btn {
  display: inline-flex; align-items: center; gap: 5px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: #fff; border: none; border-radius: 7px;
  padding: 6px 14px; font-size: 12px; font-weight: 600;
  font-family: inherit; cursor: pointer; transition: all 0.18s;
  box-shadow: 0 2px 6px rgba(249,115,22,0.25);
}
.ms-confirm-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(249,115,22,0.35); }

/* ── Reopen bar (hiện sau khi xác nhận) ── */
.ms-reopen {
  display: flex; align-items: center; justify-content: space-between;
  border: 1.5px solid #e8eaed; border-radius: 8px;
  padding: 10px 13px; background: #f8f9fb;
}
.ms-reopen-info { display: flex; align-items: center; gap: 7px; font-size: 13px; color: #374151; }
.ms-reopen-info i { color: #f97316; }
.ms-reopen-info b { color: #f97316; }
.ms-reopen-btn {
  background: none; border: 1.5px solid #e8eaed;
  border-radius: 7px; color: #6b7280;
  font-size: 12px; font-weight: 600; cursor: pointer;
  display: inline-flex; align-items: center; gap: 4px;
  font-family: inherit; padding: 5px 11px; transition: all 0.18s;
}
.ms-reopen-btn:hover { border-color: #f97316; color: #f97316; background: #fff7ed; }

/* Loading inline */
.loading-inline { font-size: 11px; color: #f97316; font-weight: 500; }
.spin { animation: spin 0.8s linear infinite; display: inline-block; }

/* Search inline */
.search-inline { display: flex; align-items: center; gap: 8px; border: 1.5px solid #e8eaed; border-radius: 8px 8px 0 0; padding: 8px 12px; background: #f8f9fb; border-bottom: none; }
.search-inline i { color: #9ca3af; font-size: 12px; }
.search-inline input { border: none; outline: none; background: transparent; font-size: 13px; flex: 1; color: #111827; font-family: inherit; }
.search-inline + .multi-select-box { border-top: none; border-radius: 0 0 8px 8px; }

/* Toggle switch */
.toggle-row { display: flex; align-items: center; gap: 12px; border: 1.5px solid #e8eaed; border-radius: 8px; padding: 10px 13px; background: #f8f9fb; cursor: pointer; transition: border-color 0.18s; }
.toggle-row:hover { border-color: #f97316; }
.toggle-switch-wrap { flex-shrink: 0; }
.toggle-switch-input { display: none; }
.toggle-switch { display: block; width: 38px; height: 22px; background: #d1d5db; border-radius: 100px; cursor: pointer; position: relative; transition: background 0.2s; }
.toggle-switch::after { content: ''; position: absolute; width: 16px; height: 16px; background: #fff; border-radius: 50%; top: 3px; left: 3px; transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.15); }
.toggle-switch-input:checked + .toggle-switch { background: #f97316; }
.toggle-switch-input:checked + .toggle-switch::after { transform: translateX(16px); }
.toggle-name { font-size: 13px; font-weight: 600; color: #111827; margin: 0; }
.toggle-desc { font-size: 11px; color: #9ca3af; margin: 2px 0 0; }

/* Form error */
.form-error { display: flex; align-items: center; gap: 8px; background: #fff1f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 11px 14px; font-size: 13px; color: #dc2626; font-weight: 500; margin-top: 14px; }

/* Modal actions */
.modal-actions { display: flex; gap: 10px; border-top: 1px solid #f0f1f3; padding-top: 18px; margin-top: 22px; }
.btn-cancel { flex: 1; background: #f8f9fb; border: 1.5px solid #e8eaed; border-radius: 10px; padding: 11px; font-weight: 600; color: #6b7280; cursor: pointer; font-size: 13px; font-family: inherit; transition: all 0.18s; }
.btn-cancel:hover { border-color: #374151; color: #374151; background: #f0f1f3; }
.btn-submit { flex: 1.5; background: linear-gradient(135deg, #f97316, #ea580c); border: none; border-radius: 10px; padding: 11px; font-weight: 600; color: #fff; cursor: pointer; font-size: 13px; font-family: inherit; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 2px 8px rgba(249,115,22,0.3); }
.btn-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(249,115,22,0.4); }
.btn-submit:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
.spinner { width: 15px; height: 15px; border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }

/* Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }

/* Transitions */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.22s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-slide-enter-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-slide-leave-active { transition: all 0.2s ease; }
.modal-slide-enter-from { opacity: 0; transform: scale(0.94) translateY(18px); }
.modal-slide-leave-to   { opacity: 0; transform: scale(0.97) translateY(8px); }
</style>