<template>
  <div class="cart-page-wrapper font-general">
    

    <main class="main-content bg-light pb-5">
      <div class="container py-4">
           <nav aria-label="breadcrumb" class="py-3">
            <ol class="breadcrumb mb-0 small">
              <li class="breadcrumb-item">
                <router-link to="/" class="text-decoration-none text-muted">
                  <i class="bi bi-house-door-fill me-1"></i>Trang chủ
                </router-link>
              </li>
              <li class="breadcrumb-item active text-main-brown fw-bold" aria-current="page">Về Vipep</li>
            </ol>
          </nav>

        <div class="card border-0 shadow-sm rounded-3 mb-5 overflow-hidden">
          <div class="alert-info-custom p-3 border-bottom d-flex align-items-center">
            <i class="bi bi-info-circle-fill fs-5 me-2"></i>
            <span>Hiện tại giỏ hàng của bạn đang trống. Hãy tiếp tục mua sắm để tìm thấy những sản phẩm ưng ý!</span>
          </div>
          
          <div class="card-body text-center py-5">
            <div class="empty-cart-container mb-4">
              <i class="bi bi-cart-x display-1 text-secondary opacity-25"></i>
            </div>
            <h2 class="fw-bold text-main-brown">Giỏ hàng của bạn chưa có gì</h2>
            <p class="text-muted mx-auto mb-4" style="max-width: 600px;">
              Đừng để giỏ hàng trống trải như thế này! Khám phá ngay hàng trăm loại gia vị tự nhiên, xốt hoàn chỉnh và các sản phẩm nông sản sạch chuẩn xuất khẩu tại Vipep.
            </p>
            <div class="d-flex justify-content-center gap-3">
              <router-link to="/" class="btn btn-vipep-primary px-4 py-2 fw-bold text-uppercase">
                Quay lại cửa hàng
              </router-link>
              <router-link to="/tin-tuc" class="btn btn-outline-secondary px-4 py-2 fw-bold text-uppercase">
                Xem khuyến mãi
              </router-link>
            </div>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-lg-8">
            <div class="voucher-wrapper bg-white p-4 rounded-3 border h-100">
              <h5 class="fw-bold text-main-brown mb-4 d-flex align-items-center">
                <i class="bi bi-tags-fill me-2 text-vipep-green"></i> MÃ GIẢM GIÁ HIỆN CÓ
              </h5>
              
              <div class="row g-3">
                <div class="col-md-6" v-for="(v, i) in vouchers" :key="i">
                  <div class="voucher-box p-3 border rounded-2 d-flex align-items-center">
                    <div class="voucher-icon me-3">
                      <i class="bi bi-ticket-perforated text-vipep-green fs-1"></i>
                    </div>
                    <div>
                      <h6 class="fw-bold mb-1">{{ v.code }}</h6>
                      <p class="small text-muted mb-1">{{ v.desc }}</p>
                      <button @click="copyCode(v.code)" class="btn btn-sm btn-link p-0 text-main-brown fw-bold text-decoration-none">
                        Sao chép mã
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="mt-4 p-3 bg-light rounded-2">
                <p class="small text-muted mb-0">
                  <i class="bi bi-exclamation-circle me-1"></i>
                  Lưu ý: Mã giảm giá chỉ được áp dụng khi bạn tiến hành bước <strong>Thanh Toán</strong>. Mỗi đơn hàng chỉ áp dụng tối đa 01 mã giảm giá.
                </p>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="bg-white p-4 rounded-3 border h-100">
              <h5 class="fw-bold text-main-brown mb-4 text-uppercase">Tại sao chọn Vipep?</h5>
              <div class="policy-item d-flex mb-3">
                <i class="bi bi-truck fs-3 text-vipep-green me-3"></i>
                <div>
                  <h6 class="fw-bold mb-1 small">GIAO HÀNG NHANH CHÓNG</h6>
                  <p class="text-muted small">Nhận hàng trong 2-4 giờ tại TP.HCM</p>
                </div>
              </div>
              <div class="policy-item d-flex mb-3">
                <i class="bi bi-shield-check fs-3 text-vipep-green me-3"></i>
                <div>
                  <h6 class="fw-bold mb-1 small">SẢN PHẨM CHUẨN SẠCH</h6>
                  <p class="text-muted small">Đạt chứng nhận Global GAP và Organic</p>
                </div>
              </div>
              <div class="policy-item d-flex mb-3">
                <i class="bi bi-arrow-repeat fs-3 text-vipep-green me-3"></i>
                <div>
                  <h6 class="fw-bold mb-1 small">ĐỔI TRẢ DỄ DÀNG</h6>
                  <p class="text-muted small">Cam kết đổi trả trong 7 ngày nếu có lỗi</p>
                </div>
              </div>
              <div class="policy-item d-flex">
                <i class="bi bi-headset fs-3 text-vipep-green me-3"></i>
                <div>
                  <h6 class="fw-bold mb-1 small">HỖ TRỢ TẬN TÂM</h6>
                  <p class="text-muted small">Hotline 0786.667.447 sẵn sàng hỗ trợ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

  <div class="wave-separator">
  <svg viewBox="0 0 1440 120" preserveAspectRatio="none" class="wave-svg">
    <path 
      d="M0,0 C360,100 1080,20 1440,80 L1440,120 L0,120 Z" 
      fill="#212529"
      shape-rendering="geometricPrecision">
    </path>
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

<script setup>
const vouchers = [
  { code: 'VIPEP9K', desc: 'Giảm giá 9,000đ cho đơn từ 149k' },
  { code: 'VIPEP20K', desc: 'Giảm giá 20,000đ cho đơn từ 219k' },
  { code: 'FREESHIP30K', desc: 'Giảm 30,000đ phí vận chuyển' },
  { code: 'NEWVIPEP', desc: 'Giảm 10% cho đơn hàng đầu tiên' }
];

const copyCode = (code) => {
  navigator.clipboard.writeText(code);
  alert(`Đã sao chép mã ${code}. Hãy nhập tại trang Thanh Toán!`);
};
</script>

<style scoped>
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



/* ============ PHẦN FIX LỖI THANH TRẮNG (THAY THẾ ĐOẠN CŨ) ============ */
.wave-separator { 
  width: 100%; 
  height: 120px; 
  background-color: #f8f9fa; /* Khớp tuyệt đối với màu bg-light của Main */
  position: relative; 
  margin-bottom: 0; 
  z-index: 1;
  overflow: hidden;
}

.wave-svg { 
  display: block; 
  width: 100%; 
  height: 100%;
  /* Chống răng cưa pixel */
  filter: drop-shadow(0px 1px 0px #212529); 
}

.footer-custom {
  background-color: #212529 !important;
  /* Kéo footer lên 2px để che khít phần đáy wave */
  margin-top: -2px; 
  position: relative;
  z-index: 2;
}

/* ============ CÁC STYLE KHÁC GIỮ NGUYÊN HOẶC TỐI ƯU ============ */
.text-main-brown { color: #4d3105 !important; }
.text-vipep-green { color: #7eb33d !important; }
.btn-vipep-primary { background-color: #4d3105; color: white; border-radius: 25px; transition: 0.3s; }
.btn-vipep-primary:hover { background-color: #7eb33d; color: white; transform: translateY(-2px); }

.main-logo { max-height: 55px; }
.cart-btn { background-color: #4d3105; padding: 8px 15px; border-radius: 10px; }
.active-cart { background-color: #7eb33d !important; }
.main-menu { background-color: #4d3105; }
.nav-link { color: #fff !important; font-size: 13px !important; font-weight: 700; padding: 14px 18px !important; }
.nav-link:hover { color: #7eb33d !important; }

.alert-info-custom {
  background-color: #fff9e6;
  color: #856404;
  font-size: 14px;
  font-weight: 600;
}
.empty-cart-container { animation: float 3s ease-in-out infinite; }
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

.voucher-box {
  transition: all 0.3s;
  border-style: dashed !important;
}
.voucher-box:hover {
  border-color: #7eb33d !important;
  background-color: #f8fdf2;
}

.footer-heading { 
  font-size: 15px; font-weight: 800; border-bottom: 2px solid #7eb33d; 
  padding-bottom: 5px; display: inline-block; 
}
.footer-links a:hover { color: #7eb33d !important; padding-left: 5px; transition: 0.2s; }

@keyframes shake {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(-10deg); }
  75% { transform: rotate(10deg); }
  100% { transform: rotate(0deg); }
}
.shake-animation { animation: shake 1s infinite; display: inline-block; }
/* Hiển thị menu con khi di chuột vào menu cha */
.dropdown-menu li:hover > .dropdown-menu {
  display: block;
  top: 0;
  left: 100%; /* Đẩy menu con sang bên phải */
  margin-top: -1px;
}
</style>