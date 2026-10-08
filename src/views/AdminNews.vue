<template>
  <div class="nm">

    <!-- ═══ LIST VIEW ═══ -->
    <div v-if="!isShowingForm" class="lv">

      <div class="lv-header">
        <div>
          <div class="lv-title">Tin tức & Sự kiện</div>
          <div class="lv-sub">Quản lý và xuất bản bài viết</div>
        </div>
        <div class="lv-actions">
          <button v-if="selectedPosts.length > 0" class="btn-danger" @click="deleteSelectedPosts">
            <i class="bi bi-trash3"></i> Xóa {{ selectedPosts.length }} bài
          </button>
          <button class="btn-primary" @click="openForm()">
            <i class="bi bi-plus-lg"></i> Đăng bài mới
          </button>
        </div>
      </div>

      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-n">{{ newsList.length }}</div>
          <div class="stat-l">Tổng bài viết</div>
        </div>
        <div class="stat-card">
          <div class="stat-n green">{{ publishedCount }}</div>
          <div class="stat-l">Đã xuất bản</div>
        </div>
        <div class="stat-card">
          <div class="stat-n amber">{{ draftCount }}</div>
          <div class="stat-l">Bản nháp</div>
        </div>
        <div class="stat-card">
          <div class="stat-n red">{{ featuredCount }}</div>
          <div class="stat-l">Đang nổi bật</div>
        </div>
      </div>

      <div class="toolbar">
        <div class="search-wrap">
          <i class="bi bi-search search-icon"></i>
          <input type="text" class="search-input" placeholder="Tìm kiếm bài viết..."
            v-model="searchQuery" @input="currentPage = 1">
        </div>
        <div class="filter-tabs">
          <button class="ftab" :class="{ active: activeFilter === 'all' }" @click="activeFilter='all'; currentPage=1">
            Tất cả ({{ newsList.length }})
          </button>
          <button class="ftab" :class="{ active: activeFilter === 'pub' }" @click="activeFilter='pub'; currentPage=1">
            Xuất bản ({{ publishedCount }})
          </button>
          <button class="ftab" :class="{ active: activeFilter === 'draft' }" @click="activeFilter='draft'; currentPage=1">
            Nháp ({{ draftCount }})
          </button>
        </div>
      </div>

      <div class="table-wrap">
        <table class="tbl">
          <thead>
            <tr>
              <th class="th-check">
                <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll">
              </th>
              <th>Bài viết</th>
              <th>Danh mục</th>
              <th>Trạng thái</th>
              <th>Ngày đăng</th>
              <th class="th-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedNews.length === 0">
              <td colspan="6" class="empty-row">
                <i class="bi bi-newspaper"></i>
                <p>Chưa có bài viết nào</p>
                <button class="btn-primary" style="margin-top:10px" @click="openForm()">
                  <i class="bi bi-plus-lg"></i> Viết bài đầu tiên
                </button>
              </td>
            </tr>
            <tr v-for="news in paginatedNews" :key="news.id"
              :class="{ 'row-selected': selectedPosts.includes(news.id) }">
              <td class="th-check">
                <input type="checkbox" :value="news.id" v-model="selectedPosts">
              </td>
              <td>
                <div class="post-cell">
                  <img class="post-img"
                    :src="getThumb(news)"
                    @error="e => e.target.src='https://dummyimage.com/56x40/f0ebe3/8a6a4a&text=?'">
                  <div>
                    <div class="post-name">{{ news.tieuDe || 'Chưa có tiêu đề' }}</div>
                    <div class="post-meta">
                      {{ news.danhMuc || '—' }} · {{ (news.luotXem || 0).toLocaleString() }} lượt xem
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <span class="cat-pill" :style="getCatStyle(news.danhMuc)">{{ news.danhMuc || 'Không rõ' }}</span>
              </td>
              <td>
                <span class="status-pill" :class="isPublished(news) ? 'pill-pub' : 'pill-draft'">
                  <span class="sdot"></span>
                  {{ isPublished(news) ? 'Xuất bản' : 'Nháp' }}
                </span>
                <span v-if="news.noiBat || news.NOI_BAT" class="pill-hot">
                  <i class="bi bi-star-fill" style="font-size:9px"></i> Nổi bật
                </span>
              </td>
              <td class="text-muted">{{ formatDate(news.ngayTao) }}</td>
              <td class="th-right">
                <div class="act-group">
                  <button class="act-btn" @click="openForm(news)" title="Chỉnh sửa">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="act-btn del" @click="deletePost(news.id)" title="Xóa">
                    <i class="bi bi-trash3"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="totalPages > 1" class="pager">
          <span class="pager-info">Trang {{ currentPage }}/{{ totalPages }} · {{ filteredNews.length }} bài</span>
          <div class="pager-btns">
            <button class="pg-btn" :disabled="currentPage===1" @click="currentPage--">
              <i class="bi bi-chevron-left"></i>
            </button>
            <button v-for="p in totalPages" :key="p" class="pg-btn"
              :class="{ active: currentPage===p }" @click="currentPage=p">{{ p }}</button>
            <button class="pg-btn" :disabled="currentPage===totalPages" @click="currentPage++">
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ FORM VIEW ═══ -->
    <div v-else class="fv">

      <!-- Top bar -->
      <div class="fv-topbar">
        <div class="fv-topbar-left">
          <button class="back-btn" @click="closeForm()"><i class="bi bi-arrow-left"></i></button>
          <div>
            <div class="fv-heading">{{ form.id ? 'Chỉnh sửa bài viết' : 'Soạn bài viết mới' }}</div>
            <div class="fv-sub">Điền theo từng bước · chỉ mất khoảng 3 phút</div>
          </div>
        </div>
        <div class="fv-topbar-right">
          <span class="hotkey-hint"><kbd>Ctrl</kbd><kbd>S</kbd> lưu nháp</span>
          <button class="btn-ghost" @click="savePost(false)">
            <i class="bi bi-floppy"></i> Lưu nháp
          </button>
          <button class="btn-primary" @click="savePost(true)" :disabled="!canPublish">
            <i class="bi bi-send"></i> Xuất bản
          </button>
        </div>
      </div>

      <!-- Steps progress bar -->
      <div class="steps-bar">
        <template v-for="(step, idx) in steps" :key="step.id">
          <div class="step-item"
            :class="{ active: currentStep===step.id, done: stepsCompleted.includes(step.id) }"
            @click="currentStep = step.id">
            <div class="step-num">
              <i v-if="stepsCompleted.includes(step.id)" class="bi bi-check-lg"></i>
              <span v-else>{{ idx+1 }}</span>
            </div>
            <div class="step-label">{{ step.label }}</div>
          </div>
          <div v-if="idx < steps.length-1" class="step-sep"></div>
        </template>
        <div style="flex:1"></div>
        <div class="req-summary">
          <i class="bi bi-ui-checks"></i>
          {{ completedFields }}/{{ requiredFields.length }} trường bắt buộc
        </div>
      </div>

      <div class="fv-body">

        <!-- ── MAIN COLUMN ── -->
        <div class="main-col">

          <!-- Bước 1: Nội dung -->
          <div class="section-card" v-show="currentStep==='content'">
            <div class="card-head">
              <div class="card-icon purple"><i class="bi bi-pencil-square"></i></div>
              <div class="card-title">Nội dung bài viết</div>
              <span class="card-step-badge">Bước 1/4</span>
            </div>
            <div class="card-body">

              <div class="field">
                <label class="flabel">Tiêu đề <span class="req">*</span></label>
                <input type="text" class="finput finput-title" v-model="form.tieuDe"
                  placeholder="Ví dụ: Top 5 xu hướng bếp 2025 bạn cần biết...">
                <div class="char-bar">
                  <div class="char-fill" :style="{ width: Math.min(form.tieuDe.length/70*100,100)+'%',
                    background: form.tieuDe.length>70 ? '#A32D2D' : '#3B6D11' }"></div>
                </div>
                <div class="fhint">
                  Tiêu đề hay: bắt đầu bằng số, câu hỏi hoặc lợi ích cụ thể
                  · <span :style="{ color: form.tieuDe.length>70 ? '#A32D2D':'inherit' }">
                    {{ form.tieuDe.length }}/70 ký tự lý tưởng
                  </span>
                </div>
              </div>

              <div class="field">
                <label class="flabel">Mô tả ngắn <span class="req">*</span></label>
                <textarea class="finput" rows="3" v-model="form.moTaNgan"
                  placeholder="Tóm tắt 1–2 câu — giúp người đọc quyết định có click vào không..."></textarea>
                <div class="field-footer">
                  <span class="fhint">Hiển thị trên trang chủ và kết quả tìm kiếm</span>
                  <span class="char-count" :class="{ warn: form.moTaNgan.length > 160 }">
                    {{ form.moTaNgan.length }}/160
                  </span>
                </div>
              </div>

              <div class="field">
                <label class="flabel">Nội dung chi tiết <span class="req">*</span></label>
                <div class="editor-wrap">
                  <QuillEditor theme="snow" v-model:content="form.noiDung"
                    contentType="html" toolbar="full" />
                </div>
              </div>

              <div class="tip-box">
                <i class="bi bi-lightbulb tip-icon"></i>
                <div class="tip-text">
                  <strong>Mẹo viết hiệu quả:</strong> Mỗi đoạn nên có 3–5 câu.
                  Dùng tiêu đề phụ để bài dễ đọc lướt. Thêm ít nhất 1 ảnh minh họa trong bài.
                </div>
              </div>

              <div class="step-nav">
                <div></div>
                <button class="btn-next" @click="currentStep='images'">
                  Tiếp theo: Hình ảnh <i class="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Bước 2: Hình ảnh -->
          <div class="section-card" v-show="currentStep==='images'">
            <div class="card-head">
              <div class="card-icon teal"><i class="bi bi-images"></i></div>
              <div class="card-title">Hình ảnh</div>
              <span class="card-step-badge">Bước 2/4</span>
            </div>
            <div class="card-body">

              <div class="field">
                <label class="flabel">Ảnh đại diện</label>
                <input type="file" ref="fileInput" class="d-none" accept="image/*" @change="handleImageUpload">
                <div class="img-drop" @click="fileInput.click()"
                  :class="{ 'has-img': previewImage }">
                  <img v-if="previewImage" :src="previewImage" class="img-preview">
                  <div v-else class="img-placeholder">
                    <i class="bi bi-cloud-arrow-up"></i>
                    <span>Kéo thả ảnh vào đây, hoặc click để chọn</span>
                    <small>PNG, JPG · Khuyến nghị 1200×630px · Tối đa 5MB</small>
                  </div>
                  <div v-if="previewImage" class="img-overlay">
                    <i class="bi bi-arrow-repeat"></i> Đổi ảnh
                  </div>
                </div>
                <div class="or-divider"><span>hoặc dán link ảnh</span></div>
                <!-- Sửa lại 2 dòng này trong template -->
<input type="text" class="finput" v-model="form.anhDaiDien"
  placeholder="https://example.com/anh.jpg"
  v-show="!form.anhDaiDien || (!form.anhDaiDien.startsWith('data:image') && !form.anhDaiDien.startsWith('http'))">

<div class="upload-ok" v-show="form.anhDaiDien && (form.anhDaiDien.startsWith('data:image') || form.anhDaiDien.startsWith('http'))">
  <i class="bi bi-check-circle-fill"></i> 
  {{ form.anhDaiDien.startsWith('data:image') ? 'Đã tải ảnh từ thiết bị' : 'Ảnh đã được upload ✓' }}
</div>
                <div class="fhint">Ảnh rõ nét, đúng chủ đề → tăng lượt click từ trang chủ đáng kể</div>
              </div>

              <div class="field">
                <label class="flabel">
                  Ảnh gallery
                  <span class="opt-badge">Tùy chọn</span>
                </label>
                <input type="file" ref="multiFileInput" class="d-none" accept="image/*" multiple
                  @change="handleMultipleImageUpload">
                <div class="multi-upload" @click="multiFileInput.click()">
                  <i class="bi bi-plus-lg"></i> Chọn nhiều ảnh
                </div>
                <div v-if="previewImages.length > 0" class="gallery-grid">
                  <div v-for="(img, i) in previewImages" :key="i" class="gal-item">
                    <img :src="img" class="gal-thumb">
                    <button class="gal-del" @click.prevent="removeImage(i)">
                      <i class="bi bi-x"></i>
                    </button>
                    <span v-if="i===0" class="gal-main">Chính</span>
                  </div>
                </div>
              </div>

              <div class="step-nav">
                <button class="btn-back-step" @click="currentStep='content'">
                  <i class="bi bi-arrow-left"></i> Quay lại
                </button>
                <button class="btn-next" @click="currentStep='category'">
                  Tiếp theo: Phân loại <i class="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Bước 3: Phân loại -->
          <div class="section-card" v-show="currentStep==='category'">
            <div class="card-head">
              <div class="card-icon blue"><i class="bi bi-tag"></i></div>
              <div class="card-title">Phân loại</div>
              <span class="card-step-badge">Bước 3/4</span>
            </div>
            <div class="card-body">

              <div class="field">
                <label class="flabel">Chọn danh mục</label>
                <div class="cat-chips">
                  <button v-for="cat in defaultCats" :key="cat" class="cat-chip"
                    :class="{ selected: form.danhMuc === cat }"
                    @click="form.danhMuc = cat; isCustomCat = false">
                    {{ cat }}
                  </button>
                  <button class="cat-chip dashed"
                    :class="{ selected: isCustomCat }"
                    @click="isCustomCat = true; form.danhMuc = ''">
                    <i class="bi bi-plus-lg" style="font-size:10px"></i> Thêm mới
                  </button>
                </div>
                <input v-if="isCustomCat" type="text" class="finput" v-model="form.danhMuc"
                  placeholder="Nhập tên danh mục mới..." style="margin-top:8px" autofocus>
                <div class="fhint">Chọn danh mục phù hợp nhất với nội dung bài viết</div>
              </div>

              <div class="field">
                <label class="flabel">
                  Tags
                  <span class="opt-badge">Tùy chọn</span>
                </label>
                <input type="text" class="finput" v-model="form.tags"
                  placeholder="HORECA, gia vị, khuyến mãi... (phân cách bằng dấu phẩy)">
                <div class="fhint">Tags giúp bài xuất hiện đúng trong bộ lọc và tìm kiếm nội bộ</div>
              </div>

              <div class="step-nav">
                <button class="btn-back-step" @click="currentStep='images'">
                  <i class="bi bi-arrow-left"></i> Quay lại
                </button>
                <button class="btn-next" @click="currentStep='publish'">
                  Tiếp theo: Xuất bản <i class="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Bước 4: Xuất bản -->
          <div class="section-card" v-show="currentStep==='publish'">
            <div class="card-head">
              <div class="card-icon green"><i class="bi bi-send-check"></i></div>
              <div class="card-title">Sẵn sàng xuất bản</div>
              <span class="card-step-badge">Bước 4/4</span>
            </div>
            <div class="card-body">
              <div class="publish-summary">
                <div class="ps-item" :class="{ ok: form.tieuDe }">
                  <i :class="form.tieuDe ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
                  <span>Tiêu đề: {{ form.tieuDe || 'Chưa điền' }}</span>
                </div>
                <div class="ps-item" :class="{ ok: form.moTaNgan }">
                  <i :class="form.moTaNgan ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
                  <span>Mô tả ngắn: {{ form.moTaNgan ? form.moTaNgan.substring(0,60)+'...' : 'Chưa điền' }}</span>
                </div>
                <div class="ps-item" :class="{ ok: form.noiDung && form.noiDung !== '<p><br></p>' }">
                  <i :class="(form.noiDung && form.noiDung !== '<p><br></p>') ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
                  <span>Nội dung chi tiết: {{ (form.noiDung && form.noiDung !== '<p><br></p>') ? 'Đã có' : 'Chưa điền' }}</span>
                </div>
                <div class="ps-item ok">
                  <i class="bi bi-check-circle-fill"></i>
                  <span>Danh mục: {{ form.danhMuc || 'Tin tức công ty' }}</span>
                </div>
              </div>

              <div v-if="!canPublish" class="tip-box" style="border:0.5px solid #F09595;background:#FCEBEB;margin-top:12px">
                <i class="bi bi-exclamation-circle tip-icon" style="color:#A32D2D"></i>
                <div class="tip-text" style="color:#A32D2D">
                  Vui lòng điền đầy đủ <strong>tiêu đề, mô tả ngắn và nội dung</strong> trước khi xuất bản.
                </div>
              </div>

              <div class="step-nav" style="margin-top:16px">
                <button class="btn-back-step" @click="currentStep='category'">
                  <i class="bi bi-arrow-left"></i> Quay lại
                </button>
                <div style="display:flex;gap:8px">
                  <button class="btn-ghost" @click="savePost(false)">
                    <i class="bi bi-floppy"></i> Lưu nháp
                  </button>
                  <button class="btn-primary" @click="savePost(true)" :disabled="!canPublish">
                    <i class="bi bi-send"></i> Xuất bản ngay
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- ── SIDE COLUMN ── -->
        <div class="side-col">

          <!-- Progress card -->
          <div class="section-card">
            <div class="card-head">
              <div class="card-icon teal"><i class="bi bi-check2-square"></i></div>
              <div class="card-title">Tiến độ</div>
            </div>
            <div class="card-body" style="padding:12px">
              <div class="progress-checks">
                <div class="pcheck" :class="{ done: form.tieuDe }">
                  <i :class="form.tieuDe ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
                  <span>Tiêu đề bài viết</span>
                </div>
                <div class="pcheck" :class="{ done: form.moTaNgan }">
                  <i :class="form.moTaNgan ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
                  <span>Mô tả ngắn</span>
                </div>
                <div class="pcheck" :class="{ done: form.noiDung && form.noiDung !== '<p><br></p>' }">
                  <i :class="(form.noiDung && form.noiDung !== '<p><br></p>') ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
                  <span>Nội dung chi tiết</span>
                </div>
              </div>
              <transition name="fade">
                <div v-if="canPublish" class="ready-msg">
                  <i class="bi bi-rocket-takeoff-fill"></i>
                  Bài viết sẵn sàng xuất bản!
                </div>
              </transition>
            </div>
          </div>

          <!-- Xuất bản -->
          <div class="section-card">
            <div class="card-head">
              <div class="card-icon purple"><i class="bi bi-send"></i></div>
              <div class="card-title">Xuất bản</div>
            </div>
            <div class="card-body" style="padding:12px">
              <div class="status-live" :class="{ pub: canPublish }">
                <div class="live-dot"></div>
                <span>{{ canPublish ? 'Sẵn sàng xuất bản' : 'Đang soạn thảo' }}</span>
              </div>
              <div class="pub-btns">
                <button class="btn-draft-full" @click="savePost(false)">
                  <i class="bi bi-floppy"></i> Lưu nháp
                </button>
                <button class="btn-pub-full" @click="savePost(true)" :disabled="!canPublish">
                  <i class="bi bi-send"></i> Xuất bản
                </button>
              </div>
            </div>
          </div>

          <!-- Nổi bật — tách riêng, màu amber rõ ràng -->
          <div class="section-card featured-card" :class="{ 'featured-on': form.noiBat }">
            <div class="card-head featured-head">
              <div class="card-icon amber"><i class="bi bi-star-fill"></i></div>
              <div class="card-title" style="color:#854F0B">Bài viết nổi bật</div>
              <span v-if="form.noiBat" class="featured-on-badge">Đang bật</span>
            </div>
            <div class="card-body" style="padding:12px">
              <div class="toggle-row">
                <div class="toggle-info">
                  <div class="tname">Đánh dấu nổi bật</div>
                  <div class="tdesc">Hiển thị ưu tiên trên trang chủ</div>
                </div>
                <label class="tog tog-amber">
                  <input type="checkbox" v-model="form.noiBat" @change="handleNoiBatChange">
                  <span class="tog-track"></span>
                </label>
              </div>
              <div class="tip-box amber-tip">
                <i class="bi bi-info-circle tip-icon"></i>
                <div class="tip-text">
                  <strong>Chỉ 1 bài</strong> được nổi bật tại một thời điểm.
                  Nếu đã có bài khác đang nổi bật, hệ thống sẽ báo lỗi.
                </div>
              </div>
              <div v-if="currentFeaturedPost && !form.noiBat" class="featured-warning">
                <i class="bi bi-exclamation-triangle-fill"></i>
                Bài <strong>"{{ currentFeaturedPost.tieuDe }}"</strong> đang nổi bật.
              </div>
            </div>
          </div>

          <!-- SEO preview -->
          <div class="section-card">
            <div class="card-head">
              <div class="card-icon blue"><i class="bi bi-globe2"></i></div>
              <div class="card-title">Xem trước Google</div>
            </div>
            <div class="card-body" style="padding:12px">
              <div class="seo-preview">
                <div class="seo-domain">horecaone.vn › tin-tuc</div>
                <div class="seo-title">{{ form.tieuDe || 'Tiêu đề sẽ hiện ở đây...' }}</div>
                <div class="seo-desc">{{ form.moTaNgan || 'Mô tả ngắn sẽ xuất hiện trong kết quả tìm kiếm...' }}</div>
              </div>
              <div class="fhint" style="margin-top:6px">
                Google hiển thị tối đa 60 ký tự tiêu đề, 160 ký tự mô tả
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useToast } from 'vue-toastification';
import newsService from '@/services/newsService';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import axios from 'axios';
import { API_BASE } from '@/config/api';
const toast = useToast();

// ── State ──────────────────────────────────
const isShowingForm = ref(false);
const newsList      = ref([]);
const selectedPosts = ref([]);
const searchQuery   = ref('');
const activeFilter  = ref('all');
const currentPage   = ref(1);
const itemsPerPage  = 8;

const isCustomCat   = ref(false);
const currentStep   = ref('content');
const previewImage  = ref(null);
const previewImages = ref([]);
const fileInput     = ref(null);
const multiFileInput = ref(null);

const defaultCats = ['Tin tức công ty', 'Sự kiện & Khuyến mãi', 'Góc bếp Vipep', 'Kiến thức gia vị'];

const steps = [
  { id: 'content',  label: 'Nội dung'  },
  { id: 'images',   label: 'Hình ảnh'  },
  { id: 'category', label: 'Phân loại' },
  { id: 'publish',  label: 'Xuất bản'  },
];

const blankForm = () => ({
  id: null, tieuDe: '', moTaNgan: '', noiDung: '',
  anhDaiDien: '', danhSachAnh: [], danhMuc: 'Tin tức công ty',
  tags: '', noiBat: false, trangThai: false,
});
const form = ref(blankForm());

// ── Computed ───────────────────────────────
const publishedCount = computed(() => newsList.value.filter(n => isPublished(n)).length);
const draftCount     = computed(() => newsList.value.filter(n => !isPublished(n)).length);
const featuredCount  = computed(() => newsList.value.filter(n => n.noiBat || n.NOI_BAT).length);

const canPublish = computed(() =>
  form.value.tieuDe.trim() &&
  form.value.moTaNgan.trim() &&
  form.value.noiDung && form.value.noiDung !== '<p><br></p>'
);

const requiredFields = ['tieuDe', 'moTaNgan', 'noiDung'];
const completedFields = computed(() =>
  requiredFields.filter(f => {
    const v = form.value[f];
    return v && v.trim && v.trim() !== '' && v !== '<p><br></p>';
  }).length
);

const stepsCompleted = computed(() => {
  const done = [];
  if (form.value.tieuDe && form.value.moTaNgan && form.value.noiDung) done.push('content');
  if (form.value.anhDaiDien) done.push('images');
  if (form.value.danhMuc) done.push('category');
  return done;
});

const currentFeaturedPost = computed(() =>
  newsList.value.find(n => (n.noiBat || n.NOI_BAT) && n.id !== form.value.id) || null
);

const filteredNews = computed(() => {
  let list = newsList.value;
  if (activeFilter.value === 'pub')   list = list.filter(n => isPublished(n));
  if (activeFilter.value === 'draft') list = list.filter(n => !isPublished(n));
  const q = searchQuery.value.toLowerCase().trim();
  if (q) list = list.filter(n =>
    n.tieuDe?.toLowerCase().includes(q) || n.danhMuc?.toLowerCase().includes(q)
  );
  return list;
});

const totalPages   = computed(() => Math.ceil(filteredNews.value.length / itemsPerPage));
const paginatedNews = computed(() => {
  const s = (currentPage.value - 1) * itemsPerPage;
  return filteredNews.value.slice(s, s + itemsPerPage);
});

const isAllSelected = computed(() =>
  paginatedNews.value.length > 0 &&
  paginatedNews.value.every(n => selectedPosts.value.includes(n.id))
);

// ── Methods ────────────────────────────────
const isPublished = n => !!(n.trangThai == 1 || n.TRANG_THAI == 1 || n.trangThai === true || n.TRANG_THAI === true);

const getThumb = n => {
  const src = n.anhDaiDien;
  if (!src) return 'https://dummyimage.com/56x40/f0ebe3/8a6a4a&text=?';
  return src.includes('|||') ? src.split('|||')[0] : src;
};

const catColors = {
  'Tin tức công ty':       { bg:'#E1F5EE', color:'#0F6E56' },
  'Sự kiện & Khuyến mãi': { bg:'#E6F1FB', color:'#185FA5' },
  'Góc bếp Vipep':         { bg:'#FAEEDA', color:'#854F0B' },
  'Kiến thức gia vị':      { bg:'#EEEDFE', color:'#534AB7' },
};
const getCatStyle = cat => catColors[cat] || { bg:'#F1EFE8', color:'#5F5E5A' };

const formatDate = d => d ? d.substring(0, 10) : 'N/A';

const fetchNews = async () => {
  try {
    const res = await newsService.getAdminNews();
    const d = res.data;
    newsList.value = d.content || d.data || d || [];
  } catch { toast.error('Không thể tải danh sách!'); }
};

const openForm = (news = null) => {
  if (news) {
    form.value = { ...blankForm(), ...news };
    form.value.trangThai = isPublished(news);
    form.value.noiBat    = !!(news.noiBat || news.NOI_BAT);
    previewImage.value   = getThumb(news);
    previewImages.value  = [...(news.danhSachAnh || [])];
    isCustomCat.value    = !defaultCats.includes(news.danhMuc);
  } else {
    form.value          = blankForm();
    previewImage.value  = null;
    previewImages.value = [];
    isCustomCat.value   = false;
  }
  currentStep.value  = 'content';
  isShowingForm.value = true;
};

const closeForm = () => { isShowingForm.value = false; };

const handleNoiBatChange = () => {
  if (!form.value.noiBat) return;
  if (currentFeaturedPost.value) {
    toast.error(
      `Bài "${currentFeaturedPost.value.tieuDe}" đang nổi bật. Vui lòng bỏ nổi bật bài đó trước!`,
      { timeout: 5000 }
    );
    form.value.noiBat = false;
  }
};

const savePost = async (publish) => {
   console.log('anhDaiDien lúc save:', form.value.anhDaiDien);
  if (publish && !canPublish.value) {
    toast.warning('Vui lòng điền đầy đủ tiêu đề, mô tả ngắn và nội dung!');
    currentStep.value = 'content';
    return;
  }
  try {
    const payload = { ...form.value, trangThai: publish, noiBat: !!form.value.noiBat };
    if (form.value.danhSachAnh?.length > 0) {
      payload.anhDaiDien = [form.value.anhDaiDien, ...form.value.danhSachAnh]
        .filter(Boolean).join('|||');
    }
    delete payload.danhSachAnh; delete payload.TRANG_THAI; delete payload.NOI_BAT;

    if (form.value.id) {
      await newsService.updateNews(form.value.id, payload);
      toast.success(publish ? 'Đã xuất bản! 🎉' : 'Đã lưu nháp! 📁');
    } else {
      await newsService.createNews(payload);
      toast.success(publish ? 'Đăng bài thành công! 🚀' : 'Đã lưu bản nháp! 📁');
    }
    closeForm(); fetchNews();
  } catch (e) { console.error(e); toast.error('Lỗi hệ thống!'); }
};

const deletePost = async (id) => {
  if (!confirm('Xác nhận xóa bài viết này?')) return;
  try { await newsService.deleteNews(id); toast.success('Đã xóa!'); fetchNews(); }
  catch { toast.error('Xóa thất bại!'); }
};

const deleteSelectedPosts = async () => {
  if (!confirm(`Xóa vĩnh viễn ${selectedPosts.value.length} bài viết?`)) return;
  try {
    await Promise.all(selectedPosts.value.map(id => newsService.deleteNews(id)));
    toast.success(`Đã xóa ${selectedPosts.value.length} bài viết!`);
    selectedPosts.value = []; fetchNews();
  } catch { toast.error('Có lỗi xảy ra!'); }
};

const toggleSelectAll = (e) => {
  const ids = paginatedNews.value.map(n => n.id);
  if (e.target.checked) ids.forEach(id => { if (!selectedPosts.value.includes(id)) selectedPosts.value.push(id); });
  else selectedPosts.value = selectedPosts.value.filter(id => !ids.includes(id));
};

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  previewImage.value = URL.createObjectURL(file);

  try {
    const formData = new FormData();
    formData.append('file', file);

    // ← Thêm token vào header
    const token = sessionStorage.getItem('admin_token') || localStorage.getItem('token');
    const res = await axios.post(`${API_BASE}/api/admin/news/upload-image`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    form.value.anhDaiDien = API_BASE + res.data.url;
    toast.success('Tải ảnh thành công!');
  } catch (err) {
    console.error('Upload lỗi:', err.response?.status, err.response?.data);
    // fallback base64 nén
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX = 800;
      let w = img.width, h = img.height;
      if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      form.value.anhDaiDien = canvas.toDataURL('image/jpeg', 0.7);
    };
    img.src = URL.createObjectURL(file);
    toast.warning('Upload server thất bại, dùng base64');
  }
};

const handleMultipleImageUpload = (e) => {
  Array.from(e.target.files).forEach(file => {
    previewImages.value.push(URL.createObjectURL(file));
    const r = new FileReader();
    r.onload = ev => form.value.danhSachAnh.push(ev.target.result);
    r.readAsDataURL(file);
  });
  e.target.value = '';
};

const removeImage = (i) => { previewImages.value.splice(i,1); form.value.danhSachAnh.splice(i,1); };

// Ctrl+S shortcut
const onKeydown = e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's' && isShowingForm.value) {
    e.preventDefault(); savePost(false);
  }
};

onMounted(() => { fetchNews(); document.addEventListener('keydown', onKeydown); });
onUnmounted(() => document.removeEventListener('keydown', onKeydown));
</script>

<style scoped>
/* ─── TOKENS ─── */
.nm {
  --g:   #3B6D11;  --g-bg: #EAF3DE;
  --a:   #BA7517;  --a-bg: #FAEEDA;
  --r:   #A32D2D;  --r-bg: #FCEBEB;
  --b:   #185FA5;  --b-bg: #E6F1FB;
  --p:   #534AB7;  --p-bg: #EEEDFE;
  --t:   #0F6E56;  --t-bg: #E1F5EE;
  --radius: 10px;
  font-family: 'Quicksand', sans-serif;
  color: #1a1a1a;
  background: #f5f4f1;
  min-height: 100vh;
  padding: 0;
}

/* ─── SHARED ─── */
.btn-primary {
  display: inline-flex; align-items: center; gap: 6px;
  background: #1a1a1a; color: #fff; border: none;
  border-radius: 8px; padding: 8px 16px;
  font-size: 13px; font-weight: 600; font-family: inherit;
  cursor: pointer; transition: opacity .15s;
}
.btn-primary:hover { opacity: .8 }
.btn-primary:disabled { opacity: .35; cursor: not-allowed }
.btn-ghost {
  display: inline-flex; align-items: center; gap: 6px;
  background: #fff; color: #444; border: 1px solid #e5e1db;
  border-radius: 8px; padding: 8px 14px;
  font-size: 13px; font-weight: 500; font-family: inherit;
  cursor: pointer; transition: background .15s;
}
.btn-ghost:hover { background: #f5f4f1 }
.btn-danger {
  display: inline-flex; align-items: center; gap: 6px;
  background: #fff0f0; color: var(--r); border: 1px solid #fca5a5;
  border-radius: 8px; padding: 8px 14px; font-size: 13px;
  font-weight: 500; font-family: inherit; cursor: pointer;
}
.btn-danger:hover { background: #fde8e8 }

/* ─── LIST VIEW ─── */
.lv-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 20px 24px 16px; background: #fff;
  border-bottom: 1px solid #ede9e2;
}
.lv-title { font-size: 1.25rem; font-weight: 800; color: #2a1a0e }
.lv-sub { font-size: 12px; color: #999; margin-top: 3px }
.lv-actions { display: flex; gap: 8px; align-items: center }

.stats-row {
  display: grid; grid-template-columns: repeat(4,1fr);
  gap: 12px; padding: 16px 24px;
}
.stat-card {
  background: #fff; border: 1px solid #ede9e2;
  border-radius: var(--radius); padding: 14px 16px;
}
.stat-n { font-size: 22px; font-weight: 800; color: #2a1a0e; line-height: 1 }
.stat-n.green { color: var(--g) } .stat-n.amber { color: var(--a) } .stat-n.red { color: var(--r) }
.stat-l { font-size: 12px; color: #999; margin-top: 5px }

.toolbar { display: flex; justify-content: space-between; align-items: center; padding: 0 24px 12px }
.search-wrap { position: relative; width: 260px }
.search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #bbb; font-size: 14px; pointer-events: none }
.search-input {
  width: 100%; padding: 8px 12px 8px 32px;
  border: 1px solid #e5e1db; border-radius: 8px;
  font-size: 13px; font-family: inherit; background: #fff; outline: none;
}
.search-input:focus { border-color: #aaa }
.filter-tabs { display: flex; gap: 3px }
.ftab {
  padding: 6px 12px; border-radius: 7px; font-size: 12px;
  cursor: pointer; border: none; background: transparent;
  color: #888; font-family: inherit; transition: all .15s;
}
.ftab.active { background: #fff; color: #1a1a1a; font-weight: 600; box-shadow: 0 1px 4px rgba(0,0,0,.08) }

.table-wrap { padding: 0 24px 24px }
.tbl { width: 100%; border-collapse: collapse; background: #fff; border-radius: var(--radius); overflow: hidden; border: 1px solid #ede9e2 }
.tbl thead tr { background: #faf8f5; border-bottom: 1px solid #ede9e2 }
.tbl th { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #999; padding: 10px 14px; text-align: left }
.th-check { width: 36px; text-align: center }
.th-right { text-align: right }
.tbl td { padding: 11px 14px; border-bottom: 1px solid #f5f3ef; vertical-align: middle; font-size: 13px }
.tbl tr:last-child td { border-bottom: none }
.tbl tr:hover td { background: #fdfcfa }
.row-selected td { background: #f2faeb !important }

.post-cell { display: flex; align-items: center; gap: 10px }
.post-img { width: 56px; height: 40px; border-radius: 7px; object-fit: cover; border: 1px solid #ede9e2; flex-shrink: 0 }
.post-name { font-size: 13px; font-weight: 600; color: #1a1a1a; max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap }
.post-meta { font-size: 11px; color: #aaa; margin-top: 2px }

.cat-pill { display: inline-block; padding: 3px 9px; border-radius: 99px; font-size: 11px; font-weight: 600 }
.status-pill { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 99px; font-size: 11px; font-weight: 600 }
.pill-pub { background: #dcfce7; color: #166534 } .pill-draft { background: #f3f4f6; color: #6b7280 }
.pill-hot { display: inline-flex; align-items: center; gap: 3px; background: #fef3c7; color: #92400e; padding: 3px 7px; border-radius: 99px; font-size: 10px; font-weight: 700; margin-left: 5px }
.sdot { width: 5px; height: 5px; border-radius: 50%; background: currentColor }
.text-muted { font-size: 12px; color: #aaa }
.act-group { display: flex; gap: 4px; justify-content: flex-end }
.act-btn {
  width: 28px; height: 28px; border: 1px solid #ede9e2;
  border-radius: 6px; background: #fff; font-size: 12px;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: #555; transition: all .15s;
}
.act-btn:hover { background: #f5f3ef; border-color: #ccc }
.act-btn.del:hover { background: #fff0f0; border-color: #fca5a5; color: var(--r) }

.empty-row { text-align: center; padding: 60px 20px !important; color: #bbb }
.empty-row i { font-size: 2rem; display: block; margin-bottom: 10px }
.empty-row p { font-size: 13px }

.pager { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-top: 1px solid #ede9e2; background: #faf8f5 }
.pager-info { font-size: 12px; color: #aaa }
.pager-btns { display: flex; gap: 3px }
.pg-btn { min-width: 30px; height: 30px; border: 1px solid #ede9e2; border-radius: 6px; background: #fff; font-size: 12px; font-family: inherit; font-weight: 600; color: #555; cursor: pointer; transition: all .15s }
.pg-btn:hover:not(:disabled) { background: #f2faeb; border-color: #bbd99a; color: var(--g) }
.pg-btn.active { background: #1a1a1a !important; color: #fff !important; border-color: #1a1a1a !important }
.pg-btn:disabled { opacity: .3; cursor: default }

/* ─── FORM VIEW ─── */
.fv { background: #f5f4f1; min-height: 100vh }

.fv-topbar {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 24px; background: #fff; border-bottom: 1px solid #ede9e2;
  position: sticky; top: 0; z-index: 20;
}
.fv-topbar-left { display: flex; align-items: center; gap: 12px }
.fv-topbar-right { display: flex; align-items: center; gap: 8px }
.back-btn {
  width: 32px; height: 32px; border: 1px solid #e5e1db; border-radius: 7px;
  background: transparent; font-size: 15px; color: #666;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
}
.back-btn:hover { background: #f5f4f1 }
.fv-heading { font-size: 15px; font-weight: 700; color: #2a1a0e }
.fv-sub { font-size: 11px; color: #aaa; margin-top: 2px }
.hotkey-hint { font-size: 11px; color: #bbb; display: flex; align-items: center; gap: 2px }
kbd { background: #f5f4f1; border: 1px solid #e0dcd5; border-radius: 4px; padding: 1px 5px; font-size: 10px; font-family: monospace; color: #888 }

/* Steps */
.steps-bar {
  display: flex; align-items: center; padding: 12px 24px;
  background: #fff; border-bottom: 1px solid #ede9e2;
}
.step-item { display: flex; align-items: center; gap: 8px; padding: 5px 8px; border-radius: 8px; cursor: pointer }
.step-item:hover { background: #f5f4f1 }
.step-num { width: 22px; height: 22px; border-radius: 50%; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; border: 1.5px solid #ddd; color: #bbb; flex-shrink: 0 }
.step-item.active .step-num { background: #1a1a1a; border-color: #1a1a1a; color: #fff }
.step-item.done .step-num { background: var(--g); border-color: var(--g); color: #fff }
.step-label { font-size: 12px; color: #999 }
.step-item.active .step-label { color: #1a1a1a; font-weight: 600 }
.step-item.done .step-label { color: var(--g) }
.step-sep { flex: 1; height: 1px; background: #ede9e2; margin: 0 2px }
.req-summary { font-size: 11px; color: #bbb; display: flex; align-items: center; gap: 5px }

/* Form layout */
.fv-body { display: grid; grid-template-columns: 1fr 280px; gap: 16px; padding: 16px 24px; }
@media (max-width: 960px) { .fv-body { grid-template-columns: 1fr } }
.main-col, .side-col { display: flex; flex-direction: column; gap: 12px }

/* Cards */
.section-card { background: #fff; border: 1px solid #ede9e2; border-radius: 12px; overflow: hidden }
.card-head { display: flex; align-items: center; gap: 9px; padding: 11px 16px; border-bottom: 1px solid #ede9e2; background: #faf8f5 }
.card-icon { width: 26px; height: 26px; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0 }
.card-icon.purple { background: var(--p-bg); color: var(--p) }
.card-icon.teal   { background: var(--t-bg); color: var(--t) }
.card-icon.amber  { background: var(--a-bg); color: var(--a) }
.card-icon.blue   { background: var(--b-bg); color: var(--b) }
.card-icon.green  { background: var(--g-bg); color: var(--g) }
.card-icon.pink   { background: #FBEAF0; color: #993556 }
.card-title { font-size: 13px; font-weight: 700; color: #2a1a0e }
.card-step-badge { margin-left: auto; font-size: 11px; color: #bbb }
.card-body { padding: 18px }

/* Fields */
.field { margin-bottom: 16px }
.field:last-child { margin-bottom: 0 }
.flabel { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #888; display: flex; align-items: center; gap: 4px; margin-bottom: 6px }
.req { color: var(--r) }
.opt-badge { font-size: 10px; font-weight: 600; background: #f0f0ee; color: #aaa; border-radius: 4px; padding: 1px 6px; text-transform: none; letter-spacing: 0 }
.finput { width: 100%; padding: 9px 12px; border: 1px solid #e5e1db; border-radius: 8px; font-size: 13px; font-family: inherit; color: #1a1a1a; background: #fff; outline: none; transition: border .15s; box-sizing: border-box }
.finput:focus { border-color: #aaa }
textarea.finput { resize: vertical; min-height: 80px; line-height: 1.6 }
.finput-title { font-size: 16px; font-weight: 600; padding: 11px 14px }
.char-bar { height: 2px; background: #f0ede8; border-radius: 1px; margin-top: 5px; overflow: hidden }
.char-fill { height: 100%; border-radius: 1px; transition: width .2s, background .2s }
.field-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 5px }
.fhint { font-size: 11px; color: #bbb; line-height: 1.6 }
.char-count { font-size: 11px; color: #bbb }
.char-count.warn { color: var(--r) }

/* Editor */
.editor-wrap { border: 1px solid #e5e1db; border-radius: 8px; overflow: hidden }
.editor-wrap :deep(.ql-toolbar) { border: none; border-bottom: 1px solid #ede9e2 !important; background: #faf8f5 }
.editor-wrap :deep(.ql-container) { border: none !important }
.editor-wrap :deep(.ql-editor) { min-height: 260px; font-family: inherit; font-size: 14px; line-height: 1.8 }

/* Tip box */
.tip-box { display: flex; gap: 9px; background: #f5f4f1; border-radius: 8px; padding: 10px 12px; margin-top: 12px }
.tip-icon { font-size: 15px; color: var(--b); flex-shrink: 0; margin-top: 1px }
.tip-text { font-size: 11px; color: #888; line-height: 1.6 }
.tip-text strong { color: #555; font-weight: 600 }
.amber-tip { background: #fffbeb }
.amber-tip .tip-icon { color: var(--a) }
.amber-tip .tip-text { color: #854F0B }

/* Category chips */
.cat-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px }
.cat-chip {
  padding: 5px 12px; border-radius: 99px; font-size: 12px; font-weight: 600;
  cursor: pointer; border: 1px solid #e5e1db; background: transparent;
  color: #666; font-family: inherit; transition: all .15s;
}
.cat-chip:hover { border-color: #aaa; color: #1a1a1a }
.cat-chip.selected { background: #1a1a1a; color: #fff; border-color: #1a1a1a }
.cat-chip.dashed { border-style: dashed }

/* Image upload */
.img-drop { border: 2px dashed #e0dcd5; border-radius: 10px; padding: 28px 16px; text-align: center; cursor: pointer; transition: all .2s; position: relative; overflow: hidden; background: #faf8f5 }
.img-drop:hover { border-color: #aaa; background: #f5f4f1 }
.img-drop.has-img { border-style: solid; padding: 0 }
.img-preview { width: 100%; height: 160px; object-fit: cover; display: block }
.img-placeholder { display: flex; flex-direction: column; align-items: center; gap: 6px; color: #bbb }
.img-placeholder i { font-size: 1.8rem }
.img-placeholder span { font-size: 13px; font-weight: 500; color: #888 }
.img-placeholder small { font-size: 11px }
.img-overlay { position: absolute; inset: 0; background: rgba(0,0,0,.45); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 13px; font-weight: 600; gap: 6px; opacity: 0; transition: opacity .2s }
.img-drop.has-img:hover .img-overlay { opacity: 1 }
.or-divider { display: flex; align-items: center; gap: 10px; margin: 10px 0 }
.or-divider::before, .or-divider::after { content: ''; flex: 1; height: 1px; background: #ede9e2 }
.or-divider span { font-size: 11px; color: #bbb }
.upload-ok { background: #dcfce7; color: #166534; border-radius: 7px; padding: 7px 12px; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 6px }

.multi-upload { border: 2px dashed #e0dcd5; border-radius: 8px; padding: 11px; text-align: center; cursor: pointer; color: #aaa; font-size: 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px; background: #faf8f5; margin-bottom: 10px }
.multi-upload:hover { border-color: #aaa; color: #555 }
.gallery-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 6px }
.gal-item { position: relative; aspect-ratio: 1 }
.gal-thumb { width: 100%; height: 100%; object-fit: cover; border-radius: 6px; border: 1px solid #ede9e2 }
.gal-del { position: absolute; top: -5px; right: -5px; width: 17px; height: 17px; background: #ef4444; color: #fff; border: 2px solid #fff; border-radius: 50%; font-size: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0 }
.gal-main { position: absolute; bottom: 3px; left: 3px; background: rgba(91,142,29,.85); color: #fff; border-radius: 3px; padding: 1px 5px; font-size: 9px; font-weight: 700 }

/* Step navigation */
.step-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 16px; border-top: 1px solid #ede9e2 }
.btn-next { display: flex; align-items: center; gap: 6px; background: #1a1a1a; color: #fff; border: none; border-radius: 8px; padding: 9px 18px; font-size: 13px; font-weight: 600; font-family: inherit; cursor: pointer }
.btn-next:hover { opacity: .8 }
.btn-back-step { display: flex; align-items: center; gap: 6px; background: transparent; color: #888; border: 1px solid #e5e1db; border-radius: 8px; padding: 9px 14px; font-size: 13px; font-family: inherit; cursor: pointer }
.btn-back-step:hover { background: #f5f4f1 }

/* Publish summary */
.publish-summary { background: #faf8f5; border-radius: 9px; padding: 14px }
.ps-item { display: flex; align-items: flex-start; gap: 9px; padding: 5px 0; font-size: 13px; color: #888; border-bottom: 1px solid #f0ede8 }
.ps-item:last-child { border-bottom: none }
.ps-item i { font-size: 15px; flex-shrink: 0; margin-top: 1px; color: #ddd }
.ps-item.ok { color: #1a1a1a }
.ps-item.ok i { color: var(--g) }

/* Side cards */
.progress-checks { background: #faf8f5; border-radius: 8px; padding: 10px 12px }
.pcheck { display: flex; align-items: center; gap: 8px; padding: 5px 0; font-size: 13px; color: #bbb }
.pcheck i { font-size: 14px; color: #ddd }
.pcheck.done { color: #1a1a1a }
.pcheck.done i { color: var(--g) }
.ready-msg { display: flex; align-items: center; gap: 7px; background: var(--g-bg); color: var(--g); border-radius: 8px; padding: 9px 11px; font-size: 12px; font-weight: 600; margin-top: 10px }
.fade-enter-active, .fade-leave-active { transition: opacity .3s }
.fade-enter-from, .fade-leave-to { opacity: 0 }

.status-live { display: flex; align-items: center; gap: 7px; padding: 8px 12px; background: #faf8f5; border-radius: 8px; font-size: 12px; color: #aaa }
.live-dot { width: 7px; height: 7px; border-radius: 50%; background: #ddd }
.status-live.pub { color: var(--g) }
.status-live.pub .live-dot { background: var(--g); animation: pulse 2s infinite }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
.pub-btns { display: flex; gap: 8px; margin-top: 10px }
.btn-draft-full { flex: 1; padding: 8px; border: 1px solid #e5e1db; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; background: transparent; font-family: inherit; color: #555 }
.btn-draft-full:hover { background: #f5f4f1 }
.btn-pub-full { flex: 1; padding: 8px; border: none; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; background: #1a1a1a; color: #fff; font-family: inherit }
.btn-pub-full:hover { opacity: .8 }
.btn-pub-full:disabled { opacity: .3; cursor: not-allowed }

/* Featured card */
.featured-card { border-color: #fde68a }
.featured-card.featured-on { border-color: #f59e0b; box-shadow: 0 0 0 3px rgba(245,158,11,.1) }
.featured-head { background: #fffbeb; border-bottom-color: #fde68a }
.featured-on-badge { margin-left: auto; background: #f59e0b; color: #fff; border-radius: 99px; padding: 2px 8px; font-size: 10px; font-weight: 700 }
.toggle-row { display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; margin-bottom: 10px; border-bottom: 1px solid #f5f3ef }
.tname { font-size: 13px; font-weight: 600; color: #2a1a0e }
.tdesc { font-size: 11px; color: #aaa; margin-top: 2px }
.tog { position: relative; width: 38px; height: 21px; flex-shrink: 0 }
.tog input { opacity: 0; width: 0; height: 0 }
.tog-track { position: absolute; inset: 0; background: #ddd; border-radius: 99px; cursor: pointer; transition: background .2s }
.tog-track::before { content: ''; position: absolute; width: 15px; height: 15px; left: 3px; top: 3px; background: #fff; border-radius: 50%; transition: transform .2s }
.tog-amber input:checked + .tog-track { background: #f59e0b }
.tog input:checked + .tog-track::before { transform: translateX(17px) }
.featured-warning { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 8px 10px; font-size: 11px; color: #854F0B; display: flex; align-items: flex-start; gap: 6px; line-height: 1.5; margin-top: 10px }
.featured-warning i { flex-shrink: 0; margin-top: 1px; color: #f59e0b }

/* SEO preview */
.seo-preview { background: #faf8f5; border-radius: 8px; padding: 11px 13px }
.seo-domain { font-size: 11px; color: #3B6D11; margin-bottom: 3px }
.seo-title { font-size: 13px; color: #185FA5; line-height: 1.4; margin-bottom: 3px; font-weight: 500 }
.seo-desc { font-size: 11px; color: #666; line-height: 1.5 }
</style>