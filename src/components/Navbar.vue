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
            <div class="search-box position-relative">
              <input 
                type="text" 
                class="form-control rounded-pill ps-4 border-secondary-subtle" 
                placeholder="Bạn tìm gì hôm nay?" 
              />
              <i class="bi bi-search search-icon"></i>
            </div>
          </div>

          <div class="col-lg-4 col-6 d-flex align-items-center justify-content-end gap-3 gap-xl-4">
            
            <div class="d-none d-xl-flex align-items-center">
              <div class="hotline-container">
                <i class="bi bi-telephone-fill fs-3 me-2 text-secondary shake-animation"></i>
              </div>
              <div class="lh-1">
                <small class="text-muted d-block" style="font-size: 11px;">Hotline</small>
                <strong class="phone-number text-main-brown">093 897 6718</strong>
              </div>
            </div>

            <router-link to="/dang-nhap" class="d-flex align-items-center text-decoration-none text-dark hover-green-text">
              <i class="bi bi-person fs-2 me-2 text-secondary"></i>
              <div class="lh-1">
                <span class="d-block fw-bold" style="font-size: 13px;">Đăng nhập</span>
                <span class="d-block fw-bold" style="font-size: 13px;">Đăng ký</span>
              </div>
            </router-link>

            <router-link to="/gio-hang" class="cart-btn d-flex align-items-center text-white text-decoration-none shadow-sm">
              <i class="bi bi-cart3 fs-4 me-2"></i>
              <div class="lh-1">
                <small class="d-block" style="font-size: 11px;">Giỏ</small>
                <strong style="font-size: 14px;">hàng</strong>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <nav class="main-menu">
      <div class="container-fluid px-lg-5">
        <div class="d-flex align-items-center justify-content-between w-100">
          <ul class="nav">
            <li class="nav-item">
              <router-link to="/" class="nav-link">TRANG CHỦ</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/ve-vipep" class="nav-link">VỀ VIPEP</router-link>
            </li>
            
           <li class="nav-item dropdown custom-dropdown">
  <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">SẢN PHẨM</a>
  <ul class="dropdown-menu shadow">
    <li>
      <router-link class="dropdown-item fw-bold text-success" to="/san-pham">
        <i class="bi bi-grid-fill me-2"></i>TẤT CẢ SẢN PHẨM
      </router-link>
    </li>
    <li><hr class="dropdown-divider"></li>

    <li>
      <router-link class="dropdown-item" to="/san-pham/gia-vi">
        GIA VỊ
      </router-link>
    </li>
    <li>
      <router-link class="dropdown-item" to="/san-pham/muoi-himalaya">
        MUỐI HỒNG HIMALAYA
      </router-link>
    </li>
    <li>
      <router-link class="dropdown-item" to="/san-pham/nguyen-lieu">
        NGUYÊN LIỆU
      </router-link>
    </li>
    <li>
      <router-link class="dropdown-item" to="/san-pham/combo">
        COMBO NẤU ĂN
      </router-link>
    </li>
  </ul>
</li>

            <li class="nav-item dropdown custom-dropdown">
              <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">CATALOGUE VIPEP</a>
              <ul class="dropdown-menu shadow">
                <li>
                  <a class="dropdown-item text-uppercase" 
                     href="https://drive.google.com/uc?export=download&id=1sZkwEZaYF0PTXBiyuHO-VsJ_Ix_daAo1" 
                     target="_blank">
                    <i class="bi bi-file-earmark-pdf me-2 text-danger"></i>Catalogue Vipep 2024
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" target="_blank">
                    <i class="bi bi-translate me-2 text-primary"></i>VIETNAMESE - ENGLISH
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" target="_blank">
                    <i class="bi bi-globe me-2 text-success"></i>CATALOGUE CHINESE
                  </a>
                </li>
              </ul>
            </li>

            <li class="nav-item">
              <router-link to="/hot-deal" class="nav-link">HOT DEAL</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/tin-tuc" class="nav-link">TIN TỨC</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/lien-he" class="nav-link border-end-0">LIÊN HỆ</router-link>
            </li>
          </ul>

          <div class="store-link d-none d-md-block">
            <router-link to="/he-thong-cua-hang" class="text-white text-decoration-none fw-bold small hover-green-text">
              <i class="bi bi-geo-alt-fill me-1"></i> Hệ thống cửa hàng
            </router-link>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'HeaderComponent'
}
</script>

<style scoped>
/* Biến màu sắc cục bộ */
.header-wrapper {
  --main-brown: #4d3105;
  --hover-green: #7eb33d;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* --- TOP BAR --- */
.main-logo {
  max-height: 55px;
  width: auto;
  transition: transform 0.3s ease;
}
.main-logo:hover {
  transform: scale(1.05);
}

.search-box input {
  height: 42px;
  border-radius: 25px !important;
  box-shadow: none;
  transition: border-color 0.3s;
}
.search-box input:focus {
  border-color: var(--hover-green);
  box-shadow: 0 0 0 0.2rem rgba(126, 179, 61, 0.25);
}
.search-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  cursor: pointer;
}

.text-main-brown { color: var(--main-brown); }

.cart-btn {
  background-color: var(--main-brown);
  padding: 8px 15px;
  border-radius: 10px;
  min-width: 105px;
  transition: background 0.3s ease;
}
.cart-btn:hover {
  background-color: var(--hover-green);
}

.hover-green-text:hover span, 
.hover-green-text:hover i {
  color: var(--hover-green) !important;
}

/* Hiệu ứng rung Hotline */
@keyframes shake {
  0% { transform: rotate(0deg); }
  10% { transform: rotate(-10deg); }
  20% { transform: rotate(10deg); }
  30% { transform: rotate(-10deg); }
  40% { transform: rotate(10deg); }
  50% { transform: rotate(0deg); }
  100% { transform: rotate(0deg); }
}
.shake-animation {
  display: inline-block;
  animation: shake 1s infinite;
}

/* --- NAVIGATION MENU --- */
.main-menu {
  background-color: var(--main-brown);
}

.nav-link {
  color: #ffffff !important;
  font-size: 13px !important;
  font-weight: 700;
  padding: 14px 18px !important;
  border-right: 1px solid rgba(255,255,255,0.1);
  transition: all 0.3s ease;
  text-transform: uppercase;
}

.nav-link:hover, 
.nav-link.router-link-active {
  color: var(--hover-green) !important;
  background-color: rgba(255, 255, 255, 0.05);
}

/* --- DROPDOWN CUSTOM --- */
.custom-dropdown .dropdown-menu {
  border: none;
  border-radius: 0 0 8px 8px;
  margin-top: 0;
  padding: 10px 0;
  border-top: 3px solid var(--hover-green);
  min-width: 240px;
}

.dropdown-item {
  font-size: 13px;
  font-weight: 600;
  padding: 10px 20px;
  color: #333;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}

.dropdown-item i {
  font-size: 1.1rem;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: var(--hover-green);
  padding-left: 25px;
}

/* --- MOBILE RESPONSIVE --- */
@media (max-width: 991px) {
  .nav { 
    overflow-x: auto; 
    white-space: nowrap; 
    flex-wrap: nowrap; 
    -webkit-overflow-scrolling: touch;
  }
  .nav-link { 
    border-right: none; 
    padding: 12px 15px !important;
  }
  .nav::-webkit-scrollbar {
    display: none; /* Ẩn thanh cuộn trên mobile */
  }
}
</style>