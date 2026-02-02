<template>
  <header class="header-wrapper sticky-top shadow-sm">
    <div class="top-bar py-3 bg-white border-bottom">
      <div class="container-fluid px-lg-5">
        <div class="row align-items-center">
          <div class="col-lg-2 col-6">
            <router-link to="/">
              <img src="@/assets/images/logo.png" alt="VIPEP Logo" class="main-logo" />
            </router-link>
          </div>
          
          <div class="col-lg-6 d-none d-lg-block">
            <div class="search-wrapper">
              <input type="text" class="search-input" placeholder="Tìm kiếm gia vị, nguyên liệu nấu ăn...">
              <button class="search-btn"><i class="bi bi-search"></i></button>
            </div>
          </div>

          <div class="col-lg-4 col-6 d-flex align-items-center justify-content-end gap-2 gap-md-3">
            <div class="d-none d-xl-flex flex-column align-items-end me-2">
               <div class="d-flex align-items-center hotline-link">
                  <i class="bi bi-telephone-fill me-1"></i>
                  <strong>0786.667.447</strong>
               </div>
               <router-link to="/he-thong-cua-hang" class="text-decoration-none text-muted small">
                  <i class="bi bi-geo-alt-fill"></i> Hệ thống cửa hàng
               </router-link>
            </div>
            
            <div class="user-auth-zone">
              <router-link v-if="!isLoggedIn" to="/dang-nhap" class="icon-action-btn">
                <i class="bi bi-person-circle"></i>
                <span class="d-none d-md-inline ms-1">Tài khoản</span>
              </router-link>

              <div v-else class="dropdown">
                <div class="d-flex align-items-center gap-2 cursor-pointer" data-bs-toggle="dropdown" aria-expanded="false">
                  <div class="user-avatar-circle">
                    {{ userName.charAt(0).toUpperCase() }}
                  </div>
                  <div class="d-none d-md-block lh-1 text-start">
                    <div class="small-text text-muted" style="font-size: 10px;">Xin chào,</div>
                    <div class="fw-bold text-dark" style="font-size: 14px;">{{ userName }}</div>
                  </div>
                </div>
                <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2 animate-fade-in">
                  <li>
                    <router-link class="dropdown-item py-2" to="/profile">
                      <i class="bi bi-person me-2 text-success"></i>Tài khoản của tôi
                    </router-link>
                  </li>
                  <li>
                    <router-link class="dropdown-item py-2" to="/don-hang">
                      <i class="bi bi-bag-check me-2 text-success"></i>Đơn hàng đã mua
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

            <router-link to="/gio-hang" class="cart-btn-premium">
              <div class="position-relative">
                <i class="bi bi-bag-check-fill fs-5"></i>
                <span class="cart-count">0</span>
              </div>
              <div class="ms-2 d-none d-md-block lh-1 text-start">
                <div class="small-text">Giỏ hàng</div>
                <div class="cart-total">0đ</div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <nav class="main-nav py-2">
      <div class="container-fluid px-lg-5">
        <div class="d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center">
            <button 
              class="btn category-trigger d-flex align-items-center gap-3 shadow-none text-white" 
              type="button" 
              data-bs-toggle="offcanvas" 
              data-bs-target="#sidebarMenu"
            >
              <div class="hamburger-menu">
                <span></span><span></span><span></span>
              </div>
              <span class="fw-bold text-uppercase">Danh mục Menu</span>
            </button>
            
            <div class="quick-tags d-none d-lg-flex ms-4 gap-3 text-white-50 small">
               <span>#GiaViSach</span>
               <span>#HotDeal</span>
               <span>#ComboTietKiem</span>
            </div>
          </div>
          <div class="d-none d-md-block text-white-50 small italic">
            {{ greetingText }}{{ isLoggedIn ? ', ' + userName : '' }}, Chào mừng bạn đến với Vipep!
          </div>
        </div>
      </div>
    </nav>

    <div class="offcanvas offcanvas-start" tabindex="-1" id="sidebarMenu">
      <div class="offcanvas-header-custom p-4 text-white">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div class="sidebar-logo-box">
            <img src="@/assets/images/logo.png" alt="VIPEP Logo" class="main-logo" />
          </div>
          <button type="button" class="btn-close-custom" data-bs-dismiss="offcanvas">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="welcome-text animate-fade-in">
          <h6 class="mb-0 fw-bold">{{ greetingText }}{{ isLoggedIn ? ' ' + userName : '' }}! 👋</h6>
          <p class="small mb-0 opacity-75">Hôm nay bạn muốn nấu món gì?</p>
        </div>
      </div>
      
      <div class="offcanvas-body p-0">
        <ul class="sidebar-menu-list">
          <li>
            <router-link to="/" class="s-nav-item">
              <i class="bi bi-house-door-fill"></i> Trang chủ
            </router-link>
          </li>
          
          <li>
            <router-link to="/ve-vipep" class="s-nav-item">
              <i class="bi bi-patch-check-fill"></i> Về Vipep
            </router-link>
          </li>

          <li class="has-submenu">
            <div class="accordion accordion-flush" id="sideAcc">
              <div class="accordion-item border-0">
                <button class="accordion-button collapsed s-nav-item" type="button" data-bs-toggle="collapse" data-bs-target="#sCollProd">
                  <i class="bi bi-grid-fill"></i> Sản phẩm
                </button>
                <div id="sCollProd" class="accordion-collapse collapse" data-bs-parent="#sideAcc">
                  <div class="accordion-body p-0 bg-light">
                    <router-link class="s-sub-item" to="/san-pham/gia-vi">Gia Vị</router-link>
                    <router-link class="s-sub-item" to="/san-pham/muoi-himalaya">Muối Hồng Himalaya</router-link>
                    <router-link class="s-sub-item" to="/san-pham/nguyen-lieu">Nguyên Liệu</router-link>
                    <router-link class="s-sub-item" to="/san-pham/combo">Combo Nấu Ăn</router-link>
                  </div>
                </div>
              </div>
              
              <div class="accordion-item border-0">
                <button class="accordion-button collapsed s-nav-item" type="button" data-bs-toggle="collapse" data-bs-target="#sCollCat">
                  <i class="bi bi-journal-album"></i> Catalogue
                </button>
                <div id="sCollCat" class="accordion-collapse collapse" data-bs-parent="#sideAcc">
                  <div class="accordion-body p-0 bg-light">
                    <a class="s-sub-item" href="#">Catalogue 2024 (VN)</a>
                    <a class="s-sub-item" href="#">Catalogue (EN)</a>
                  </div>
                </div>
              </div>
            </div>
          </li>

          <li>
            <router-link to="/hot-deal" class="s-nav-item text-danger fw-bold">
              <i class="bi bi-lightning-charge-fill"></i> Hot Deal
            </router-link>
          </li>
          
          <li>
            <router-link to="/tin-tuc" class="s-nav-item">
              <i class="bi bi-newspaper"></i> Tin tức
            </router-link>
          </li>

          <li>
            <router-link to="/lien-he" class="s-nav-item">
              <i class="bi bi-envelope-paper-fill"></i> Liên hệ
            </router-link>
          </li>

          <li v-if="isLoggedIn" class="mt-3 border-top">
            <a href="#" class="s-nav-item text-danger" @click.prevent="handleLogout">
              <i class="bi bi-box-arrow-right"></i> Đăng xuất
            </a>
          </li>
        </ul>

        <div class="sidebar-footer-info p-4">
            <div class="help-card p-3 rounded-4 bg-light text-center">
              <p class="small text-muted mb-2">Hỗ trợ 24/7</p>
              <a href="tel:0786667447" class="btn btn-vipep-dark w-100 rounded-pill fw-bold">
                <i class="bi bi-headset me-2"></i> 0786.667.447
              </a>
            </div>
            
            <div class="d-flex justify-content-center gap-4 mt-4 text-secondary fs-5 social-icons">
              <i class="bi bi-facebook"></i>
              <i class="bi bi-youtube"></i>
              <i class="bi bi-tiktok"></i>
            </div>
        </div>
      </div>
    </div>
  </header>

  <main><router-view /></main>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const greetingText = ref('Xin chào');
const isLoggedIn = ref(false);
const userName = ref('');

// Kiểm tra trạng thái đăng nhập từ LocalStorage
const checkAuth = () => {
  const savedName = localStorage.getItem('user_name');
  const authStatus = localStorage.getItem('is_auth');
  
  if (savedName && authStatus === 'true') {
    isLoggedIn.value = true;
    // Nếu user_name là email, chỉ lấy phần trước dấu @
    userName.value = savedName.includes('@') ? savedName.split('@')[0] : savedName;
  } else {
    isLoggedIn.value = false;
    userName.value = '';
  }
};

// Hàm xử lý đăng xuất
const handleLogout = () => {
  localStorage.removeItem('user_name');
  localStorage.removeItem('is_auth');
  isLoggedIn.value = false;
  userName.value = '';
  // Reload trang để xóa các trạng thái global nếu có
  window.location.reload();
};

const updateGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) greetingText.value = 'Chào buổi sáng';
  else if (hour < 18) greetingText.value = 'Chào buổi chiều';
  else greetingText.value = 'Chào buổi tối';
};

onMounted(() => {
  updateGreeting();
  checkAuth();
});

// Tự động đóng Offcanvas khi chuyển trang
watch(() => route.path, () => {
  checkAuth(); // Cập nhật lại Auth khi chuyển trang
  const offcanvasElement = document.getElementById('sidebarMenu');
  if (offcanvasElement && offcanvasElement.classList.contains('show')) {
      const btn = document.querySelector('[data-bs-dismiss="offcanvas"]');
      if(btn) btn.click();
  }
});
</script>

<style scoped>
/* --- 1. MAIN HEADER & ACTIONS --- */
.main-logo { max-height: 55px; width: auto; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.main-logo:hover { transform: scale(1.08); }

.search-wrapper { display: flex; background: #f1f5f9; border-radius: 50px; padding: 4px; border: 1px solid #e2e8f0; transition: all 0.3s; }
.search-wrapper:focus-within { background: white; border-color: #5b8e1d; box-shadow: 0 0 0 4px rgba(91, 142, 29, 0.1); }
.search-input { border: none; background: transparent; flex: 1; padding: 8px 20px; outline: none; font-size: 14px; }
.search-btn { background: #5b8e1d; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; transition: 0.3s; }
.search-btn:hover { background: #4A3018; transform: rotate(90deg); }

.icon-action-btn { text-decoration: none; color: #4A3018; display: flex; align-items: center; font-weight: 600; font-size: 14px; transition: 0.3s; }
.icon-action-btn:hover { color: #5b8e1d; }
.icon-action-btn i { font-size: 24px; color: #5b8e1d; }

/* CSS cho User Avatar & Dropdown */
.cursor-pointer { cursor: pointer; }
.user-avatar-circle {
  width: 38px;
  height: 38px;
  background: #5b8e1d;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  border: 2px solid #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: 0.3s;
}
.dropdown-menu { border-top: 3px solid #5b8e1d !important; border-radius: 10px; padding: 10px 0; }
.dropdown-item { font-size: 14px; font-weight: 500; }
.dropdown-item:hover { background-color: #f0f9eb; color: #5b8e1d; }

.cart-btn-premium { background: #5b8e1d; color: white; text-decoration: none; padding: 6px 16px; border-radius: 14px; display: flex; align-items: center; transition: 0.3s; }
.cart-btn-premium:hover { background: #4A3018; transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
.cart-count { position: absolute; top: -10px; right: -10px; background: #ffc107; color: #000; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 50px; border: 2px solid white; }

.main-nav { background: linear-gradient(90deg, #4d7a18 0%, #5b8e1d 100%); }
.hamburger-menu span { display: block; width: 22px; height: 2px; background: white; margin: 5px 0; border-radius: 2px; transition: 0.3s; }

/* --- 2. SIDEBAR (OFFCANVAS) --- */
.offcanvas { width: 320px !important; border: none; box-shadow: 15px 0 35px rgba(0,0,0,0.15); }
.offcanvas-header-custom { background: linear-gradient(135deg, #3d6312 0%, #5b8e1d 100%); position: relative; overflow: hidden; padding-top: 2.5rem !important; }
.sidebar-logo-box { background: rgba(255, 255, 255, 0.15); padding: 8px 18px; border-radius: 15px; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); display: inline-block; }

.btn-close-custom {
  background: transparent !important; border: none !important; color: #ffffff; opacity: 0.5; font-size: 1rem; 
  padding: 10px; transition: all 0.3s ease; position: absolute; top: 10px; right: 10px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.btn-close-custom:hover { opacity: 1; transform: rotate(90deg); }

/* Sidebar Menu Items */
.sidebar-menu-list { list-style: none; padding: 15px 0; margin: 0; }
.sidebar-menu-list li { opacity: 0; transform: translateY(15px); transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
.offcanvas.show .sidebar-menu-list li { opacity: 1; transform: translateY(0); }

/* Staggered Delay cho Menu Mobile */
.offcanvas.show .sidebar-menu-list li:nth-child(1) { transition-delay: 0.1s; }
.offcanvas.show .sidebar-menu-list li:nth-child(2) { transition-delay: 0.15s; }
.offcanvas.show .sidebar-menu-list li:nth-child(3) { transition-delay: 0.2s; }
.offcanvas.show .sidebar-menu-list li:nth-child(4) { transition-delay: 0.25s; }
.offcanvas.show .sidebar-menu-list li:nth-child(5) { transition-delay: 0.3s; }
.offcanvas.show .sidebar-menu-list li:nth-child(6) { transition-delay: 0.35s; }
.offcanvas.show .sidebar-menu-list li:nth-child(7) { transition-delay: 0.4s; }

.s-nav-item { 
  display: flex; align-items: center; padding: 14px 25px; color: #333 !important; 
  text-decoration: none !important; font-weight: 600; font-size: 15px; position: relative; 
  transition: 0.3s; z-index: 1; 
}
.s-nav-item i { margin-right: 15px; font-size: 18px; color: #5b8e1d; }
.s-nav-item:hover { background: #f0f9eb; color: #5b8e1d !important; padding-left: 32px; }

.s-sub-item { 
  display: block; padding: 12px 25px 12px 58px; color: #666; 
  text-decoration: none; font-size: 14px; border-bottom: 1px solid #f8f9fa; transition: 0.2s; 
}
.s-sub-item:hover { color: #5b8e1d; background: #fff; padding-left: 65px; }

/* --- 3. UTILS --- */
.social-icons i { transition: 0.3s; cursor: pointer; }
.social-icons i:hover { color: #5b8e1d; transform: translateY(-5px); }
.btn-vipep-dark { background: #4A3018; color: white; border: none; transition: 0.3s; }
.btn-vipep-dark:hover { background: #5b8e1d; transform: translateY(-2px); }
.italic { font-style: italic; }
.animate-fade-in { animation: fadeIn 0.5s ease backwards; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.accordion-button:focus { box-shadow: none; }
.accordion-button:not(.collapsed) { background-color: #f0f9eb; color: #5b8e1d; }
</style>