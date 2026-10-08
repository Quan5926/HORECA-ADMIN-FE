<template>
  <div class="app-admin-layout font-general">
    <template v-if="$route.name !== 'login'">
      <header class="header-wrapper sticky-top shadow-sm">

        <!-- TOP BAR -->
        <div class="top-bar py-3 bg-white border-bottom">
          <div class="container-fluid px-lg-5">
            <div class="row align-items-center">

              <!-- LOGO -->
              <div class="col-lg-2 col-6">
                <router-link to="/">
                  <img src="@/assets/images/logo.png" alt="Logo" class="main-logo" />
                  <span class="badge bg-danger ms-2" style="font-size: 0.6rem; vertical-align: top;">ADMIN</span>
                </router-link>
              </div>

              <!-- SEARCH -->
              <div class="col-lg-5 d-none d-lg-block">
                <div class="search-wrapper">
                  <input type="text" class="search-input" placeholder="Nhập mã đơn hàng, số điện thoại hoặc tên sản phẩm...">
                  <button class="search-btn"><i class="bi bi-search"></i></button>
                </div>
              </div>

              <!-- ACTIONS -->
              <div class="col-lg-5 col-6 d-flex align-items-center justify-content-end gap-3">
                <div class="d-none d-md-flex align-items-center gap-3 me-3">
                  <router-link to="/messages" class="position-relative cursor-pointer action-icon text-decoration-none">
                    <i class="bi bi-envelope fs-5 text-muted"></i>
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary" style="font-size: 0.6rem;">3</span>
                  </router-link>
                  <router-link to="/notifications" class="position-relative cursor-pointer action-icon text-decoration-none">
                    <i class="bi bi-bell fs-5 text-muted"></i>
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.6rem;">12</span>
                  </router-link>
                </div>

                <div class="user-auth-zone border-start ps-3">
                  <router-link v-if="!isLoggedIn" to="/dang-nhap" class="icon-action-btn">
                    <i class="bi bi-person-circle"></i>
                    <span class="d-none d-md-inline ms-1">Đăng nhập</span>
                  </router-link>

                  <div v-else class="dropdown">
                    <div class="d-flex align-items-center gap-2 cursor-pointer" data-bs-toggle="dropdown" aria-expanded="false">
                      <div class="user-avatar-circle bg-main-brown">
                        <img v-if="userAvatar" :src="userAvatar" class="user-avatar-img" alt="avatar" />
                        <span v-else>{{ displayName.charAt(0).toUpperCase() || 'A' }}</span>
                      </div>
                      <div class="d-none d-md-block lh-1 text-start">
                        <div class="text-muted" style="font-size: 11px;">Quản trị viên</div>
                        <div class="fw-bold text-dark" style="font-size: 14px;">{{ displayName || 'Admin System' }}</div>
                      </div>
                    </div>
                    <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2 animate-fade-in">
                      <li>
                        <router-link class="dropdown-item py-2" to="/profile">
                          <i class="bi bi-person-badge me-2 text-success"></i>Hồ sơ Admin
                        </router-link>
                      </li>
                      <li>
                        <router-link class="dropdown-item py-2" to="/settings">
                          <i class="bi bi-gear me-2 text-secondary"></i>Cài đặt hệ thống
                        </router-link>
                      </li>
                      <li><hr class="dropdown-divider"></li>
                      <li>
                        <a class="dropdown-item py-2 text-danger" href="#" @click.prevent="handleLogout">
                          <i class="bi bi-box-arrow-right me-2"></i>Đăng xuất
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- MAIN NAV -->
        <nav class="main-nav py-2">
          <div class="container-fluid px-lg-5">
            <div class="d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center">
                <button
                  class="btn category-trigger d-flex align-items-center gap-3 shadow-none text-white border-end pe-4 rounded-0"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#sidebarMenu"
                >
                  <div class="hamburger-menu">
                    <span></span><span></span><span></span>
                  </div>
                  <span class="fw-bold text-uppercase">Menu Quản Trị</span>
                </button>
                <div class="d-none d-lg-flex ms-4 gap-4 align-items-center">
                  <router-link to="/" class="top-nav-link">Tổng quan</router-link>
                  <router-link to="/orders" class="top-nav-link">Đơn hàng <span class="badge bg-warning text-dark ms-1 rounded-pill">5 Mới</span></router-link>
                  <router-link to="/products" class="top-nav-link">Kho hàng</router-link>
                  <router-link to="/reports" class="top-nav-link">Báo cáo</router-link>
                </div>
              </div>
              <div class="d-none d-xl-flex align-items-center gap-3 text-white-50 small italic">
                <span><i class="bi bi-circle-fill text-success" style="font-size: 8px;"></i> Hệ thống hoạt động tốt</span>
                <span>|</span>
                <span>Version 2.4.1</span>
              </div>
            </div>
          </div>
        </nav>

        <!-- ════════════════════════════════
             OFFCANVAS SIDEBAR
        ════════════════════════════════ -->
        <div class="offcanvas offcanvas-start" tabindex="-1" id="sidebarMenu">

          <!-- ── Sidebar Header ── -->
          <div class="sb-header">
            <!-- Close button -->
            <button type="button" class="sb-close-btn" data-bs-dismiss="offcanvas">
              <i class="bi bi-x-lg"></i>
            </button>

            <!-- User identity block -->
            <div class="sb-identity animate-fade-in">
              <div class="sb-avatar-wrap">
                <template v-if="isLoggedIn">
                  <img v-if="userAvatar" :src="userAvatar" alt="Avatar" class="sb-avatar-img" />
                  <span v-else class="sb-avatar-letter">{{ displayName.charAt(0).toUpperCase() || 'A' }}</span>
                </template>
                <i v-else class="bi bi-person-circle sb-avatar-guest"></i>
                <span class="sb-online-dot" v-if="isLoggedIn"></span>
              </div>
              <div class="sb-identity-text">
                <div class="sb-greeting">{{ greetingText }} 👋</div>
                <div class="sb-username">{{ isLoggedIn ? displayName : 'Khách' }}</div>
                <div class="sb-role-badge"><i class="bi bi-patch-check-fill me-1"></i>Quản trị viên</div>
              </div>
            </div>

            <!-- Decorative wave -->
            <svg class="sb-wave" viewBox="0 0 300 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,0 C75,18 225,0 300,12 L300,18 L0,18 Z" fill="rgba(255,255,255,0.06)" />
              <path d="M0,6 C60,18 240,2 300,16 L300,18 L0,18 Z" fill="rgba(255,255,255,0.04)" />
            </svg>
          </div>

          <!-- ── Sidebar Body ── -->
          <div class="offcanvas-body">

            <!-- Section: Tổng quan -->
            <div class="sb-section-label">
              <span class="sb-section-line"></span>
              <span class="sb-section-text">Tổng quan</span>
              <span class="sb-section-line"></span>
            </div>

            <ul class="sb-menu-list">
              <li class="sb-menu-item-wrap" style="--item-delay: 0ms">
                <router-link to="/" class="sb-item">
                  <span class="sb-item-icon sb-item-icon--blue"><i class="bi bi-speedometer2"></i></span>
                  <span class="sb-item-label">Dashboard</span>
                  <i class="bi bi-arrow-right-short sb-item-arrow"></i>
                </router-link>
              </li>
              <li class="sb-menu-item-wrap" style="--item-delay: 40ms">
                <router-link to="/orders" class="sb-item">
                  <span class="sb-item-icon sb-item-icon--amber"><i class="bi bi-cart-check"></i></span>
                  <span class="sb-item-label">Đơn hàng</span>
                  <span class="sb-badge sb-badge--amber">5 Mới</span>
                </router-link>
              </li>
              <li class="sb-menu-item-wrap" style="--item-delay: 80ms">
                <router-link to="/reports" class="sb-item">
                  <span class="sb-item-icon sb-item-icon--green"><i class="bi bi-graph-up-arrow"></i></span>
                  <span class="sb-item-label">Báo cáo & Thống kê</span>
                  <i class="bi bi-arrow-right-short sb-item-arrow"></i>
                </router-link>
              </li>
            </ul>

            <!-- Section: Quản lý -->
            <div class="sb-section-label">
              <span class="sb-section-line"></span>
              <span class="sb-section-text">Quản lý</span>
              <span class="sb-section-line"></span>
            </div>

            <ul class="sb-menu-list">
              <!-- Sản phẩm accordion -->
              <li class="sb-menu-item-wrap" style="--item-delay: 0ms">
                <button
                  type="button"
                  class="sb-item sb-item--toggle"
                  :class="{ 'sb-item--open': expandedGroups.has('products') }"
                  @click="toggleGroup('products')"
                >
                  <span class="sb-item-icon sb-item-icon--purple"><i class="bi bi-box-seam"></i></span>
                  <span class="sb-item-label">Sản phẩm</span>
                  <span class="sb-item-count">4</span>
                  <i class="bi bi-chevron-down sb-item-chevron" :class="{ 'rotated': expandedGroups.has('products') }"></i>
                </button>
                <div class="sb-accordion" :class="{ 'sb-accordion--open': expandedGroups.has('products') }">
                  <div class="sb-accordion-inner">
                    <router-link class="sb-child-item" to="/products/add">
                      <span class="sb-child-dot sb-child-dot--green"></span>
                      <span>Đăng sản phẩm mới</span>
                      <span class="sb-badge sb-badge--green ms-auto">Mới</span>
                    </router-link>
                    <router-link class="sb-child-item" to="/products">
                      <span class="sb-child-dot"></span><span>Danh sách sản phẩm</span>
                    </router-link>
                    <router-link class="sb-child-item" to="/categories">
                      <span class="sb-child-dot"></span><span>Danh mục hàng hóa</span>
                    </router-link>
                    <router-link class="sb-child-item" to="/inventory">
                      <span class="sb-child-dot sb-child-dot--red"></span>
                      <span>Cảnh báo tồn kho</span>
                      <span class="sb-badge sb-badge--red ms-auto">!</span>
                    </router-link>
                  </div>
                </div>
              </li>

              <!-- Khuyến mãi accordion -->
              <li class="sb-menu-item-wrap" style="--item-delay: 40ms">
                <button
                  type="button"
                  class="sb-item sb-item--toggle"
                  :class="{ 'sb-item--open': expandedGroups.has('promo') }"
                  @click="toggleGroup('promo')"
                >
                  <span class="sb-item-icon sb-item-icon--pink"><i class="bi bi-ticket-perforated"></i></span>
                  <span class="sb-item-label">Khuyến mãi & Marketing</span>
                  <span class="sb-item-count">2</span>
                  <i class="bi bi-chevron-down sb-item-chevron" :class="{ 'rotated': expandedGroups.has('promo') }"></i>
                </button>
                <div class="sb-accordion" :class="{ 'sb-accordion--open': expandedGroups.has('promo') }">
                  <div class="sb-accordion-inner">
                    <router-link class="sb-child-item" to="/coupons">
  <span class="sb-child-dot"></span><span>Mã giảm giá</span>
</router-link>
<router-link class="sb-child-item" to="/sales">
  <span class="sb-child-dot"></span><span>Flash Sale</span>
</router-link>
                  </div>
                </div>
              </li>

              <!-- Nội dung accordion -->
              <li class="sb-menu-item-wrap" style="--item-delay: 80ms">
                <button
                  type="button"
                  class="sb-item sb-item--toggle"
                  :class="{ 'sb-item--open': expandedGroups.has('content') }"
                  @click="toggleGroup('content')"
                >
                  <span class="sb-item-icon sb-item-icon--teal"><i class="bi bi-newspaper"></i></span>
                  <span class="sb-item-label">Quản lý Nội dung</span>
                  <span class="sb-item-count">2</span>
                  <i class="bi bi-chevron-down sb-item-chevron" :class="{ 'rotated': expandedGroups.has('content') }"></i>
                </button>
                <div class="sb-accordion" :class="{ 'sb-accordion--open': expandedGroups.has('content') }">
                  <div class="sb-accordion-inner">
                    <router-link class="sb-child-item" to="/news">
                      <span class="sb-child-dot sb-child-dot--blue"></span><span>Đăng bài Tin tức / Ads</span>
                    </router-link>
                    <router-link class="sb-child-item" to="/banners">
                      <span class="sb-child-dot"></span><span>Quản lý Banner quảng cáo</span>
                    </router-link>
                  </div>
                </div>
              </li>

              <!-- Đơn hàng accordion -->
              <li class="sb-menu-item-wrap" style="--item-delay: 120ms">
                <button
                  type="button"
                  class="sb-item sb-item--toggle"
                  :class="{ 'sb-item--open': expandedGroups.has('orders') }"
                  @click="toggleGroup('orders')"
                >
                  <span class="sb-item-icon sb-item-icon--orange"><i class="bi bi-bag-check"></i></span>
                  <span class="sb-item-label">Quản lý Đơn hàng</span>
                  <span class="sb-item-count">2</span>
                  <i class="bi bi-chevron-down sb-item-chevron" :class="{ 'rotated': expandedGroups.has('orders') }"></i>
                </button>
                <div class="sb-accordion" :class="{ 'sb-accordion--open': expandedGroups.has('orders') }">
                  <div class="sb-accordion-inner">
                    <router-link class="sb-child-item" to="/orders">
                      <span class="sb-child-dot"></span>
                      <span>Tất cả đơn hàng</span>
                      <span class="sb-badge sb-badge--gray ms-auto">142</span>
                    </router-link>
                    <router-link class="sb-child-item" to="/returns">
                      <span class="sb-child-dot"></span><span>Đổi / Trả hàng</span>
                    </router-link>
                  </div>
                </div>
              </li>
            </ul>

            <!-- Section: Khác -->
            <div class="sb-section-label">
              <span class="sb-section-line"></span>
              <span class="sb-section-text">Khác</span>
              <span class="sb-section-line"></span>
            </div>

            <ul class="sb-menu-list">
              <li class="sb-menu-item-wrap" style="--item-delay: 0ms">
                <router-link to="/contacts" class="sb-item">
                  <span class="sb-item-icon sb-item-icon--red"><i class="bi bi-envelope-paper"></i></span>
                  <span class="sb-item-label">Quản lý Liên hệ</span>
                  <span class="sb-badge sb-badge--red">Mới</span>
                </router-link>
              </li>
              <li class="sb-menu-item-wrap" style="--item-delay: 40ms">
                <router-link to="/reviews" class="sb-item">
                  <span class="sb-item-icon sb-item-icon--amber"><i class="bi bi-chat-square-text"></i></span>
                  <span class="sb-item-label">Đánh giá & Bình luận</span>
                  <span class="sb-badge sb-badge--amber">Chờ</span>
                </router-link>
              </li>
              <li class="sb-menu-item-wrap" style="--item-delay: 80ms">
                <router-link to="/customers" class="sb-item">
                  <span class="sb-item-icon sb-item-icon--blue"><i class="bi bi-people"></i></span>
                  <span class="sb-item-label">Khách hàng</span>
                  <i class="bi bi-arrow-right-short sb-item-arrow"></i>
                </router-link>
              </li>
              <li class="sb-menu-item-wrap" style="--item-delay: 120ms">
                <router-link to="/staff" class="sb-item">
                  <span class="sb-item-icon sb-item-icon--green"><i class="bi bi-person-vcard"></i></span>
                  <span class="sb-item-label">Quản lý Nhân viên</span>
                  <i class="bi bi-arrow-right-short sb-item-arrow"></i>
                </router-link>
              </li>
              <li class="sb-menu-item-wrap" style="--item-delay: 160ms">
                <router-link to="/settings" class="sb-item">
                  <span class="sb-item-icon sb-item-icon--gray"><i class="bi bi-gear"></i></span>
                  <span class="sb-item-label">Cài đặt hệ thống</span>
                  <i class="bi bi-arrow-right-short sb-item-arrow"></i>
                </router-link>
              </li>
            </ul>

            <!-- Footer -->
            <div class="sb-footer">
              <div class="sb-support-card">
                <div class="sb-support-header">
                  <div class="sb-support-pulse"></div>
                  <span class="sb-support-title">Hỗ trợ IT • 24/7</span>
                </div>
                <a href="mailto:it@onehoreca.vn" class="sb-support-btn">
                  <i class="bi bi-headset"></i>
                  <span>Báo lỗi hệ thống</span>
                </a>
              </div>

              <a v-if="isLoggedIn" href="#" class="sb-auth-btn sb-auth-btn--logout" @click.prevent="handleLogout">
                <i class="bi bi-box-arrow-right"></i> Đăng xuất an toàn
              </a>
            </div>

          </div>
        </div>
        <!-- end offcanvas -->

      </header>

      <main class="bg-light min-vh-100 pb-5">
        <router-view />
      </main>

    </template>

    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { API_BASE } from '@/config/api'
const route  = useRoute();
const router = useRouter();

const greetingText = ref('Xin chào');
const isLoggedIn   = ref(false);
const userName     = ref('');   // luôn là hoTen thật từ backend
const userAvatar   = ref('');

// displayName chỉ là alias để template đọc
const displayName  = userName;

// Accordion groups
const expandedGroups = ref(new Set());
const toggleGroup = (id) => {
  const next = new Set(expandedGroups.value);
  next.has(id) ? next.delete(id) : next.add(id);
  expandedGroups.value = next;
};

// ✅ MỚI — đọc từ sessionStorage, prefix admin_
const checkAuth = async () => {
  const token  = sessionStorage.getItem('admin_token');
  const userId = sessionStorage.getItem('admin_userId');

  if (!token || !userId) {
    isLoggedIn.value = false;
    userName.value   = '';
    userAvatar.value = '';
    return;
  }

  isLoggedIn.value = true;
  userName.value   = sessionStorage.getItem('admin_name') || '';
  userAvatar.value = sessionStorage.getItem('admin_avatar') || '';

  try {
    const res = await axios.get(
      `${API_BASE}/api/v1/users/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const hoTen      = res.data.hoTen || res.data.fullName || res.data.name || '';
    const anhDaiDien = res.data.anhDaiDien || res.data.avatar || '';

    userName.value   = hoTen;
    userAvatar.value = anhDaiDien;

    sessionStorage.setItem('admin_name',   hoTen);
    sessionStorage.setItem('admin_avatar', anhDaiDien);
  } catch {
    // Giữ cache nếu API lỗi
  }
};

// ✅ MỚI
const handleLogout = () => {
  sessionStorage.removeItem('admin_is_auth');
  sessionStorage.removeItem('admin_role');
  sessionStorage.removeItem('admin_token');
  sessionStorage.removeItem('admin_name');
  sessionStorage.removeItem('admin_userId');
  sessionStorage.removeItem('admin_avatar');
  isLoggedIn.value = false;
  userName.value   = '';
  userAvatar.value = '';
  router.replace('/dang-nhap');
};

const updateGreeting = () => {
  const h = new Date().getHours();
  greetingText.value = h < 12 ? 'Chào buổi sáng' : h < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';
};

onMounted(() => {
  updateGreeting();
  checkAuth();

  // ✅ MỚI
window.addEventListener('avatar-updated', (e) => {
  userAvatar.value = e.detail;
  sessionStorage.setItem('admin_avatar', e.detail);
});
window.addEventListener('username-updated', (e) => {
  userName.value = e.detail;
  sessionStorage.setItem('admin_name', e.detail);
});
});

watch(() => route.path, () => {
  checkAuth();
  const el = document.getElementById('sidebarMenu');
  if (el && el.classList.contains('show')) {
    const btn = document.querySelector('[data-bs-dismiss="offcanvas"]');
    if (btn) btn.click();
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700;900&display=swap');

.font-general { font-family: 'Quicksand', sans-serif !important; }

/* ═══════════════════════════════════════════
   1. HEADER TOP BAR
═══════════════════════════════════════════ */
.main-logo { max-height: 55px; width: auto; transition: transform .3s cubic-bezier(.175,.885,.32,1.275); }
.main-logo:hover { transform: scale(1.08); }

.search-wrapper { display: flex; background: #f8f9fa; border-radius: 8px; padding: 4px; border: 1px solid #e2e8f0; transition: all .3s; }
.search-wrapper:focus-within { background: white; border-color: #5b8e1d; box-shadow: 0 0 0 4px rgba(91,142,29,.1); }
.search-input { border: none; background: transparent; flex: 1; padding: 8px 20px; outline: none; font-size: 14px; }
.search-btn { background: #4A3018; color: white; border: none; width: 40px; height: 40px; border-radius: 6px; transition: .3s; }
.search-btn:hover { background: #5b8e1d; }

.action-icon i { transition: .3s ease; }
.action-icon:hover i { color: #5b8e1d !important; }

.icon-action-btn { text-decoration: none; color: #4A3018; display: flex; align-items: center; font-weight: 600; font-size: 14px; transition: .3s; }
.icon-action-btn:hover { color: #5b8e1d; }
.icon-action-btn i { font-size: 24px; color: #5b8e1d; }

.cursor-pointer { cursor: pointer; }
.bg-main-brown { background: #4A3018 !important; }
.user-avatar-circle {
  width: 40px; height: 40px; color: white; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: bold; font-size: 16px;
  border: 2px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,.1);
  overflow: hidden; flex-shrink: 0; transition: .3s;
}
.user-avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }

.dropdown-menu { border-top: 3px solid #4A3018 !important; border-radius: 10px; padding: 10px 0; }
.dropdown-item { font-size: 14px; font-weight: 500; }
.dropdown-item:hover { background-color: #f0f9eb; color: #5b8e1d; }

/* ═══════════════════════════════════════════
   2. MAIN NAV
═══════════════════════════════════════════ */
.main-nav { background: #1f2937; }
.hamburger-menu span { display: block; width: 22px; height: 2px; background: white; margin: 5px 0; border-radius: 2px; transition: .3s; }
.italic { font-style: italic; }
.top-nav-link { color: #d1d5db; text-decoration: none; font-weight: 500; font-size: 15px; transition: color .3s; }
.top-nav-link:hover, .top-nav-link.router-link-active { color: #fff; }

/* ═══════════════════════════════════════════
   3. OFFCANVAS / SIDEBAR
═══════════════════════════════════════════ */
.offcanvas, .offcanvas-start {
  width: 300px !important;
  z-index: 99999 !important;
  height: 100vh !important;
  max-height: 100vh !important;
  display: flex !important;
  flex-direction: column !important;
  border: none;
  box-shadow: 20px 0 60px rgba(0,0,0,.22);
  overflow: hidden;
  border-radius: 0 20px 20px 0;
}
.offcanvas-backdrop { z-index: 99998 !important; }

/* ─── Header ─── */
.sb-header {
  position: relative;
  background: linear-gradient(150deg, #1a2a3f 0%, #243447 60%, #1e3a5f 100%);
  padding: 0;
  flex-shrink: 0;
  overflow: hidden;
}
.sb-header::before {
  content: '';
  position: absolute; inset: 0;
  background-image:
    radial-gradient(circle at 80% 20%, rgba(91,142,29,.18) 0%, transparent 50%),
    radial-gradient(circle at 10% 80%, rgba(255,255,255,.05) 0%, transparent 40%);
  pointer-events: none;
}

.sb-close-btn {
  position: absolute; top: 12px; right: 14px;
  width: 32px; height: 32px; border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,.25) !important;
  background: rgba(255,255,255,.1) !important;
  color: rgba(255,255,255,.75);
  display: flex; align-items: center; justify-content: center;
  font-size: .82rem; cursor: pointer; z-index: 10;
  transition: all .3s cubic-bezier(.175,.885,.32,1.275);
}
.sb-close-btn:hover { background: rgba(255,255,255,.22) !important; color: #fff; transform: rotate(90deg) scale(1.1); }

.sb-identity {
  display: flex; align-items: center; gap: 14px;
  padding: 28px 18px 16px;
  position: relative; z-index: 1;
}

/* Avatar */
.sb-avatar-wrap {
  position: relative; flex-shrink: 0;
  width: 54px; height: 54px;
}
.sb-avatar-img,
.sb-avatar-letter {
  width: 54px; height: 54px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  border: 2.5px solid rgba(255,255,255,.3);
  box-shadow: 0 6px 20px rgba(0,0,0,.35);
  overflow: hidden;
}
.sb-avatar-img { object-fit: cover; }
.sb-avatar-letter {
  background: linear-gradient(135deg, #5b8e1d, #3d6b10);
  color: #fff; font-size: 1.5rem; font-weight: 900;
}
.sb-avatar-guest {
  width: 54px; height: 54px; font-size: 2.2rem;
  color: rgba(255,255,255,.7); display: flex; align-items: center; justify-content: center;
}
.sb-online-dot {
  position: absolute; bottom: 2px; right: 2px;
  width: 13px; height: 13px; border-radius: 50%;
  background: #4ade80; border: 2.5px solid #1a2a3f;
  animation: online-pulse 2.5s infinite;
}
@keyframes online-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(74,222,128,.6); }
  70%  { box-shadow: 0 0 0 7px rgba(74,222,128,0); }
  100% { box-shadow: 0 0 0 0 rgba(74,222,128,0); }
}

/* ✅ Identity text — chữ đậm, to, rõ ràng */
.sb-identity-text { min-width: 0; display: flex; flex-direction: column; gap: 4px; }

.sb-greeting {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,.6);
  letter-spacing: .3px;
}

.sb-username {
  font-size: 17px;
  font-weight: 900;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
  letter-spacing: 0.2px;
  text-shadow: 0 1px 6px rgba(0,0,0,.4);
}

.sb-role-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 800;
  color: #4ade80;
  letter-spacing: .4px;
  text-transform: uppercase;
  background: rgba(74,222,128,.15);
  padding: 2px 9px;
  border-radius: 20px;
  border: 1px solid rgba(74,222,128,.3);
  width: fit-content;
}

/* Wave decoration */
.sb-wave { display: block; width: 100%; height: 18px; position: relative; z-index: 1; margin-bottom: -1px; }

/* ─── Body ─── */
.offcanvas-body {
  flex: 1 1 0 !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  padding: 0 !important;
  display: flex; flex-direction: column;
  background: #fafafa;
}
.offcanvas-body::-webkit-scrollbar { width: 3px; }
.offcanvas-body::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.offcanvas-body::-webkit-scrollbar-thumb:hover { background: #5b8e1d; }

/* ─── Section labels ─── */
.sb-section-label {
  display: flex; align-items: center; gap: 10px;
  padding: 16px 16px 8px;
}
.sb-section-line { flex: 1; height: 1px; background: #e8eaed; }
.sb-section-text {
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1.8px;
  color: #8892a0;
  white-space: nowrap;
}

/* ─── Menu list ─── */
.sb-menu-list { list-style: none; padding: 0 10px; margin: 0; }
.sb-menu-item-wrap { margin-bottom: 2px; }

/* ✅ Menu items — chữ đậm hơn */
.sb-item {
  display: flex; align-items: center; gap: 11px;
  padding: 11px 12px; width: 100%;
  border: none; background: transparent;
  color: #1a202c; text-decoration: none;
  font-size: 14px; font-weight: 700;
  border-radius: 10px; cursor: pointer;
  transition: background .18s, color .18s, transform .18s;
  text-align: left; position: relative;
}
.sb-item:hover {
  background: #fff; color: #3d7317;
  transform: translateX(3px);
  box-shadow: 0 2px 10px rgba(61,115,23,.1);
}
.sb-item.router-link-active {
  background: #f0f9eb; color: #3d7317;
  box-shadow: inset 3px 0 0 #5b8e1d;
  border-radius: 0 10px 10px 0;
}
.sb-item--open {
  background: #fff; color: #3d7317;
  box-shadow: inset 3px 0 0 #5b8e1d;
  border-radius: 0 10px 10px 0;
}

/* Icon chips */
.sb-item-icon {
  flex-shrink: 0; width: 34px; height: 34px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; transition: transform .18s;
}
.sb-item:hover .sb-item-icon, .sb-item--open .sb-item-icon { transform: scale(1.1); }
.sb-item-icon--blue   { background: #dbeafe; color: #2563eb; }
.sb-item-icon--amber  { background: #fef3c7; color: #d97706; }
.sb-item-icon--green  { background: #dcfce7; color: #16a34a; }
.sb-item-icon--purple { background: #ede9fe; color: #7c3aed; }
.sb-item-icon--pink   { background: #fce7f3; color: #db2777; }
.sb-item-icon--teal   { background: #ccfbf1; color: #0d9488; }
.sb-item-icon--orange { background: #ffedd5; color: #ea580c; }
.sb-item-icon--red    { background: #fee2e2; color: #dc2626; }
.sb-item-icon--gray   { background: #f1f5f9; color: #64748b; }

.sb-item:hover .sb-item-icon--blue   { background: #bfdbfe; }
.sb-item:hover .sb-item-icon--amber  { background: #fde68a; }
.sb-item:hover .sb-item-icon--green  { background: #bbf7d0; }
.sb-item:hover .sb-item-icon--purple { background: #ddd6fe; }
.sb-item:hover .sb-item-icon--pink   { background: #fbcfe8; }
.sb-item:hover .sb-item-icon--teal   { background: #99f6e4; }
.sb-item:hover .sb-item-icon--orange { background: #fed7aa; }
.sb-item:hover .sb-item-icon--red    { background: #fecaca; }
.sb-item:hover .sb-item-icon--gray   { background: #e2e8f0; }

.sb-item-label { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sb-item-arrow { font-size: 18px; color: #b0bac4; transition: transform .2s, color .2s; flex-shrink: 0; }
.sb-item:hover .sb-item-arrow { color: #5b8e1d; transform: translateX(3px); }

.sb-item-count {
  font-size: 10.5px; font-weight: 800;
  background: #f0f2f5; color: #6b7280;
  padding: 2px 8px; border-radius: 20px; flex-shrink: 0;
  transition: background .18s, color .18s;
}
.sb-item--open .sb-item-count,
.sb-item:hover .sb-item-count { background: #dcfce7; color: #16a34a; }

.sb-item-chevron {
  font-size: 11px; color: #b0bac4; flex-shrink: 0;
  transition: transform .35s cubic-bezier(.4,0,.2,1), color .2s;
}
.sb-item-chevron.rotated { transform: rotate(-180deg); color: #5b8e1d; }

/* ─── Accordion ─── */
.sb-accordion {
  display: grid; grid-template-rows: 0fr;
  transition: grid-template-rows .38s cubic-bezier(.4,0,.2,1);
  margin-left: 16px;
  border-left: 2px solid #e2f0d6;
  border-radius: 0 0 0 6px;
  overflow: hidden;
}
.sb-accordion--open { grid-template-rows: 1fr; }
.sb-accordion-inner { overflow: hidden; min-height: 0; padding: 0; transition: padding .38s; }
.sb-accordion--open .sb-accordion-inner { padding: 4px 0 6px; }

/* ✅ Child items — font 600 thay vì 500 */
.sb-child-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 12px 9px 16px;
  font-size: 13.5px; font-weight: 600; color: #374151;
  text-decoration: none; border-radius: 0 8px 8px 0;
  transition: color .2s, background .2s, padding-left .2s;
}
.sb-child-item:hover { color: #3d7317; background: #f0f9eb; padding-left: 20px; }
.sb-child-item.router-link-active { color: #3d7317; font-weight: 800; }

.sb-child-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #c8d0db; flex-shrink: 0;
  transition: background .2s, transform .2s;
}
.sb-child-dot--green { background: #86efac; }
.sb-child-dot--blue  { background: #93c5fd; }
.sb-child-dot--red   { background: #fca5a5; }
.sb-child-item:hover .sb-child-dot,
.sb-child-item.router-link-active .sb-child-dot { background: #5b8e1d; transform: scale(1.5); }

/* ─── Badges ─── */
.sb-badge {
  font-size: 10px; font-weight: 800; padding: 2px 8px;
  border-radius: 20px; flex-shrink: 0; letter-spacing: .2px;
}
.sb-badge--red    { background: #fee2e2; color: #dc2626; }
.sb-badge--amber  { background: #fef3c7; color: #b45309; }
.sb-badge--green  { background: #dcfce7; color: #16a34a; }
.sb-badge--gray   { background: #f1f5f9; color: #64748b; }

/* ─── Footer ─── */
.sb-footer {
  margin-top: auto;
  padding: 14px 14px 22px;
  border-top: 1px solid #eef0f3;
  background: #fff;
}
.sb-support-card {
  background: linear-gradient(135deg, #f0f9eb 0%, #e8f5d5 100%);
  border: 1px solid #c8e6a0;
  border-radius: 14px; padding: 13px 14px; margin-bottom: 12px;
}
.sb-support-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.sb-support-pulse {
  width: 8px; height: 8px; border-radius: 50%; background: #22c55e;
  animation: online-pulse 2s infinite;
}
.sb-support-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .8px; color: #3d7317; }
.sb-support-btn {
  display: flex; align-items: center; gap: 9px;
  padding: 10px 16px; border-radius: 30px;
  font-size: 13.5px; font-weight: 700;
  text-decoration: none; transition: all .25s cubic-bezier(.175,.885,.32,1.275);
  background: #3d7317; color: #fff;
}
.sb-support-btn:hover {
  background: #2d5a11; color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(61,115,23,.35);
}

.sb-auth-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 11px 16px; border-radius: 30px;
  font-size: 14px; font-weight: 700; text-decoration: none;
  transition: all .25s ease;
}
.sb-auth-btn--logout {
  background: transparent; color: #dc2626;
  border: 2px solid #fee2e2;
}
.sb-auth-btn--logout:hover {
  background: #fef2f2; border-color: #dc2626;
  transform: translateY(-1px);
}

/* ═══════════════════════════════════════════
   4. UTILS
═══════════════════════════════════════════ */
.animate-fade-in { animation: fadeIn .4s ease backwards; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>