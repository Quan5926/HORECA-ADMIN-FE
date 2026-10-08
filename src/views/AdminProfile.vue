<template>
  <div class="adm-profile-wrap">

    <!-- Page Header -->
    <div class="page-header mb-4">
      <div class="page-header__icon"><i class="bi bi-person-gear"></i></div>
      <div>
        <h4 class="page-header__title">Hồ sơ quản trị viên</h4>
        <p class="page-header__sub">Quản lý thông tin cá nhân và bảo mật tài khoản</p>
      </div>
    </div>

    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Đang tải thông tin...</p>
    </div>

    <div v-else class="profile-layout">

      <!-- ══ SIDEBAR ══ -->
      <aside class="sidebar-card">
        <!-- Avatar banner -->
        <div class="sidebar-banner">
          <div class="banner-rings">
            <div class="banner-ring ring-1"></div>
            <div class="banner-ring ring-2"></div>
          </div>
          <div class="position-relative d-inline-block">
            <div class="avatar-frame">
              <img v-if="user.avatar" :src="user.avatar" class="avatar-img" alt="Avatar">
              <span v-else class="avatar-letter">{{ user.name?.charAt(0)?.toUpperCase() || 'A' }}</span>
            </div>
            <label for="avatar-upload" class="avatar-cam" title="Đổi ảnh">
              <span v-if="isUploadingAvatar" class="spinner-border spinner-border-sm" style="width:14px;height:14px;border-width:2px;"></span>
              <i v-else class="bi bi-camera-fill"></i>
            </label>
            <input type="file" id="avatar-upload" hidden @change="handleAvatarChange" accept="image/*">
          </div>
          <h5 class="sidebar-name">{{ user.name || 'Quản trị viên' }}</h5>
          <span class="sidebar-role-badge"><i class="bi bi-patch-check-fill me-1"></i>Quản trị viên</span>
        </div>

        <!-- Info rows -->
        <div class="sidebar-info">
          <div class="info-row">
            <div class="info-row__icon"><i class="bi bi-envelope-fill"></i></div>
            <div class="info-row__body">
              <span class="info-row__label">Email</span>
              <span class="info-row__val">{{ user.email || '—' }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-row__icon"><i class="bi bi-telephone-fill"></i></div>
            <div class="info-row__body">
              <span class="info-row__label">Điện thoại</span>
              <span class="info-row__val">{{ user.phone || 'Chưa cập nhật' }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-row__icon"><i class="bi bi-shield-fill-check"></i></div>
            <div class="info-row__body">
              <span class="info-row__label">Vai trò</span>
              <span class="info-row__val">Quản trị viên hệ thống</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- ══ MAIN ══ -->
      <div class="main-col">

        <!-- Thông tin cơ bản -->
        <div class="profile-card">
          <div class="profile-card__header">
            <div class="section-icon section-icon--blue">
              <i class="bi bi-person-vcard-fill"></i>
            </div>
            <div>
              <h6 class="section-title">Thông tin cơ bản</h6>
              <p class="section-sub">Cập nhật họ tên và số điện thoại</p>
            </div>
          </div>

          <div class="row g-3">
            <div class="col-md-6">
              <label class="field-lbl">Họ và tên</label>
              <div class="field-wrap">
                <i class="bi bi-person field-ico"></i>
                <input type="text" class="field-inp" v-model="user.name" placeholder="Nhập họ tên">
              </div>
            </div>
            <div class="col-md-6">
              <label class="field-lbl">Số điện thoại</label>
              <div class="field-wrap">
                <i class="bi bi-telephone field-ico"></i>
                <input type="tel" class="field-inp" v-model="user.phone" placeholder="0912 345 678">
              </div>
            </div>
            <div class="col-12">
              <label class="field-lbl">
                Email
                <span class="locked-badge"><i class="bi bi-lock-fill me-1"></i>Cố định</span>
              </label>
              <div class="field-wrap field-wrap--disabled">
                <i class="bi bi-envelope field-ico"></i>
                <input type="email" class="field-inp" :value="user.email" disabled>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn-ghost" @click="resetForm">
              <i class="bi bi-arrow-counterclockwise me-2"></i>Đặt lại
            </button>
            <button class="btn-primary-adm" @click="updateProfile" :disabled="isSaving">
              <span v-if="isSaving" class="spinner-border spinner-border-sm me-2" style="width:14px;height:14px;border-width:2px;"></span>
              <i v-else class="bi bi-check2-circle me-2"></i>
              {{ isSaving ? 'Đang lưu...' : 'Lưu thay đổi' }}
            </button>
          </div>
        </div>

        <!-- Đổi mật khẩu -->
        <div class="profile-card">
          <div class="profile-card__header">
            <div class="section-icon section-icon--amber">
              <i class="bi bi-shield-lock-fill"></i>
            </div>
            <div>
              <h6 class="section-title">Bảo mật tài khoản</h6>
              <p class="section-sub">Thay đổi mật khẩu định kỳ để bảo vệ tài khoản</p>
            </div>
          </div>

          <div class="row g-3">
            <div class="col-12">
              <label class="field-lbl">Mật khẩu hiện tại</label>
              <div class="field-wrap">
                <i class="bi bi-lock field-ico"></i>
                <input :type="showPwd.current ? 'text' : 'password'"
                       class="field-inp" v-model="passwords.current"
                       placeholder="••••••••">
                <button type="button" class="eye-btn" @click="showPwd.current = !showPwd.current">
                  <i class="bi" :class="showPwd.current ? 'bi-eye-slash' : 'bi-eye'"></i>
                </button>
              </div>
            </div>
            <div class="col-md-6">
              <label class="field-lbl">Mật khẩu mới</label>
              <div class="field-wrap" :class="{ 'field-wrap--error': passwords.new && !isPasswordValid(passwords.new) }">
                <i class="bi bi-key field-ico"></i>
                <input :type="showPwd.new ? 'text' : 'password'"
                       class="field-inp" v-model="passwords.new"
                       placeholder="Tối thiểu 8 ký tự">
                <button type="button" class="eye-btn" @click="showPwd.new = !showPwd.new">
                  <i class="bi" :class="showPwd.new ? 'bi-eye-slash' : 'bi-eye'"></i>
                </button>
              </div>
              <div v-if="passwords.new" class="pwd-rules mt-2">
                <div class="pwd-rule" :class="passwords.new.length >= 8 ? 'rule--pass' : 'rule--fail'">
                  <i :class="passwords.new.length >= 8 ? 'bi-check-circle-fill' : 'bi-x-circle-fill'" class="bi me-1"></i>Tối thiểu 8 ký tự
                </div>
                <div class="pwd-rule" :class="/[A-Z]/.test(passwords.new) ? 'rule--pass' : 'rule--fail'">
                  <i :class="/[A-Z]/.test(passwords.new) ? 'bi-check-circle-fill' : 'bi-x-circle-fill'" class="bi me-1"></i>Có ít nhất 1 chữ hoa
                </div>
                <div class="pwd-rule" :class="/[0-9]/.test(passwords.new) ? 'rule--pass' : 'rule--fail'">
                  <i :class="/[0-9]/.test(passwords.new) ? 'bi-check-circle-fill' : 'bi-x-circle-fill'" class="bi me-1"></i>Có ít nhất 1 chữ số
                </div>
                <div class="pwd-rule" :class="/[^A-Za-z0-9]/.test(passwords.new) ? 'rule--pass' : 'rule--fail'">
                  <i :class="/[^A-Za-z0-9]/.test(passwords.new) ? 'bi-check-circle-fill' : 'bi-x-circle-fill'" class="bi me-1"></i>Có ít nhất 1 ký tự đặc biệt
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <label class="field-lbl">Xác nhận mật khẩu</label>
              <div class="field-wrap"
                   :class="{ 'field-wrap--error': passwords.confirm && passwords.new !== passwords.confirm }">
                <i class="bi bi-key-fill field-ico"></i>
                <input :type="showPwd.confirm ? 'text' : 'password'"
                       class="field-inp" v-model="passwords.confirm"
                       placeholder="Nhập lại mật khẩu">
                <button type="button" class="eye-btn" @click="showPwd.confirm = !showPwd.confirm">
                  <i class="bi" :class="showPwd.confirm ? 'bi-eye-slash' : 'bi-eye'"></i>
                </button>
              </div>
              <p v-if="passwords.confirm && passwords.new !== passwords.confirm" class="field-error mt-1">
                <i class="bi bi-exclamation-circle me-1"></i>Mật khẩu không khớp
              </p>
              <p v-else-if="passwords.confirm && passwords.new === passwords.confirm" class="field-success mt-1">
                <i class="bi bi-check-circle me-1"></i>Mật khẩu khớp
              </p>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn-primary-adm btn-primary-adm--amber" @click="changePassword"
                    :disabled="isSavingPwd || !passwords.current || !isPasswordValid(passwords.new) || passwords.new !== passwords.confirm">
              <span v-if="isSavingPwd" class="spinner-border spinner-border-sm me-2" style="width:14px;height:14px;border-width:2px;"></span>
              <i v-else class="bi bi-shield-check me-2"></i>
              {{ isSavingPwd ? 'Đang cập nhật...' : 'Cập nhật mật khẩu' }}
            </button>
          </div>
        </div>

      </div>
    </div>
   <!-- CROP MODAL -->
<Teleport to="body">
  <Transition name="crop-fade">
    <div v-if="cropModalOpen" class="crop-overlay" @click.self="cropModalOpen = false">
      <div class="crop-modal">

        <!-- Header -->
        <div class="crop-header">
          <div>
            <p class="crop-title">Chỉnh ảnh đại diện</p>
            <p class="crop-sub">Kéo để căn chỉnh · Cuộn chuột để zoom</p>
          </div>
          <button class="crop-close-btn" @click="cropModalOpen = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <!-- Crop area -->
        <div class="crop-body">
          <div class="crop-canvas-wrap">
            <Cropper
              ref="cropperRef"
              class="crop-canvas"
              :src="rawImage"
              :stencil-component="CircleStencil"
              :stencil-props="{ aspectRatio: 1 }"
              :default-size="{ width: 200, height: 200 }"
              background-class="crop-bg"
            />
          </div>

          <!-- Zoom slider -->
          <div class="crop-zoom-row">
            <i class="bi bi-zoom-out crop-zoom-icon"></i>
            <input
              type="range" min="0" max="1" step="0.01"
              v-model="cropZoom"
              class="crop-zoom-slider"
              @input="onZoomInput"
            />
            <i class="bi bi-zoom-in crop-zoom-icon"></i>
          </div>

          <!-- Preview -->
          <div class="crop-preview-row">
            <div class="crop-preview-box">
              <div class="crop-preview-avatar">
                <img v-if="user.avatar" :src="user.avatar" alt="">
                <span v-else>{{ user.name?.charAt(0)?.toUpperCase() }}</span>
              </div>
              <div>
                <p class="crop-preview-label">Ảnh hiện tại</p>
                <p class="crop-preview-sub">Sẽ thay thế sau khi lưu</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="crop-footer">
          <button class="crop-btn-cancel" @click="cropModalOpen = false">Hủy</button>
          <button class="crop-btn-save" @click="confirmCrop" :disabled="isUploadingAvatar">
            <span v-if="isUploadingAvatar" class="spinner-border spinner-border-sm me-2"
                  style="width:13px;height:13px;border-width:2px;"></span>
            <i v-else class="bi bi-check2 me-2"></i>
            {{ isUploadingAvatar ? 'Đang lưu...' : 'Lưu ảnh' }}
          </button>
        </div>

      </div>
    </div>
  </Transition>
</Teleport>
    <!-- TOAST -->
    <transition name="toast-slide">
      <div v-if="toast.show" class="adm-toast" :class="`adm-toast--${toast.type}`">
        <div class="adm-toast__icon">
          <i :class="toast.type === 'success' ? 'bi-check-lg' : 'bi-exclamation-lg'" class="bi"></i>
        </div>
        <span>{{ toast.message }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { API_BASE } from '@/config/api'
import { Cropper, CircleStencil } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const cropModalOpen = ref(false);
const rawImage      = ref('');
const cropperRef    = ref(null);
const cropZoom    = ref(0);
const lastZoomVal = ref(0);
const isLoading         = ref(false);
const isSaving          = ref(false);
const isSavingPwd       = ref(false);
const isUploadingAvatar = ref(false);

const onZoomInput = () => {
  const newVal = parseFloat(cropZoom.value);
  const delta  = newVal - lastZoomVal.value;
  lastZoomVal.value = newVal;
  if (delta === 0 || !cropperRef.value) return;
  const factor = delta > 0
    ? 1 + delta * 4
    : 1 / (1 + Math.abs(delta) * 4);
  cropperRef.value.zoom(factor);
};


const user       = ref({ name: '', email: '', phone: '', avatar: '' });
const userBackup = ref({});

const passwords = ref({ current: '', new: '', confirm: '' });
const showPwd   = ref({ current: false, new: false, confirm: false });
const toast     = ref({ show: false, message: '', type: 'success' });

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${sessionStorage.getItem('admin_token')}` }
});

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type };
  setTimeout(() => { toast.value.show = false; }, 3500);
};

const isPasswordValid = (pwd) =>
  !!pwd && pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd);

const fetchProfile = async () => {
  isLoading.value = true;
  try {
    const res = await axios.get(`${API_BASE}/api/v1/users/me`, getAuthHeaders());
    const d = res.data;
    user.value = { name: d.hoTen || '', email: d.email || '', phone: d.soDienThoai || '', avatar: d.anhDaiDien || '' };
    userBackup.value = { ...user.value };
    if (d.id) sessionStorage.setItem('admin_userId', String(d.id));
  } catch {
    showToast('Không thể tải thông tin tài khoản!', 'error');
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => { user.value = { ...userBackup.value }; };

const updateProfile = async () => {
  isSaving.value = true;
  const userId = sessionStorage.getItem('admin_userId');
  try {
    const res = await axios.put(
      `${API_BASE}/api/v1/users/${userId}`,
      { hoTen: user.value.name, soDienThoai: user.value.phone },
      getAuthHeaders()
    );
    user.value.name  = res.data.hoTen       || user.value.name;
    user.value.phone = res.data.soDienThoai || '';
    userBackup.value = { ...user.value };
    showToast('Cập nhật thông tin thành công!');
  } catch (err) {
    showToast(err.response?.data?.message || 'Không thể cập nhật thông tin!', 'error');
  } finally {
    isSaving.value = false;
  }
  window.dispatchEvent(new CustomEvent('username-updated', { detail: user.value.name }));
};

const changePassword = async () => {
  if (!isPasswordValid(passwords.value.new)) return showToast('Mật khẩu chưa đủ điều kiện bảo mật!', 'error');
  if (passwords.value.new !== passwords.value.confirm) return showToast('Mật khẩu xác nhận không khớp!', 'error');
  isSavingPwd.value = true;
  const userId = sessionStorage.getItem('admin_userId');
  try {
    await axios.put(
      `${API_BASE}/api/v1/users/${userId}/change-password`,
      { matKhauCu: passwords.value.current, matKhauMoi: passwords.value.new },
      getAuthHeaders()
    );
    passwords.value = { current: '', new: '', confirm: '' };
    showToast('Đổi mật khẩu thành công!');
  } catch (err) {
    showToast(err.response?.data?.message || 'Mật khẩu hiện tại không đúng!', 'error');
  } finally {
    isSavingPwd.value = false;
  }
};

const handleAvatarChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    showToast('Ảnh không được vượt quá 5MB!', 'error');
    return;
  }
  rawImage.value      = URL.createObjectURL(file);
  cropZoom.value      = 0;
   lastZoomVal.value   = 0; 
  cropModalOpen.value = true;
  e.target.value      = '';
};

const confirmCrop = async () => {
  const { canvas } = cropperRef.value.getResult();
  const base64 = canvas.toDataURL('image/jpeg', 0.88);
  cropModalOpen.value     = false;
  user.value.avatar       = base64;
  isUploadingAvatar.value = true;
  const userId = sessionStorage.getItem('admin_userId');
  try {
    await axios.put(
      `${API_BASE}/api/v1/users/${userId}/avatar`,
      { anhDaiDien: base64 },
      getAuthHeaders()
    );
    userBackup.value.avatar = base64;
    sessionStorage.setItem('admin_avatar', base64);
    window.dispatchEvent(new CustomEvent('avatar-updated', { detail: base64 }));
    showToast('Cập nhật ảnh đại diện thành công!');
  } catch (err) {
    showToast(err.response?.data?.message || 'Không thể lưu ảnh đại diện!', 'error');
  } finally {
    isUploadingAvatar.value = false;
  }
};

onMounted(fetchProfile);
</script>

<style scoped>
/* ═══════════════════ VARS ═══════════════════ */
.adm-profile-wrap {
  --green:      #3d7317;
  --green-mid:  #5b8e1d;
  --green-lt:   #eef6e3;
  --green-bd:   #c8e29a;
  --amber:      #b45309;
  --amber-mid:  #d97706;
  --amber-lt:   #fef9ec;
  --amber-bd:   #fcd34d;
  --blue-lt:    #eff6ff;
  --blue-mid:   #3b82f6;
  --blue-bd:    #bfdbfe;
  --gray-50:    #f9fafb;
  --gray-100:   #f3f4f6;
  --gray-200:   #e5e7eb;
  --gray-400:   #9ca3af;
  --gray-600:   #4b5563;
  --gray-900:   #111827;
  font-family: 'Quicksand', sans-serif;
  padding: 24px;
  background: #f5f7f2;
  min-height: 100vh;
}

/* ═══════════════════ PAGE HEADER ═══════════════════ */
.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
}
.page-header__icon {
  width: 48px; height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--green-mid), var(--green));
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(61,115,23,.3);
}
.page-header__title {
  font-size: 1.3rem; font-weight: 700;
  color: var(--gray-900); margin: 0;
}
.page-header__sub {
  font-size: .8rem; color: var(--gray-400); margin: 2px 0 0;
}

/* ═══════════════════ LOADING ═══════════════════ */
.loading-state {
  text-align: center; padding: 80px 20px; color: var(--gray-400);
}
.loading-spinner {
  width: 40px; height: 40px;
  border: 3px solid var(--green-lt);
  border-top-color: var(--green-mid);
  border-radius: 50%;
  animation: spin .8s linear infinite;
  margin: 0 auto 16px;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ═══════════════════ LAYOUT ═══════════════════ */
.profile-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  align-items: start;
}
@media (max-width: 900px) {
  .profile-layout { grid-template-columns: 1fr; }
}
.main-col { display: flex; flex-direction: column; gap: 20px; }

/* ═══════════════════ SIDEBAR ═══════════════════ */
.sidebar-card {
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--green-bd);
  box-shadow: 0 4px 24px rgba(61,115,23,.1);
  position: sticky;
  top: 20px;
  background: #fff;
}

.sidebar-banner {
  background: linear-gradient(145deg, #3d7317 0%, #5b8e1d 55%, #7ab52d 100%);
  padding: 36px 24px 28px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.banner-rings { position: absolute; inset: 0; pointer-events: none; }
.banner-ring {
  position: absolute; border-radius: 50%;
  border: 1px solid rgba(255,255,255,.12);
}
.ring-1 { width: 220px; height: 220px; top: -80px; right: -60px; }
.ring-2 { width: 160px; height: 160px; bottom: -60px; left: -40px; }

.avatar-frame {
  width: 100px; height: 100px;
  border-radius: 50%;
  background: rgba(255,255,255,.15);
  border: 3px solid rgba(255,255,255,.35);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
  margin: 0 auto;
  box-shadow: 0 8px 24px rgba(0,0,0,.2);
}
.avatar-img    { width: 100%; height: 100%; object-fit: cover; }
.avatar-letter { font-size: 2.4rem; font-weight: 700; color: #fff; }

.avatar-cam {
  position: absolute; bottom: 2px; right: 2px;
  width: 32px; height: 32px; border-radius: 50%;
  background: #fff; color: var(--green-mid);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: .85rem;
  border: 2px solid rgba(255,255,255,.6);
  box-shadow: 0 2px 8px rgba(0,0,0,.2);
  transition: all .2s;
}
.avatar-cam:hover { background: var(--green-mid); color: #fff; }

.sidebar-name {
  color: #fff; font-size: 1.1rem; font-weight: 700;
  margin: 16px 0 8px; position: relative;
}
.sidebar-role-badge {
  display: inline-flex; align-items: center;
  background: rgba(255,255,255,.18);
  border: 1px solid rgba(255,255,255,.25);
  color: rgba(255,255,255,.9);
  font-size: .72rem; font-weight: 600;
  padding: 4px 14px; border-radius: 50px;
  position: relative;
}

.sidebar-info { padding: 20px 20px 24px; display: flex; flex-direction: column; gap: 4px; }
.info-row {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px; border-radius: 12px;
  transition: background .15s;
}
.info-row:hover { background: var(--green-lt); }
.info-row__icon {
  width: 34px; height: 34px; border-radius: 10px;
  background: var(--green-lt);
  color: var(--green-mid);
  display: flex; align-items: center; justify-content: center;
  font-size: .85rem; flex-shrink: 0;
}
.info-row__body  { display: flex; flex-direction: column; min-width: 0; }
.info-row__label { font-size: .68rem; font-weight: 600; color: var(--gray-400); text-transform: uppercase; letter-spacing: .4px; }
.info-row__val   { font-size: .82rem; font-weight: 600; color: var(--gray-900); word-break: break-all; margin-top: 1px; }

/* ═══════════════════ PROFILE CARD ═══════════════════ */
.profile-card {
  background: #fff;
  border-radius: 20px;
  padding: 28px 32px;
  border: 1px solid var(--gray-200);
  box-shadow: 0 2px 16px rgba(0,0,0,.05);
}

.profile-card__header {
  display: flex; align-items: center; gap: 14px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1.5px solid var(--gray-100);
}
.section-icon {
  width: 44px; height: 44px; border-radius: 13px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; flex-shrink: 0;
}
.section-icon--blue  { background: var(--blue-lt);  color: var(--blue-mid); }
.section-icon--amber { background: var(--amber-lt); color: var(--amber-mid); }

.section-title { font-size: 1rem; font-weight: 700; color: var(--gray-900); margin: 0 0 2px; }
.section-sub   { font-size: .78rem; color: var(--gray-400); margin: 0; }

/* ═══════════════════ FIELDS ═══════════════════ */
.field-lbl {
  font-size: .78rem; font-weight: 700;
  color: var(--gray-600);
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 7px; letter-spacing: .2px;
}
.locked-badge {
  display: inline-flex; align-items: center;
  font-size: .68rem; font-weight: 500; color: var(--gray-400);
  background: var(--gray-100); border-radius: 50px;
  padding: 2px 8px;
}
.field-wrap {
  position: relative; display: flex; align-items: center;
  border: 1.5px solid var(--gray-200);
  border-radius: 12px;
  padding: 0 14px;
  background: var(--gray-50);
  transition: all .2s;
}
.field-wrap:focus-within {
  border-color: var(--green-mid);
  box-shadow: 0 0 0 3px rgba(91,142,29,.12);
  background: #fff;
}
.field-wrap--disabled { opacity: .55; pointer-events: none; }
.field-wrap--error { border-color: #dc2626 !important; box-shadow: 0 0 0 3px rgba(220,38,38,.08) !important; }

.field-ico { color: var(--gray-400); font-size: .9rem; flex-shrink: 0; margin-right: 2px; }
.field-inp {
  flex: 1; border: none; background: transparent; outline: none;
  padding: 12px 8px; font-size: .875rem; color: var(--gray-900);
  font-family: 'Quicksand', sans-serif; font-weight: 500;
}
.field-inp::placeholder { color: var(--gray-400); font-weight: 400; }

.eye-btn {
  background: none; border: none; color: var(--gray-400);
  cursor: pointer; padding: 4px 0 4px 8px;
  transition: color .2s; flex-shrink: 0;
  font-size: .9rem;
}
.eye-btn:hover { color: var(--green-mid); }

/* ═══════════════════ PASSWORD RULES ═══════════════════ */
.pwd-rules {
  margin-top: 10px; padding: 12px 14px;
  background: var(--gray-50); border-radius: 10px;
  border: 1px solid var(--gray-200);
  display: flex; flex-direction: column; gap: 6px;
}
.pwd-rule { font-size: .75rem; font-weight: 600; display: flex; align-items: center; }
.rule--pass { color: #16a34a; }
.rule--fail  { color: #dc2626; }
.field-error   { font-size: .75rem; color: #dc2626; font-weight: 600; margin: 0; display: flex; align-items: center; }
.field-success { font-size: .75rem; color: #16a34a; font-weight: 600; margin: 0; display: flex; align-items: center; }

/* ═══════════════════ ACTIONS ═══════════════════ */
.form-actions {
  display: flex; justify-content: flex-end; gap: 10px;
  margin-top: 28px; padding-top: 20px;
  border-top: 1.5px solid var(--gray-100);
  flex-wrap: wrap;
}

.btn-primary-adm {
  display: inline-flex; align-items: center;
  padding: 11px 24px; border-radius: 50px; border: none;
  background: linear-gradient(135deg, var(--green-mid), var(--green));
  color: #fff; font-size: .875rem; font-weight: 700;
  cursor: pointer; transition: all .2s;
  font-family: 'Quicksand', sans-serif;
  box-shadow: 0 4px 14px rgba(61,115,23,.35);
  letter-spacing: .2px;
}
.btn-primary-adm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(61,115,23,.4);
}
.btn-primary-adm:disabled { opacity: .45; cursor: not-allowed; transform: none; box-shadow: none; }

.btn-primary-adm--amber {
  background: linear-gradient(135deg, var(--amber-mid), var(--amber));
  box-shadow: 0 4px 14px rgba(180,83,9,.3);
}
.btn-primary-adm--amber:hover:not(:disabled) {
  box-shadow: 0 8px 20px rgba(180,83,9,.4);
}

.btn-ghost {
  display: inline-flex; align-items: center;
  padding: 11px 22px; border-radius: 50px;
  border: 1.5px solid var(--gray-200); background: #fff;
  color: var(--gray-600); font-size: .875rem; font-weight: 600;
  cursor: pointer; transition: all .2s;
  font-family: 'Quicksand', sans-serif;
}
.btn-ghost:hover { border-color: var(--green-bd); background: var(--green-lt); color: var(--green); }

/* ═══════════════════ TOAST ═══════════════════ */
.adm-toast {
  position: fixed; bottom: 28px; right: 28px; z-index: 9999;
  padding: 14px 20px; border-radius: 14px;
  font-size: .875rem; font-weight: 600;
  display: flex; align-items: center; gap: 12px;
  box-shadow: 0 12px 32px rgba(0,0,0,.15);
  min-width: 260px;
}
.adm-toast__icon {
  width: 30px; height: 30px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: .9rem; flex-shrink: 0;
}
.adm-toast--success {
  background: #f0fdf4; color: #15803d;
  border: 1px solid #bbf7d0;
}
.adm-toast--success .adm-toast__icon { background: #dcfce7; color: #16a34a; }
.adm-toast--error {
  background: #fef2f2; color: #dc2626;
  border: 1px solid #fecaca;
}
.adm-toast--error .adm-toast__icon { background: #fee2e2; color: #dc2626; }

.toast-slide-enter-active, .toast-slide-leave-active { transition: all .35s cubic-bezier(.34,1.56,.64,1); }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateX(30px) scale(.95); }
/* ═══ CROP MODAL ═══ */
.crop-overlay {
  position: fixed; inset: 0; z-index: 99999;
  background: rgba(0,0,0,.6);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.crop-modal {
  background: #fff; border-radius: 20px;
  width: 440px; max-width: 95vw;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0,0,0,.3);
}
.crop-header {
  display: flex; align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f0f0f0;
}
.crop-title { font-size: 15px; font-weight: 700; margin: 0; color: #1a1a1a; }
.crop-sub   { font-size: 12px; color: #aaa; margin: 4px 0 0; }
.crop-close-btn {
  width: 32px; height: 32px; border-radius: 50%;
  border: 1px solid #e5e5e5; background: #f8f8f8;
  cursor: pointer; display: flex; align-items: center;
  justify-content: center; font-size: 13px; color: #666;
  flex-shrink: 0; transition: all .2s;
}
.crop-close-btn:hover { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }

.crop-body { padding: 20px 24px 16px; }

.crop-canvas-wrap {
  border-radius: 14px; overflow: hidden;
  height: 280px; background: #111;
}
.crop-canvas { height: 280px; }

/* Override vue-advanced-cropper mặc định */
:deep(.vue-advanced-cropper__background)  { background: #111 !important; }
:deep(.vue-advanced-cropper__foreground)  { background: rgba(0,0,0,.5) !important; }
:deep(.vue-circle-stencil__preview)       { border: 2.5px solid #fff !important; }

.crop-zoom-row {
  display: flex; align-items: center; gap: 10px;
  margin-top: 16px;
}
.crop-zoom-icon { font-size: 16px; color: #aaa; flex-shrink: 0; }
.crop-zoom-slider {
  flex: 1; -webkit-appearance: none; height: 4px;
  border-radius: 2px; background: #e5e5e5; outline: none; cursor: pointer;
}
.crop-zoom-slider::-webkit-slider-thumb {
  -webkit-appearance: none; width: 16px; height: 16px;
  border-radius: 50%; background: #1a1a1a;
  border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,.2); cursor: pointer;
}

.crop-preview-row { margin-top: 14px; }
.crop-preview-box {
  display: flex; align-items: center; gap: 12px;
  background: #f8f8f8; border-radius: 12px;
  padding: 10px 14px; border: 1px solid #f0f0f0;
}
.crop-preview-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  background: #e0e0e0; overflow: hidden; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 16px; color: #888;
}
.crop-preview-avatar img { width: 100%; height: 100%; object-fit: cover; }
.crop-preview-label { font-size: 13px; font-weight: 600; color: #1a1a1a; margin: 0; }
.crop-preview-sub   { font-size: 11px; color: #aaa; margin: 2px 0 0; }

.crop-footer {
  display: flex; justify-content: flex-end; gap: 10px;
  padding: 14px 24px 20px;
  border-top: 1px solid #f0f0f0;
}
.crop-btn-cancel {
  padding: 9px 20px; border-radius: 50px;
  border: 1px solid #e5e5e5; background: #fff;
  font-size: 14px; color: #666; cursor: pointer;
  font-family: inherit; transition: background .2s;
}
.crop-btn-cancel:hover { background: #f5f5f5; }
.crop-btn-save {
  padding: 9px 22px; border-radius: 50px;
  border: none; background: #1a1a1a; color: #fff;
  font-size: 14px; font-weight: 600; cursor: pointer;
  font-family: inherit; display: flex; align-items: center;
  transition: opacity .2s;
}
.crop-btn-save:hover:not(:disabled) { opacity: .8; }
.crop-btn-save:disabled { opacity: .4; cursor: not-allowed; }

.crop-fade-enter-active, .crop-fade-leave-active { transition: all .25s ease; }
.crop-fade-enter-from, .crop-fade-leave-to { opacity: 0; }
.crop-fade-enter-active .crop-modal,
.crop-fade-leave-active .crop-modal { transition: transform .25s ease; }
.crop-fade-enter-from .crop-modal,
.crop-fade-leave-to .crop-modal { transform: scale(.95) translateY(10px); }
</style>