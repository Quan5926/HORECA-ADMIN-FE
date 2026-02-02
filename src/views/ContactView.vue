<template>
  <div class="contact-page-wrapper font-general">
   

    <main class="main-content bg-light pb-5">

        <div class="container-fluid px-lg-5">
             <nav aria-label="breadcrumb" class="py-3">
              <ol class="breadcrumb mb-0 small text-dark">
                <li class="breadcrumb-item">
                  <router-link to="/" class="text-decoration-none text-muted">
                    <i class="bi bi-house-door-fill me-1"></i>Trang chủ
                  </router-link>
                </li>
                <li class="breadcrumb-item active text-main-brown fw-bold" aria-current="page">Liên hệ</li>
              </ol>
            </nav>
        </div>
      

      <div class="container-fluid px-lg-5">
        <div class="row g-5">
          <div class="col-lg-5">
            <div class="bg-white p-4 p-lg-5 rounded-4 shadow-sm h-100">
                <h2 class="fw-bold text-main-brown mb-2">Liên hệ với chúng tôi</h2>
                <p class="text-secondary mb-4 small">Hãy để lại thông tin, ONE HORECA sẽ liên hệ lại ngay!</p>
                
                <div class="contact-info-list mb-5">
                    <div class="d-flex mb-3 align-items-start">
                        <div class="icon-box bg-brown-light text-main-brown rounded-circle p-2 me-3">
                            <i class="bi bi-geo-alt-fill fs-5"></i>
                        </div>
                        <div>
                            <h6 class="fw-bold mb-1 text-dark">Văn phòng giao dịch</h6>
                            <p class="text-muted small mb-0">CÔNG TY ONE HORECA</p>
                            <p class="text-muted small mb-0">47 Hàng Chiếu, Phường Hoàn Kiếm, Hà Nội</p>
                        </div>
                    </div>
                     <div class="d-flex mb-3 align-items-start">
                        <div class="icon-box bg-brown-light text-main-brown rounded-circle p-2 me-3">
                            <i class="bi bi-buildings-fill fs-5"></i>
                        </div>
                        <div>
                            <h6 class="fw-bold mb-1 text-dark">Nhà máy sản xuất</h6>
                            <p class="text-muted small mb-0">47 Hàng Chiếu, Phường Hoàn Kiếm, Hà Nội</p>
                        </div>
                    </div>
                    <div class="d-flex mb-3 align-items-start">
                        <div class="icon-box bg-brown-light text-main-brown rounded-circle p-2 me-3">
                            <i class="bi bi-telephone-fill fs-5"></i>
                        </div>
                        <div>
                            <h6 class="fw-bold mb-1 text-dark">Điện thoại / Hotline</h6>
                            <a href="tel:0786667447" class="text-main-brown fw-bold text-decoration-none fs-5">0786667447</a>
                        </div>
                    </div>
                    <div class="d-flex align-items-start">
                        <div class="icon-box bg-brown-light text-main-brown rounded-circle p-2 me-3">
                            <i class="bi bi-envelope-fill fs-5"></i>
                        </div>
                        <div>
                            <h6 class="fw-bold mb-1 text-dark">Email liên hệ</h6>
                            <a href="mailto:ctyhorecaone@gmail.com" class="text-muted small text-decoration-none hover-green">ctyhorecaone@gmail.com</a>
                        </div>
                    </div>
                </div>

                <hr class="text-secondary opacity-25 my-4">

                <h5 class="fw-bold text-main-brown mb-3">Gửi tin nhắn cho chúng tôi</h5>
                <form @submit.prevent="handleSubmit" class="contact-form-custom">
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control bg-light border-0" id="floatingName" placeholder="Họ tên" required>
                        <label for="floatingName" class="text-secondary">Họ và tên *</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="email" class="form-control bg-light border-0" id="floatingEmail" placeholder="Email" required>
                        <label for="floatingEmail" class="text-secondary">Địa chỉ Email *</label>
                    </div>
                    <div class="form-floating mb-3">
                        <textarea class="form-control bg-light border-0" placeholder="Nội dung" id="floatingContent" style="height: 120px" required></textarea>
                        <label for="floatingContent" class="text-secondary">Nội dung cần tư vấn *</label>
                    </div>
                    
                    <button type="submit" class="btn btn-main-brown w-100 py-3 rounded-pill fw-bold text-uppercase shadow-hover transition-all">
                        Gửi yêu cầu <i class="bi bi-send-fill ms-2"></i>
                    </button>
                </form>
            </div>
          </div>

          <div class="col-lg-7">
            <div class="map-wrapper h-100 rounded-4 overflow-hidden shadow border bg-white p-2">
                <iframe 
                    src="https://maps.google.com/maps?q=47+Hàng+Chiếu,+Hoàn+Kiếm,+Hà+Nội&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                    width="100%" 
                    height="100%" 
                    style="border:0; min-height: 600px; border-radius: 12px;" 
                    allowfullscreen="" 
                    loading="lazy">
                </iframe>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div class="wave-separator">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" class="wave-svg">
        <path d="M0,0 C360,100 1080,20 1440,80 L1440,120 L0,120 Z" fill="#212529"></path>
      </svg>
    </div>

    <footer class="footer-custom py-5 bg-dark text-white">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-3">
            <h5 class="footer-heading text-vipep-green mb-3">CÔNG TY ONE HORECA</h5>
            <p class="footer-text small text-white-50">Chuyên cung cấp các giải pháp F&B, nguyên liệu pha chế và thiết bị nhà hàng khách sạn chất lượng cao.</p>
            <p class="footer-text small">
              <i class="bi bi-geo-alt-fill text-vipep-green me-2"></i> 47 Hàng Chiếu, P. Hoàn Kiếm, Hà Nội<br>
              <i class="bi bi-telephone-fill text-vipep-green me-2"></i> <strong>0786667447</strong><br>
              <i class="bi bi-envelope-fill text-vipep-green me-2"></i> ctyhorecaone@gmail.com
            </p>
          </div>
          <div class="col-md-3">
            <h5 class="footer-heading text-uppercase mb-3">Về Chúng Tôi</h5>
            <ul class="list-unstyled footer-links small">
              <li class="mb-2"><router-link to="/" class="text-white-50 text-decoration-none hover-white">Trang chủ</router-link></li>
              <li class="mb-2"><router-link to="/ve-vipep" class="text-white-50 text-decoration-none hover-white">Giới thiệu One Horeca</router-link></li>
              <li class="mb-2"><router-link to="/san-pham" class="text-white-50 text-decoration-none hover-white">Sản phẩm</router-link></li>
              <li class="mb-2"><router-link to="/tin-tuc" class="text-white-50 text-decoration-none hover-white">Tin tức & Sự kiện</router-link></li>
              <li class="mb-2"><router-link to="/lien-he" class="text-white-50 text-decoration-none hover-white">Liên hệ</router-link></li>
            </ul>
          </div>
          <div class="col-md-3">
            <h5 class="footer-heading text-uppercase mb-3">Hỗ Trợ Khách Hàng</h5>
            <ul class="list-unstyled footer-links small">
              <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none hover-white">Chính sách đổi trả</a></li>
              <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none hover-white">Chính sách bảo mật</a></li>
              <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none hover-white">Điều khoản dịch vụ</a></li>
              <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none hover-white">Hướng dẫn mua hàng</a></li>
            </ul>
          </div>
          <div class="col-md-3">
            <h5 class="footer-heading text-uppercase mb-3">Đăng ký nhận tin</h5>
            <p class="small text-white-50">Nhận thông tin khuyến mãi mới nhất từ One Horeca.</p>
            <div class="input-group mb-3">
              <input type="text" class="form-control form-control-sm rounded-start-pill" placeholder="Email của bạn...">
              <button class="btn btn-success btn-sm rounded-end-pill" type="button">Gửi</button>
            </div>
            <div class="social-icons d-flex gap-3 mt-3">
              <i class="bi bi-facebook fs-4 pointer text-primary bg-white rounded-circle px-1"></i>
              <i class="bi bi-youtube fs-4 pointer text-danger bg-white rounded-circle px-1"></i>
              <i class="bi bi-tiktok fs-4 pointer text-dark bg-white rounded-circle px-1"></i>
            </div>
          </div>
        </div>
        <hr class="my-4 border-secondary">
        <div class="d-md-flex justify-content-between text-center small opacity-75">
          <p class="mb-0">© 2026 Copyright <strong>OneHoreca</strong>. All Rights Reserved.</p>
          <p class="mb-0">Designed by OneHoreca Team</p>
        </div>
      </div>
    </footer>
  </div>
  <div class="floating-contact">
      <a href="tel:0786667447" class="contact-item hotline" title="Gọi hotline">
        <div class="icon-wrapper">
          <i class="bi bi-telephone-fill"></i>
        </div>
        <span class="label">0786.667.447</span>
      </a>

      <a href="https://zalo.me/0786667447" target="_blank" class="contact-item zalo" title="Chat Zalo">
        <div class="icon-wrapper">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/1200px-Icon_of_Zalo.svg.png" alt="Zalo" width="24">
        </div>
        <span class="label">Zalo ngay</span>
      </a>

      <a href="https://m.me/your-fanpage-id" target="_blank" class="contact-item messenger" title="Chat Messenger">
        <div class="icon-wrapper">
          <i class="bi bi-messenger"></i>
        </div>
        <span class="label">Messenger</span>
      </a>

      <button @click="scrollToTop" class="contact-item scroll-top" id="backToTop">
        <i class="bi bi-arrow-up-short"></i>
      </button>
    </div>
</template>

<script>
export default {
  name: 'ContactView',
  methods: {
    handleSubmit() {
      // Logic gửi form
      alert('Cảm ơn bạn đã liên hệ với One Horeca. Chúng tôi sẽ phản hồi trong giây lát!');
    }
  }
}
</script>

<style scoped>
/* ================= VARIABLES & UTILS ================= */
.text-main-brown { color: #4d3105 !important; }
.bg-brown-light { background-color: #f8f1e7; } /* Màu nền nhẹ cho icon */

.btn-main-brown { background-color: #4d3105 !important; border: none; color: white; }
.btn-main-brown:hover { background-color: #7eb33d !important; transform: translateY(-2px); }

.text-vipep-green { color: #7eb33d !important; }

/* ================= HEADER STYLE ================= */
.main-logo { max-height: 55px; }
.cart-btn { background-color: #4d3105; padding: 8px 15px; border-radius: 10px; transition: 0.3s; }
.cart-btn:hover { background-color: #7eb33d; }
.main-menu { background-color: #4d3105; }
.nav-link { color: #fff !important; font-size: 13px !important; font-weight: 700; padding: 14px 18px !important; }
.nav-link:hover, .nav-link.active { color: #7eb33d !important; }

/* ================= MAIN CONTENT ENHANCEMENTS ================= */
.icon-box {
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.hover-green:hover {
    color: #7eb33d !important;
}

/* Floating Form overrides */
.form-floating > .form-control:focus ~ label,
.form-floating > .form-control:not(:placeholder-shown) ~ label {
    color: #4d3105;
    font-weight: 600;
}
.form-control:focus {
    box-shadow: none;
    background-color: #fff !important;
    border: 1px solid #4d3105 !important;
}

.shadow-hover {
    transition: all 0.3s ease;
}
.shadow-hover:hover {
    box-shadow: 0 5px 15px rgba(77, 49, 5, 0.3);
}

.transition-all {
    transition: all 0.3s ease-in-out;
}


/* ================= FLOATING CONTACT BUTTONS ================= */
.floating-contact {
  position: fixed;
  right: 20px;
  bottom: 80px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-item {
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  flex-direction: row-reverse; /* Để nhãn hiện ra bên trái icon */
}

.icon-wrapper {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 22px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  z-index: 2;
  background: white;
}

/* Màu sắc từng loại */
.hotline .icon-wrapper { background: #dc3545; animation: pulse-red 2s infinite; }
.zalo .icon-wrapper { background: #0088ff; }
.messenger .icon-wrapper { background: #0078ff; }
.scroll-top { 
  background: #4d3105; 
  color: white; 
  border: none; 
  width: 45px; 
  height: 45px; 
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

/* Nhãn chữ (Label) hiện ra khi hover */
.contact-item .label {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  margin-right: 10px;
  opacity: 0;
  visibility: hidden;
  transform: translateX(20px);
  transition: all 0.3s ease;
  white-space: nowrap;
}

.contact-item:hover .label {
  opacity: 1;
  visibility: visible;
  transform: translateX(0);
}

.contact-item:hover .icon-wrapper {
  transform: scale(1.1);
}

/* Hiệu ứng rung cho Hotline */
@keyframes pulse-red {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(220, 53, 69, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .floating-contact { right: 10px; bottom: 100px; }
  .icon-wrapper { width: 40px; height: 40px; font-size: 20px; }
  .contact-item .label { display: none; } /* Tắt label trên mobile cho gọn */
}

/* ================= FOOTER & ANIMATION ================= */
.wave-separator { width: 100%; height: 120px; background: #f8f9fa; /* Khớp màu nền Main */ position: relative; margin-bottom: -1px; }
.wave-svg { position: absolute; bottom: 0; width: 100%; height: 120px; display: block; }
@keyframes shake { 0% { transform: rotate(0deg); } 25% { transform: rotate(10deg); } 75% { transform: rotate(-10deg); } 100% { transform: rotate(0deg); } }
.shake-animation { animation: shake 1.5s infinite ease-in-out; }
.pointer { cursor: pointer; transition: transform 0.3s ease; }
.pointer:hover { transform: scale(1.1); }
.hover-white:hover { color: white !important; }
/* Hiển thị menu con khi di chuột vào menu cha */
.dropdown-menu li:hover > .dropdown-menu {
  display: block;
  top: 0;
  left: 100%; /* Đẩy menu con sang bên phải */
  margin-top: -1px;
}
</style>