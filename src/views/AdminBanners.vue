<template>
  <div class="bm-root font-general">

    <!-- ── HEADER ── -->
    <div class="bm-header">
      <div>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb mb-1 small">
            <li class="breadcrumb-item"><router-link to="/" class="text-muted text-decoration-none">Tổng quan</router-link></li>
            <li class="breadcrumb-item"><router-link to="/settings" class="text-muted text-decoration-none">Giao diện</router-link></li>
            <li class="breadcrumb-item active fw-semibold" aria-current="page">Quản lý Banner</li>
          </ol>
        </nav>
        <h4 class="bm-page-title mb-0">
          <i class="bi bi-images me-2"></i>Banner & Slider
        </h4>
        <p class="text-muted small mb-0 mt-1">Quản lý toàn bộ ảnh, slider và video trên website</p>
      </div>
      <div class="d-flex align-items-center gap-2">
        <span class="bm-stat-badge">
          <i class="bi bi-collection me-1"></i>{{ banners.length }} banner
        </span>
      </div>
    </div>

    <div class="row g-4">

      <!-- ══════════════════════════ DANH SÁCH ══════════════════════════ -->
      <div class="col-xl-8">
        <div class="bm-card h-100 d-flex flex-column">

          <!-- Thanh filter -->
          <div class="bm-card-header">
            <div class="d-flex flex-wrap gap-2 align-items-center">
              <button v-for="pos in ['ALL', ...POSITIONS.map(p => p.value)]" :key="pos"
                      class="bm-filter-btn"
                      :class="{ active: filterPosition === pos }"
                      @click="filterPosition = pos; currentPage = 1">
                <span v-if="pos !== 'ALL'" class="bm-pos-dot" :style="{ background: BADGE_HEX[pos] || '#888' }"></span>
                {{ pos === 'ALL' ? 'Tất cả' : getPosName(pos) }}
                <span class="bm-filter-count">
                  {{ pos === 'ALL' ? banners.length : banners.filter(b => b.viTri === pos).length }}
                </span>
              </button>
            </div>

            <div class="d-flex align-items-center gap-2 mt-2">
              <button v-if="selectedBanners.length > 0"
                      class="btn btn-sm btn-danger rounded-pill px-3"
                      @click="deleteSelectedBanners">
                <i class="bi bi-trash me-1"></i>Xóa {{ selectedBanners.length }} mục
              </button>
              <span class="ms-auto text-muted small">{{ filteredBanners.length }} kết quả</span>
            </div>
          </div>

          <!-- Table -->
          <div class="table-responsive flex-grow-1 px-1">
            <table class="bm-table">
              <thead>
                <tr>
                  <th style="width:36px;">
                    <input class="bm-check" type="checkbox" v-model="selectAll" title="Chọn tất cả">
                  </th>
                  <th>Hình ảnh / Nội dung</th>
                  <th>Vị trí</th>
                  <th class="text-center">Thứ tự</th>
                  <th class="text-center">Hiển thị</th>
                  <th class="text-end">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="banner in paginatedBanners" :key="banner.id" class="bm-row">
                  <td>
                    <input class="bm-check" type="checkbox" :value="banner.id" v-model="selectedBanners">
                  </td>

                  <!-- Thumb -->
                  <td>
                    <div class="bm-thumb-cell">
                      <!-- VIDEO -->
                      <div v-if="banner.viTri === 'HOME_VIDEO'" class="bm-thumb bm-thumb--video">
                        <i class="bi bi-youtube"></i>
                      </div>
                      <!-- IMAGE -->
                      <div v-else class="bm-thumb">
                        <img :src="banner.duongDanAnh" :alt="banner.tieuDe || 'Banner'">
                        <div class="bm-thumb-overlay">
                          <i class="bi bi-zoom-in"></i>
                        </div>
                      </div>
                      <div class="bm-thumb-info">
                        <span class="bm-thumb-name">{{ banner.tieuDe || 'Không tên' }}</span>
                        <span v-if="banner.lienKet && banner.viTri !== 'HOME_VIDEO'"
                              class="bm-thumb-link">
                          <i class="bi bi-link-45deg"></i>{{ banner.lienKet }}
                        </span>
                        <span v-if="banner.viTri === 'HOME_VIDEO'" class="bm-thumb-link">
                          <i class="bi bi-youtube text-danger"></i> YouTube Embed
                        </span>
                      </div>
                    </div>
                  </td>

                  <!-- Vị trí -->
                  <td>
                    <span class="bm-pos-tag" :style="{ background: BADGE_HEX[banner.viTri] + '22', color: BADGE_HEX[banner.viTri], borderColor: BADGE_HEX[banner.viTri] + '55' }">
                      {{ getPositionName(banner.viTri) }}
                    </span>
                    <div class="bm-ratio-hint mt-1">
                      <i class="bi bi-aspect-ratio me-1"></i>{{ POSITION_RATIO[banner.viTri] || '—' }}
                    </div>
                  </td>

                  <!-- Thứ tự -->
                  <td class="text-center">
                    <span class="bm-order-badge">{{ banner.thuTu }}</span>
                  </td>

                  <!-- Toggle -->
                  <td class="text-center">
                    <div class="bm-switch" :class="{ on: banner.trangThai }" @click="toggleStatus(banner)" role="switch">
                      <div class="bm-switch-knob"></div>
                    </div>
                  </td>

                  <!-- Actions -->
                  <td class="text-end">
                    <div class="bm-actions">
                      <button class="bm-action-btn bm-action-btn--edit"
                              title="Chỉnh sửa"
                              data-bs-toggle="modal" data-bs-target="#editBannerModal"
                              @click="openEditModal(banner)">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button class="bm-action-btn bm-action-btn--delete"
                              title="Xóa" @click="deleteBanner(banner.id)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="paginatedBanners.length === 0">
                  <td colspan="6" class="bm-empty">
                    <i class="bi bi-images"></i>
                    <span>Chưa có banner nào. Hãy thêm mới!</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="bm-pagination" v-if="totalPages > 1">
            <span class="text-muted small">{{ startIndex + 1 }}–{{ endIndex }} / {{ filteredBanners.length }}</span>
            <div class="d-flex gap-1">
              <button class="bm-page-btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
                <i class="bi bi-chevron-left"></i>
              </button>
              <button v-for="page in totalPages" :key="page"
                      class="bm-page-btn" :class="{ active: currentPage === page }"
                      @click="changePage(page)">{{ page }}</button>
              <button class="bm-page-btn" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════ FORM THÊM MỚI ══════════════════════════ -->
      <div class="col-xl-4">
        <div class="bm-card bm-form-sticky">
          <div class="bm-card-header pb-3">
            <h6 class="fw-bold mb-0 d-flex align-items-center gap-2">
              <span class="bm-form-icon"><i class="bi bi-plus-lg"></i></span>
              Thêm Banner / Slider mới
            </h6>
          </div>

          <form @submit.prevent="submitBanner" class="px-1">

            <!-- Vị trí -->
            <div class="bm-field">
              <label class="bm-label">Vị trí hiển thị <span class="text-danger">*</span></label>
              <select class="bm-select" v-model="newBanner.viTri" required>
                <optgroup v-for="group in POSITION_GROUPS" :key="group.label" :label="group.label">
                  <option v-for="pos in group.items" :key="pos.value" :value="pos.value">
                    {{ pos.label }}
                  </option>
                </optgroup>
              </select>
            </div>

            <!-- Info box thông minh cho vị trí đã chọn -->
            <div v-if="newBanner.viTri" class="bm-pos-info-box">
              <!-- Aspect ratio preview -->
              <div class="bm-ratio-preview-row">
                <div class="bm-ratio-frame-wrap">
                  <div class="bm-ratio-frame"
                       :style="getRatioStyle(newBanner.viTri)">
                    <i v-if="newBanner.viTri === 'HOME_VIDEO'" class="bi bi-youtube bm-ratio-icon-yt"></i>
                    <i v-else class="bi bi-image bm-ratio-icon"></i>
                    <span class="bm-ratio-label-inner">{{ POSITION_RATIO[newBanner.viTri] || '?' }}</span>
                  </div>
                </div>
                <div class="bm-ratio-meta">
                  <span class="bm-ratio-tag">
                    <i class="bi bi-aspect-ratio me-1"></i>{{ POSITION_RATIO[newBanner.viTri] || 'Tự do' }}
                  </span>
                  <p class="bm-pos-info-text mb-0">{{ POSITION_INFO[newBanner.viTri] || '' }}</p>
                  <div v-if="POSITION_SIZE_HINT[newBanner.viTri]" class="bm-size-hint mt-1">
                    <i class="bi bi-rulers me-1"></i>{{ POSITION_SIZE_HINT[newBanner.viTri] }}
                  </div>
                </div>
              </div>
            </div>

            <!-- INPUT VIDEO -->
            <div v-if="newBanner.viTri === 'HOME_VIDEO'" class="bm-field">
              <label class="bm-label">YouTube Embed URL <span class="text-danger">*</span></label>
              <input type="url" class="bm-input" v-model="newBanner.youtubeUrl"
                     placeholder="https://www.youtube.com/embed/xxxxxx" required>
              <div class="bm-hint">Chia sẻ → Nhúng → lấy src trong thẻ iframe</div>
              <div v-if="newBanner.youtubeUrl" class="bm-yt-preview">
                <iframe :src="newBanner.youtubeUrl" frameborder="0" allowfullscreen></iframe>
              </div>
            </div>

            <!-- INPUT ẢNH -->
            <div v-else class="bm-field">
              <label class="bm-label">Hình ảnh tải lên <span class="text-danger">*</span></label>

              <!-- Drop zone -->
              <div class="bm-dropzone"
                   :class="{ 'bm-dropzone--active': isDragging, 'bm-dropzone--filled': previewImages.length > 0 }"
                   @dragover.prevent="isDragging = true"
                   @dragleave="isDragging = false"
                   @drop.prevent="handleDrop"
                   @click="$refs.fileInputRef.click()">
                <template v-if="previewImages.length === 0">
                  <i class="bi bi-cloud-arrow-up bm-dz-icon"></i>
                  <span class="bm-dz-text">Kéo thả hoặc <strong>click để chọn ảnh</strong></span>
                  <span class="bm-dz-hint">{{ isSingleUploadPosition ? 'Chỉ 1 ảnh cho vị trí này' : 'Có thể chọn nhiều ảnh' }}</span>
                  <!-- Aspect ratio guide trong dropzone -->
                  <div v-if="newBanner.viTri && POSITION_RATIO[newBanner.viTri]" class="bm-dz-ratio-guide">
                    <i class="bi bi-aspect-ratio me-1"></i>Khuyến nghị: <strong>{{ POSITION_RATIO[newBanner.viTri] }}</strong>
                    <span v-if="POSITION_SIZE_HINT[newBanner.viTri]" class="ms-1 text-muted">({{ POSITION_SIZE_HINT[newBanner.viTri] }})</span>
                  </div>
                </template>
                <template v-else>
                  <div class="bm-preview-grid">
                    <div v-for="(img, idx) in previewImages" :key="idx" class="bm-preview-item">
                      <img :src="img" alt="Preview">
                      <button type="button" class="bm-preview-remove" @click.stop="removeSelectedFile(idx)">
                        <i class="bi bi-x"></i>
                      </button>
                    </div>
                    <div v-if="!isSingleUploadPosition" class="bm-preview-add" @click.stop="$refs.fileInputRef.click()">
                      <i class="bi bi-plus-lg"></i>
                    </div>
                  </div>
                </template>
              </div>
              <input type="file" ref="fileInputRef" class="d-none"
                     @change="handleFileUpload" accept="image/*"
                     :multiple="!isSingleUploadPosition"
                     :required="previewImages.length === 0">
            </div>

            <!-- Tiêu đề -->
            <div class="bm-field">
              <label class="bm-label">Tiêu đề <span class="text-muted fw-normal">(ghi nhớ nội bộ)</span></label>
              <input type="text" class="bm-input" v-model="newBanner.tieuDe" placeholder="VD: Banner Tết 2025">
            </div>

            <!-- Link -->
            <div v-if="newBanner.viTri !== 'HOME_VIDEO'" class="bm-field">
              <label class="bm-label">Link khi click</label>
              <div class="bm-input-group">
                <span class="bm-input-prefix"><i class="bi bi-link-45deg"></i></span>
                <input type="text" class="bm-input bm-input--prefixed" v-model="newBanner.lienKet" placeholder="/san-pham/hot-deal">
              </div>
            </div>

            <!-- Thứ tự + Trạng thái -->
            <div class="row g-3 mb-3">
              <div class="col-6">
                <label class="bm-label">Thứ tự hiển thị</label>
                <input type="number" class="bm-input text-center" v-model="newBanner.thuTu" min="1">
              </div>
              <div class="col-6">
                <label class="bm-label">Trạng thái</label>
                <select class="bm-select" v-model="newBanner.trangThai">
                  <option :value="true">✅ Hiển thị</option>
                  <option :value="false">🙈 Ẩn</option>
                </select>
              </div>
            </div>

            <button type="submit" class="bm-submit-btn" :disabled="isUploading">
              <span v-if="isUploading" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-cloud-arrow-up me-2"></i>
              {{ isUploading ? 'Đang lưu...' : newBanner.viTri === 'HOME_VIDEO' ? 'Lưu Video' : `Lưu ${previewImages.length > 1 ? previewImages.length + ' ảnh' : 'Banner'}` }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════ MODAL CHỈNH SỬA ══════════════════════════ -->
    <div class="modal fade font-general" id="editBannerModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content bm-modal-content">
          <div class="bm-modal-header">
            <div>
              <h5 class="fw-bold mb-0">Chỉnh sửa Banner</h5>
              <p class="text-muted small mb-0 mt-1">{{ getPositionName(editBannerData.viTri) }}</p>
            </div>
            <button type="button" class="bm-modal-close" data-bs-dismiss="modal">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div class="modal-body p-4">
            <form @submit.prevent="updateBanner">
              <div class="row g-4">
                <!-- Cột trái: preview -->
                <div class="col-md-5">
                  <!-- VIDEO -->
                  <div v-if="editBannerData.viTri === 'HOME_VIDEO'">
                    <label class="bm-label">YouTube Embed URL</label>
                    <input type="url" class="bm-input mb-3" v-model="editBannerData.lienKet"
                           placeholder="https://www.youtube.com/embed/xxxxxx">
                    <div v-if="editBannerData.lienKet" class="bm-yt-preview">
                      <iframe :src="editBannerData.lienKet" frameborder="0" allowfullscreen></iframe>
                    </div>
                  </div>

                  <!-- IMAGE -->
                  <div v-else>
                    <label class="bm-label">Hình ảnh</label>
                    <!-- Ratio info cho edit -->
                    <div v-if="editBannerData.viTri" class="bm-edit-ratio-info mb-2">
                      <i class="bi bi-aspect-ratio me-1"></i>
                      Tỷ lệ khuyến nghị: <strong>{{ POSITION_RATIO[editBannerData.viTri] || 'Tự do' }}</strong>
                      <span v-if="POSITION_SIZE_HINT[editBannerData.viTri]" class="text-muted ms-1">({{ POSITION_SIZE_HINT[editBannerData.viTri] }})</span>
                    </div>
                    <div class="bm-edit-img-preview">
                      <img :src="editPreviewImage" alt="Preview">
                      <div class="bm-edit-img-overlay" @click="$refs.editFileInputEl.click()">
                        <i class="bi bi-camera-fill"></i>
                        <span>Đổi ảnh</span>
                      </div>
                    </div>
                    <input type="file" ref="editFileInputEl" class="d-none"
                           @change="handleEditFileUpload" accept="image/*">
                    <button type="button" class="bm-change-img-btn mt-2"
                            @click="$refs.editFileInputEl.click()">
                      <i class="bi bi-camera me-1"></i>Thay ảnh mới
                    </button>
                  </div>
                </div>

                <!-- Cột phải: fields -->
                <div class="col-md-7">
                  <div class="bm-field">
                    <label class="bm-label">Tiêu đề</label>
                    <input type="text" class="bm-input" v-model="editBannerData.tieuDe">
                  </div>

                  <div v-if="editBannerData.viTri !== 'HOME_VIDEO'" class="bm-field">
                    <label class="bm-label">Link khi click</label>
                    <div class="bm-input-group">
                      <span class="bm-input-prefix"><i class="bi bi-link-45deg"></i></span>
                      <input type="text" class="bm-input bm-input--prefixed" v-model="editBannerData.lienKet">
                    </div>
                  </div>

                  <div class="bm-field">
                    <label class="bm-label">Vị trí</label>
                    <select class="bm-select" v-model="editBannerData.viTri">
                      <option v-for="pos in POSITIONS" :key="pos.value" :value="pos.value">{{ pos.label }}</option>
                    </select>
                  </div>

                  <div class="row g-3">
                    <div class="col-6">
                      <label class="bm-label">Thứ tự</label>
                      <input type="number" class="bm-input text-center" v-model="editBannerData.thuTu" min="1">
                    </div>
                    <div class="col-6">
                      <label class="bm-label">Trạng thái</label>
                      <select class="bm-select" v-model="editBannerData.trangThai">
                        <option :value="true">✅ Hiển thị</option>
                        <option :value="false">🙈 Ẩn</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div class="d-flex gap-2 mt-4 pt-3 border-top">
                <button type="button" class="bm-modal-cancel flex-1" data-bs-dismiss="modal">Hủy bỏ</button>
                <button type="submit" class="bm-submit-btn flex-1" :disabled="isUploading" data-bs-dismiss="modal">
                  <span v-if="isUploading" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-check2 me-1"></i>
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { bannerService } from '@/services/bannerService';
import { useToast } from 'vue-toastification';
import { API_BASE } from '@/config/api';

const toast = useToast();
const showToast = (msg, type = 'success') => {
  if (type === 'success') toast.success(msg);
  else if (type === 'danger') toast.error(msg);
  else toast.info(msg);
};

// ══════════════ CONFIG VỊ TRÍ ══════════════
const POSITIONS = [
  { value: 'HOME',             label: 'Trang chủ – Slider chính' },
  { value: 'HOME_VIDEO',       label: 'Trang chủ – Video YouTube' },
  { value: 'HOME_RIGHT_TOP',   label: 'Trang chủ – Ảnh phải trên' },
  { value: 'HOME_RIGHT_BTM1',  label: 'Trang chủ – Ảnh phải dưới trái' },
  { value: 'HOME_RIGHT_BTM2',  label: 'Trang chủ – Ảnh phải dưới phải' },
  { value: 'SIDE_BAT_COM',     label: 'Banner side – Bát Cơm' },
  { value: 'SIDE_COC_SU',      label: 'Banner side – Cốc Sứ Long Phương' },
  { value: 'SIDE_BAT_DIA',     label: 'Banner side – Bộ Bát Đĩa Long Phương' },
  { value: 'BANNER_QUA_TANG',  label: 'Banner – Quà Tặng Doanh Nghiệp' },
  { value: 'CATEGORY_DETAIL',  label: 'Danh mục chi tiết' },
  { value: 'HOT_DEAL',         label: 'Hot Deal' },
];

const POSITION_GROUPS = [
  { label: '🏠 Trang Chủ – Slider & Video',
    items: POSITIONS.filter(p => ['HOME','HOME_VIDEO','HOME_RIGHT_TOP','HOME_RIGHT_BTM1','HOME_RIGHT_BTM2'].includes(p.value)) },
  { label: '📦 Banner Side Danh Mục',
    items: POSITIONS.filter(p => ['SIDE_BAT_COM','SIDE_COC_SU','SIDE_BAT_DIA'].includes(p.value)) },
  { label: '🎁 Quà Tặng & Khuyến Mãi',
    items: POSITIONS.filter(p => ['BANNER_QUA_TANG','HOT_DEAL'].includes(p.value)) },
  { label: '📑 Trang Danh Mục',
    items: POSITIONS.filter(p => ['CATEGORY_DETAIL'].includes(p.value)) },
];

// Tỷ lệ khung hình cho từng vị trí (width:height)
const POSITION_RATIO = {
  HOME:            '16:5',
  HOME_VIDEO:      '16:9',
  HOME_RIGHT_TOP:  '16:5',
  HOME_RIGHT_BTM1: '1:1',
  HOME_RIGHT_BTM2: '1:1',
  SIDE_BAT_COM:    '3:4',
  SIDE_COC_SU:     '3:4',
  SIDE_BAT_DIA:    '3:4',
  BANNER_QUA_TANG: '21:5',
  CATEGORY_DETAIL: '16:4',
  HOT_DEAL:        '16:5',
};

// Gợi ý kích thước pixel
const POSITION_SIZE_HINT = {
  HOME:            '1920×600px',
  HOME_VIDEO:      '—',
  HOME_RIGHT_TOP:  '800×250px',
  HOME_RIGHT_BTM1: '400×400px',
  HOME_RIGHT_BTM2: '400×400px',
  SIDE_BAT_COM:    '300×400px',
  SIDE_COC_SU:     '300×400px',
  SIDE_BAT_DIA:    '300×400px',
  BANNER_QUA_TANG: '1260×300px',
  CATEGORY_DETAIL: '1440×360px',
  HOT_DEAL:        '1920×600px',
};

const POSITION_INFO = {
  HOME_VIDEO:       'Video YouTube giữa trang chủ. Chỉ 1 video được hiển thị.',
  HOME_RIGHT_TOP:   'Ảnh lớn phía trên bên phải khối video.',
  HOME_RIGHT_BTM1:  'Ảnh dưới bên trái cạnh video.',
  HOME_RIGHT_BTM2:  'Ảnh dưới bên phải cạnh video.',
  SIDE_BAT_COM:     'Ảnh nền banner side khu Bát Cơm.',
  SIDE_COC_SU:      'Ảnh nền banner side khu Cốc Sứ.',
  SIDE_BAT_DIA:     'Ảnh nền banner side khu Bộ Bát Đĩa.',
  BANNER_QUA_TANG:  'Ảnh banner full-width khu Quà Tặng Doanh Nghiệp.',
  HOME:             'Slider tự động trên đầu trang chủ (tự chuyển mỗi 5 giây).',
  CATEGORY_DETAIL:  'Carousel ở đầu trang danh mục chi tiết.',
  HOT_DEAL:         'Banner đầu trang Hot Deal.',
};

// Màu hex cho badge vị trí
const BADGE_HEX = {
  HOME:            '#3b82f6',
  HOME_VIDEO:      '#ef4444',
  HOME_RIGHT_TOP:  '#f59e0b',
  HOME_RIGHT_BTM1: '#f59e0b',
  HOME_RIGHT_BTM2: '#f59e0b',
  SIDE_BAT_COM:    '#22c55e',
  SIDE_COC_SU:     '#22c55e',
  SIDE_BAT_DIA:    '#22c55e',
  BANNER_QUA_TANG: '#06b6d4',
  CATEGORY_DETAIL: '#8b5cf6',
  HOT_DEAL:        '#ef4444',
};

const SINGLE_SLOTS = ['HOME_VIDEO','HOME_RIGHT_TOP','HOME_RIGHT_BTM1','HOME_RIGHT_BTM2',
                      'SIDE_BAT_COM','SIDE_COC_SU','SIDE_BAT_DIA','BANNER_QUA_TANG'];

// Tính style cho preview khung tỷ lệ
const getRatioStyle = (viTri) => {
  const r = POSITION_RATIO[viTri];
  if (!r) return { width: '60px', height: '60px' };
  const [w, h] = r.split(':').map(Number);
  const maxW = 80, maxH = 80;
  let pw = maxW, ph = Math.round(maxW * h / w);
  if (ph > maxH) { ph = maxH; pw = Math.round(maxH * w / h); }
  return { width: pw + 'px', height: ph + 'px' };
};

// ══════════════ STATE ══════════════
const banners       = ref([]);
const isUploading   = ref(false);
const filterPosition = ref('ALL');
const isDragging    = ref(false);

const fetchBanners = async () => {
  try {
    const data = await bannerService.getAllBanners();
    if (Array.isArray(data)) {
      banners.value = data.sort((a, b) => {
        if (a.viTri !== b.viTri) return (a.viTri || '').localeCompare(b.viTri || '');
        return (a.thuTu || 0) - (b.thuTu || 0);
      });
    }
  } catch { showToast('Không thể kết nối đến máy chủ!', 'danger'); }
};
onMounted(() => fetchBanners());

// ══════════════ FILTER & PHÂN TRANG ══════════════
const filteredBanners = computed(() =>
  filterPosition.value === 'ALL' ? banners.value : banners.value.filter(b => b.viTri === filterPosition.value)
);
const currentPage  = ref(1);
const itemsPerPage = 6;
const totalPages   = computed(() => Math.max(Math.ceil(filteredBanners.value.length / itemsPerPage), 1));
const paginatedBanners = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredBanners.value.slice(start, start + itemsPerPage);
});
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex   = computed(() => Math.min(startIndex.value + itemsPerPage, filteredBanners.value.length));
const changePage = (page) => { if (page >= 1 && page <= totalPages.value) currentPage.value = page; };

// ══════════════ SELECT ALL & XÓA NHIỀU ══════════════
const selectedBanners = ref([]);
const selectAll = computed({
  get: () => paginatedBanners.value.length > 0 && paginatedBanners.value.every(b => selectedBanners.value.includes(b.id)),
  set: (val) => { selectedBanners.value = val ? paginatedBanners.value.map(b => b.id) : []; }
});

const deleteSelectedBanners = async () => {
  if (!confirm(`Xóa vĩnh viễn ${selectedBanners.value.length} banner đã chọn?`)) return;
  try {
    for (const id of selectedBanners.value) await bannerService.deleteBanner(id);
    showToast(`Đã xóa ${selectedBanners.value.length} banner`);
    selectedBanners.value = [];
    await fetchBanners();
    if (currentPage.value > totalPages.value) currentPage.value = Math.max(totalPages.value, 1);
  } catch { showToast('Có lỗi khi xóa!', 'danger'); }
};

// ══════════════ FORM THÊM MỚI ══════════════
const fileInputRef  = ref(null);
const selectedFiles = ref([]);
const previewImages = ref([]);
const newBanner     = ref({ tieuDe: '', lienKet: '', youtubeUrl: '', thuTu: 1, trangThai: true, viTri: 'HOME' });

const isSingleUploadPosition = computed(() => SINGLE_SLOTS.includes(newBanner.value.viTri));

const handleFileUpload = (event) => {
  let files = Array.from(event.target.files);
  if (isSingleUploadPosition.value) files = files.slice(0, 1);
  selectedFiles.value = files;
  previewImages.value = files.map(f => URL.createObjectURL(f));
};

const handleDrop = (event) => {
  isDragging.value = false;
  let files = Array.from(event.dataTransfer.files).filter(f => f.type.startsWith('image/'));
  if (isSingleUploadPosition.value) files = files.slice(0, 1);
  selectedFiles.value = files;
  previewImages.value = files.map(f => URL.createObjectURL(f));
};

const removeSelectedFile = (idx) => {
  selectedFiles.value.splice(idx, 1);
  previewImages.value.splice(idx, 1);
  if (selectedFiles.value.length === 0 && fileInputRef.value) fileInputRef.value.value = '';
};

const resetForm = () => {
  newBanner.value = { tieuDe: '', lienKet: '', youtubeUrl: '', thuTu: banners.value.length + 1, trangThai: true, viTri: 'HOME' };
  selectedFiles.value = [];
  previewImages.value = [];
  if (fileInputRef.value) fileInputRef.value.value = '';
};

const submitBanner = async () => {
  isUploading.value = true;
  try {
    if (newBanner.value.viTri === 'HOME_VIDEO') {
      if (!newBanner.value.youtubeUrl) { showToast('Vui lòng nhập YouTube URL!', 'danger'); return; }
      await bannerService.createBanner({
        tieuDe: newBanner.value.tieuDe || 'Video Trang Chủ',
        duongDanAnh: 'https://img.youtube.com/vi/default/hqdefault.jpg',
        lienKet: newBanner.value.youtubeUrl,
        thuTu: Number(newBanner.value.thuTu),
        trangThai: newBanner.value.trangThai,
        viTri: 'HOME_VIDEO',
      });
      showToast('Đã lưu video thành công!');
    } else {
      if (selectedFiles.value.length === 0) { showToast('Vui lòng chọn hình ảnh!', 'danger'); return; }
      const baseTitle  = newBanner.value.tieuDe || 'Banner';
      const isMultiple = selectedFiles.value.length > 1;
      for (let i = 0; i < selectedFiles.value.length; i++) {
        const urlPath = await bannerService.uploadImage(selectedFiles.value[i]);
        await bannerService.createBanner({
          tieuDe: isMultiple ? `${baseTitle} - Phần ${i + 1}` : baseTitle,
          duongDanAnh: `${API_BASE}` + urlPath,
          lienKet: newBanner.value.lienKet,
          thuTu: Number(newBanner.value.thuTu) + i,
          trangThai: newBanner.value.trangThai,
          viTri: newBanner.value.viTri,
        });
      }
      showToast(`Đã lưu ${selectedFiles.value.length} ảnh thành công!`);
    }
    resetForm();
    await fetchBanners();
  } catch { showToast('Lỗi khi lưu!', 'danger'); }
  finally { isUploading.value = false; }
};

// ══════════════ CHỈNH SỬA ══════════════
const editBannerData  = ref({});
const editPreviewImage = ref('');
const editFile         = ref(null);
const editFileInputEl  = ref(null);

const openEditModal = (banner) => {
  editBannerData.value  = { ...banner };
  editPreviewImage.value = banner.duongDanAnh;
  editFile.value = null;
};

const handleEditFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) { editFile.value = file; editPreviewImage.value = URL.createObjectURL(file); }
};

const updateBanner = async () => {
  isUploading.value = true;
  try {
    let hinhAnhUrl = editBannerData.value.duongDanAnh;
    if (editFile.value) {
      const urlPath = await bannerService.uploadImage(editFile.value);
      hinhAnhUrl = `${API_BASE}` + urlPath;
    }
    await bannerService.updateBanner(editBannerData.value.id, { ...editBannerData.value, duongDanAnh: hinhAnhUrl });
    showToast('Cập nhật thành công!');
    await fetchBanners();
  } catch { showToast('Lỗi khi cập nhật!', 'danger'); }
  finally { isUploading.value = false; }
};

// ══════════════ XÓA & TOGGLE ══════════════
const deleteBanner = async (id) => {
  if (!confirm('Xóa banner này?')) return;
  try {
    await bannerService.deleteBanner(id);
    showToast('Đã xóa banner');
    await fetchBanners();
    if (currentPage.value > totalPages.value) currentPage.value = Math.max(totalPages.value, 1);
  } catch { showToast('Xóa thất bại!', 'danger'); }
};

const toggleStatus = async (banner) => {
  try {
    await bannerService.toggleStatus(banner.id);
    banner.trangThai = !banner.trangThai;
    showToast(`Đã ${banner.trangThai ? 'hiển thị' : 'ẩn'} banner`);
  } catch {
    banner.trangThai = !banner.trangThai;
    showToast('Không thể đổi trạng thái', 'danger');
  }
};

// ══════════════ UTILS ══════════════
const getPosName      = (code) => POSITIONS.find(p => p.value === code)?.label || code;
const getPositionName = (code) => getPosName(code);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

/* ══════════════ ROOT & TOKENS ══════════════ */
.bm-root {
  font-family: 'DM Sans', 'Quicksand', sans-serif;
  --bm-green:      #3d7a1e;
  --bm-green-light: #f0f7ea;
  --bm-green-mid:  #5b8e1d;
  --bm-border:     #e8ede4;
  --bm-surface:    #ffffff;
  --bm-bg:         #f4f7f2;
  --bm-text:       #1a2b10;
  --bm-text-muted: #6b7f60;
  --bm-radius:     14px;
  --bm-shadow:     0 2px 12px rgba(61,122,30,.07);
  --bm-shadow-md:  0 6px 24px rgba(61,122,30,.12);
  padding: 1.5rem;
  background: var(--bm-bg);
  min-height: 100vh;
}

/* ══════════════ HEADER ══════════════ */
.bm-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.75rem;
  padding-bottom: 1.25rem;
  border-bottom: 1.5px solid var(--bm-border);
}
.bm-page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--bm-text);
  letter-spacing: -0.3px;
}
.bm-stat-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--bm-green-light);
  color: var(--bm-green);
  border: 1px solid #c8e0b0;
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 0.82rem;
  font-weight: 600;
}

/* ══════════════ CARD ══════════════ */
.bm-card {
  background: var(--bm-surface);
  border-radius: var(--bm-radius);
  box-shadow: var(--bm-shadow);
  border: 1px solid var(--bm-border);
  overflow: hidden;
}
.bm-card-header {
  padding: 1.25rem 1.5rem 0.75rem;
  border-bottom: 1px solid var(--bm-border);
  background: #fbfdf9;
}
.bm-form-sticky {
  position: sticky;
  top: 80px;
}

/* ══════════════ FILTER TABS ══════════════ */
.bm-filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 30px;
  border: 1.5px solid var(--bm-border);
  background: white;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--bm-text-muted);
  cursor: pointer;
  transition: all .2s;
  white-space: nowrap;
}
.bm-filter-btn:hover {
  border-color: var(--bm-green);
  color: var(--bm-green);
}
.bm-filter-btn.active {
  background: var(--bm-green);
  border-color: var(--bm-green);
  color: white;
}
.bm-filter-count {
  background: rgba(255,255,255,.25);
  padding: 0 6px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 700;
}
.bm-filter-btn:not(.active) .bm-filter-count {
  background: var(--bm-green-light);
  color: var(--bm-green);
}
.bm-pos-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ══════════════ TABLE ══════════════ */
.bm-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}
.bm-table thead tr {
  background: #f9fdf7;
}
.bm-table thead th {
  padding: 12px 14px;
  color: var(--bm-text-muted);
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1.5px solid var(--bm-border);
  white-space: nowrap;
}
.bm-table tbody td {
  padding: 12px 14px;
  border-bottom: 1px solid #f2f6ef;
  vertical-align: middle;
}
.bm-row {
  transition: background .15s;
}
.bm-row:hover {
  background: #fbfef9;
}
.bm-row:last-child td {
  border-bottom: none;
}

/* Checkbox */
.bm-check {
  width: 16px;
  height: 16px;
  border: 1.5px solid #c8d8bc;
  border-radius: 4px;
  cursor: pointer;
  accent-color: var(--bm-green);
}

/* Thumbnail cell */
.bm-thumb-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}
.bm-thumb {
  width: 72px;
  height: 44px;
  border-radius: 8px;
  overflow: hidden;
  background: #f0f0f0;
  flex-shrink: 0;
  position: relative;
  border: 1px solid var(--bm-border);
}
.bm-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform .3s;
}
.bm-thumb:hover img {
  transform: scale(1.06);
}
.bm-thumb-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,.35);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  opacity: 0;
  transition: opacity .2s;
}
.bm-thumb:hover .bm-thumb-overlay {
  opacity: 1;
}
.bm-thumb--video {
  background: linear-gradient(135deg, #1a1a2e, #e50914);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.4rem;
}
.bm-thumb-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.bm-thumb-name {
  font-weight: 600;
  color: var(--bm-text);
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}
.bm-thumb-link {
  font-size: 0.73rem;
  color: var(--bm-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

/* Vị trí tag */
.bm-pos-tag {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 600;
  border: 1px solid;
  white-space: nowrap;
}
.bm-ratio-hint {
  font-size: 0.68rem;
  color: var(--bm-text-muted);
}

/* Thứ tự */
.bm-order-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--bm-green-light);
  color: var(--bm-green);
  border-radius: 50%;
  font-size: 0.78rem;
  font-weight: 700;
  border: 1.5px solid #c8e0b0;
}

/* Toggle switch */
.bm-switch {
  width: 40px;
  height: 22px;
  border-radius: 11px;
  background: #dde8d8;
  position: relative;
  cursor: pointer;
  transition: background .25s;
  margin: 0 auto;
}
.bm-switch.on {
  background: var(--bm-green);
}
.bm-switch-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 4px rgba(0,0,0,.2);
  transition: left .25s;
}
.bm-switch.on .bm-switch-knob {
  left: 21px;
}

/* Actions */
.bm-actions {
  display: flex;
  gap: 5px;
  justify-content: flex-end;
}
.bm-action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all .2s;
}
.bm-action-btn--edit {
  background: #eff8ff;
  border-color: #bfdbfe;
  color: #3b82f6;
}
.bm-action-btn--edit:hover {
  background: #3b82f6;
  color: white;
  transform: translateY(-1px);
}
.bm-action-btn--delete {
  background: #fff5f5;
  border-color: #fecaca;
  color: #ef4444;
}
.bm-action-btn--delete:hover {
  background: #ef4444;
  color: white;
  transform: translateY(-1px);
}

/* Empty state */
.bm-empty {
  padding: 3rem 1rem !important;
  text-align: center;
  color: var(--bm-text-muted);
}
.bm-empty i {
  font-size: 2.5rem;
  display: block;
  margin-bottom: .5rem;
  opacity: .25;
}
.bm-empty span {
  font-size: 0.9rem;
}

/* Pagination */
.bm-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--bm-border);
  background: #fbfdf9;
}
.bm-page-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1.5px solid var(--bm-border);
  background: white;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--bm-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .2s;
}
.bm-page-btn:hover:not(:disabled):not(.active) {
  border-color: var(--bm-green);
  color: var(--bm-green);
}
.bm-page-btn.active {
  background: var(--bm-green);
  border-color: var(--bm-green);
  color: white;
}
.bm-page-btn:disabled {
  opacity: .35;
  cursor: default;
}

/* ══════════════ FORM ELEMENTS ══════════════ */
.bm-form-icon {
  width: 28px;
  height: 28px;
  background: var(--bm-green);
  color: white;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
}
.bm-field {
  margin-bottom: 1rem;
}
.bm-label {
  display: block;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--bm-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 5px;
}
.bm-input, .bm-select {
  width: 100%;
  padding: 9px 13px;
  border: 1.5px solid var(--bm-border);
  border-radius: 10px;
  background: #fbfcf9;
  font-size: 0.875rem;
  color: var(--bm-text);
  font-family: inherit;
  transition: border-color .2s, box-shadow .2s, background .2s;
  outline: none;
  -webkit-appearance: none;
}
.bm-input:focus, .bm-select:focus {
  border-color: var(--bm-green);
  background: white;
  box-shadow: 0 0 0 3px rgba(91,142,29,.12);
}
.bm-input-group {
  display: flex;
  align-items: center;
  border: 1.5px solid var(--bm-border);
  border-radius: 10px;
  overflow: hidden;
  background: #fbfcf9;
  transition: border-color .2s, box-shadow .2s;
}
.bm-input-group:focus-within {
  border-color: var(--bm-green);
  box-shadow: 0 0 0 3px rgba(91,142,29,.12);
  background: white;
}
.bm-input-prefix {
  padding: 0 10px;
  color: var(--bm-text-muted);
  font-size: 1rem;
  flex-shrink: 0;
}
.bm-input--prefixed {
  border: none !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  padding-left: 0;
}
.bm-hint {
  font-size: 0.72rem;
  color: var(--bm-text-muted);
  margin-top: 4px;
}
.bm-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7f60' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
  cursor: pointer;
}

/* ══════════════ ASPECT RATIO INFO BOX ══════════════ */
.bm-pos-info-box {
  background: linear-gradient(135deg, #f4faf0, #eef7e7);
  border: 1.5px solid #c8e0b0;
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 1rem;
}
.bm-ratio-preview-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.bm-ratio-frame-wrap {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 8px;
  width: 96px;
  height: 96px;
  border: 1.5px solid #c8e0b0;
}
.bm-ratio-frame {
  background: linear-gradient(135deg, #e0f0d0, #c8e8b0);
  border-radius: 5px;
  border: 1.5px solid #9ecf70;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  transition: all .3s ease;
  position: relative;
}
.bm-ratio-icon {
  font-size: 0.9rem;
  color: var(--bm-green);
  opacity: .7;
}
.bm-ratio-icon-yt {
  font-size: 1rem;
  color: #ef4444;
}
.bm-ratio-label-inner {
  font-size: 0.62rem;
  font-weight: 800;
  color: var(--bm-green);
  letter-spacing: 0.5px;
  background: rgba(255,255,255,.7);
  padding: 1px 5px;
  border-radius: 4px;
  position: absolute;
  bottom: 3px;
}
.bm-ratio-meta {
  flex: 1;
  min-width: 0;
}
.bm-ratio-tag {
  display: inline-flex;
  align-items: center;
  background: var(--bm-green);
  color: white;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  margin-bottom: 5px;
}
.bm-pos-info-text {
  font-size: 0.78rem;
  color: var(--bm-text-muted);
  line-height: 1.45;
}
.bm-size-hint {
  font-size: 0.72rem;
  color: #7a9e5a;
  font-weight: 500;
  font-family: monospace;
}

/* ══════════════ DROPZONE ══════════════ */
.bm-dropzone {
  border: 2px dashed #c8e0b0;
  border-radius: 12px;
  background: #f9fdf6;
  min-height: 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 16px;
  cursor: pointer;
  transition: all .2s;
  text-align: center;
}
.bm-dropzone:hover,
.bm-dropzone--active {
  border-color: var(--bm-green);
  background: #f0f9ea;
}
.bm-dropzone--filled {
  border-style: solid;
  border-color: #c8e0b0;
  align-items: flex-start;
  min-height: unset;
}
.bm-dz-icon {
  font-size: 1.8rem;
  color: #a8cc8a;
}
.bm-dz-text {
  font-size: 0.82rem;
  color: var(--bm-text-muted);
}
.bm-dz-hint {
  font-size: 0.72rem;
  color: #aac490;
}
.bm-dz-ratio-guide {
  margin-top: 6px;
  font-size: 0.72rem;
  color: var(--bm-green);
  background: rgba(91,142,29,.1);
  padding: 3px 10px;
  border-radius: 20px;
}

/* Preview grid */
.bm-preview-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
}
.bm-preview-item {
  position: relative;
  width: 72px;
  height: 52px;
  border-radius: 7px;
  overflow: visible;
}
.bm-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 7px;
  border: 1.5px solid var(--bm-border);
}
.bm-preview-remove {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: none;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 1px 4px rgba(0,0,0,.2);
}
.bm-preview-add {
  width: 72px;
  height: 52px;
  border-radius: 7px;
  border: 2px dashed #c8e0b0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bm-green);
  font-size: 1.1rem;
  cursor: pointer;
  background: #f4faf0;
  transition: all .2s;
}
.bm-preview-add:hover {
  border-color: var(--bm-green);
  background: #e8f5de;
}

/* YouTube preview */
.bm-yt-preview {
  margin-top: 10px;
  border-radius: 10px;
  overflow: hidden;
  border: 1.5px solid var(--bm-border);
  aspect-ratio: 16/9;
}
.bm-yt-preview iframe {
  width: 100%;
  height: 100%;
  display: block;
}

/* Submit btn */
.bm-submit-btn {
  width: 100%;
  padding: 11px;
  background: linear-gradient(135deg, var(--bm-green-mid), var(--bm-green));
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .2s;
  box-shadow: 0 3px 10px rgba(91,142,29,.3);
}
.bm-submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #4a7516, var(--bm-green-mid));
  transform: translateY(-1px);
  box-shadow: 0 5px 14px rgba(91,142,29,.35);
}
.bm-submit-btn:disabled {
  opacity: .65;
  cursor: default;
  transform: none;
}

/* ══════════════ MODAL ══════════════ */
.bm-modal-content {
  border: none;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: var(--bm-shadow-md);
}
.bm-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.5rem;
  background: #f9fdf7;
  border-bottom: 1px solid var(--bm-border);
}
.bm-modal-close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: white;
  border: 1.5px solid var(--bm-border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--bm-text-muted);
  transition: all .2s;
}
.bm-modal-close:hover {
  background: #fee2e2;
  border-color: #fecaca;
  color: #ef4444;
}
.bm-modal-cancel {
  padding: 10px 20px;
  border: 1.5px solid var(--bm-border);
  background: white;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--bm-text-muted);
  cursor: pointer;
  transition: all .2s;
}
.bm-modal-cancel:hover {
  background: #f5f5f5;
}

/* Edit image preview */
.bm-edit-ratio-info {
  font-size: 0.75rem;
  color: var(--bm-green);
  background: var(--bm-green-light);
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid #c8e0b0;
}
.bm-edit-img-preview {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  border: 1.5px solid var(--bm-border);
  aspect-ratio: 16/8;
  background: #f0f0f0;
}
.bm-edit-img-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.bm-edit-img-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  gap: 4px;
  opacity: 0;
  cursor: pointer;
  transition: opacity .2s;
  font-size: 0.8rem;
  font-weight: 600;
}
.bm-edit-img-overlay i {
  font-size: 1.2rem;
}
.bm-edit-img-preview:hover .bm-edit-img-overlay {
  opacity: 1;
}
.bm-change-img-btn {
  width: 100%;
  padding: 7px;
  background: white;
  border: 1.5px solid var(--bm-border);
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--bm-text-muted);
  cursor: pointer;
  transition: all .2s;
}
.bm-change-img-btn:hover {
  border-color: var(--bm-green);
  color: var(--bm-green);
  background: var(--bm-green-light);
}

/* ══════════════ BREADCRUMB ══════════════ */
.breadcrumb-item + .breadcrumb-item::before {
  content: '›';
  color: #aac490;
}

/* ══════════════ RESPONSIVE ══════════════ */
@media (max-width: 991px) {
  .bm-form-sticky { position: static; }
  .bm-thumb-name { max-width: 120px; }
}
@media (max-width: 576px) {
  .bm-root { padding: 1rem; }
  .bm-header { flex-direction: column; gap: 10px; }
}
</style>