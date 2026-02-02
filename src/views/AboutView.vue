<template>
  <div class="about-page-wrapper font-general">
    

    <main class="main-content bg-light">
    
        <div class="container-fluid px-lg-5">
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
        </div>
     

      <section class="py-5 bg-white">
        <div class="container">
          <div class="text-center mb-5">
            <h2 class="h6 fw-bold text-vipep-green text-uppercase ls-2 mb-2">VỀ VIPEP</h2>
            <h1 class="display-5 fw-bold text-main-brown mb-3">CÂU CHUYỆN CỦA CHÚNG TÔI</h1>
            <div class="divider-custom mx-auto mb-4"></div>
            <p class="text-secondary fst-italic fs-5">"Mang gia vị Việt vươn tầm thế giới"</p>
          </div>

          <div class="video-container shadow-lg rounded-4 overflow-hidden mb-5">
            <div class="ratio ratio-21x9">
              <iframe src="https://www.youtube.com/embed/MKr7MbbyhTM?rel=0" title="Vipep Story" allowfullscreen></iframe>
            </div>
          </div>
        </div>
      </section>

      <section class="py-5">
        <div class="container">
          <div class="row align-items-center mb-5 gx-lg-5">
            <div class="col-lg-6 mb-4 mb-lg-0">
              <div class="image-box rounded-4 overflow-hidden shadow">
                <img src="@/assets/images/bannergioithieu.jpg" alt="Vipep Development" class="img-fluid w-100 hover-zoom-img" />
              </div>
            </div>
            <div class="col-lg-6">
              <h3 class="fw-bold text-main-brown mb-3 section-title">Sự phát triển vượt bậc</h3>
              <p class="text-secondary lh-lg mb-4">
                Chúng tôi yêu gia vị Việt Nam và mong muốn đưa sản phẩm chất lượng cao ra toàn thế giới. Với niềm đam mê và sự hiểu biết sâu sắc về nông nghiệp, sản lượng xuất khẩu đã tăng mạnh từ năm 2012 – năm thành lập công ty.
              </p>
              <div class="d-flex align-items-center gap-3">
                <div class="stat-item">
                  <span class="d-block h3 fw-bold text-vipep-green mb-0">2012</span>
                  <small class="text-muted">Năm thành lập</small>
                </div>
                <div class="vr mx-2"></div>
                <div class="stat-item">
                  <span class="d-block h3 fw-bold text-vipep-green mb-0">10+</span>
                  <small class="text-muted">Quốc gia xuất khẩu</small>
                </div>
              </div>
            </div>
          </div>

          <div class="row align-items-center flex-row-reverse gx-lg-5">
            <div class="col-lg-6 mb-4 mb-lg-0">
              <div class="image-box rounded-4 overflow-hidden shadow">
                <img src="@/assets/images/denvoinongtrai.jpg" alt="Vipep Source" class="img-fluid w-100 hover-zoom-img" />
              </div>
            </div>
            <div class="col-lg-6">
              <h3 class="fw-bold text-main-brown mb-3 section-title">Nguồn gốc bền vững</h3>
              <p class="text-secondary lh-lg">
                Nhà máy đặt tại trung tâm nguyên liệu lớn nhất Việt Nam, giúp Vipep hoàn toàn chủ động nguồn cung. Sản lượng tiêu được thu hoạch từ các nông trại tiêu biểu tại Gia Lai và Đắk Lắc, nơi có thổ nhưỡng lý tưởng nhất cho cây hồ tiêu.
              </p>
              <ul class="list-unstyled">
                <li class="mb-2"><i class="bi bi-check-circle-fill text-vipep-green me-2"></i>Đak Đoa, Gia Lai</li>
                <li class="mb-2"><i class="bi bi-check-circle-fill text-vipep-green me-2"></i>Ea H'leo, Đắc Lắc</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section class="py-5 bg-white">
        <div class="container">
          <div class="text-center mb-5">
            <h2 class="fw-bold text-main-brown mb-2">GIÁ TRỊ CỐT LÕI</h2>
            <p class="text-muted">Điều quan trọng nhất làm nên thương hiệu Vipep</p>
          </div>
          <div class="row g-4">
            <div class="col-md-3" v-for="(item, index) in coreValues" :key="index">
              <div class="card h-100 border-0 shadow-sm text-center p-4 card-hover-up">
                <div class="icon-circle mb-3 mx-auto shadow-sm">
                  <i :class="['bi', item.icon, 'fs-3', 'text-vipep-green']"></i>
                </div>
                <h5 class="fw-bold text-main-brown">{{ item.title }}</h5>
                <p class="text-secondary small mb-0">{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="py-5 bg-brown-light">
        <div class="container text-center mb-5">
          <h2 class="fw-bold text-main-brown">HÀNH TRÌNH TỪ NÔNG TRẠI</h2>
          <div class="divider-custom mx-auto mb-4"></div>
        </div>
        <div class="container bg-white rounded-4 shadow p-4 p-lg-5">
          <div class="row">
            <div class="col-lg-8 mx-auto">
              <div class="story-content">
                <h4 class="fw-bold text-main-brown mb-4"><i class="bi bi-quote fs-1 opacity-25 me-2"></i>Một giấc mơ tuổi thơ...</h4>
                <p class="text-secondary lh-lg mb-5">
                  Lớn lên ở vùng Tây Nguyên – thủ phủ hồ tiêu của Việt Nam – tôi thấu hiểu sâu sắc cuộc sống vất vả nhưng đầy ý nghĩa của người nông dân. Từ khi còn nhỏ, tôi đã ấp ủ giấc mơ phát triển nông nghiệp bền vững. Đến nay, chúng tôi đã triển khai các chương trình hợp tác trên diện tích <strong>50 hecta</strong>, đạt tiêu chuẩn <strong>Global GAP</strong> cho gần 30 hộ dân.
                </p>
                
                <div class="row g-3 mb-5">
                  <div class="col-6"><img src="@/assets/images/duan1.jpg" class="img-fluid rounded-3 shadow-sm" /></div>
                  <div class="col-6"><img src="@/assets/images/duan2.jpg" class="img-fluid rounded-3 shadow-sm" /></div>
                </div>

                <h4 class="fw-bold text-main-brown mb-4">Chúng tôi trân quý người nông dân...</h4>
                <p class="text-secondary lh-lg mb-0">
                  Chúng tôi cam kết phát triển vùng nguyên liệu bền vững, và đóng vai trò cầu nối giữa người nông dân và người tiêu dùng – những người đã tạo ra những sản phẩm tuyệt vời này.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="py-5 bg-white">
        <div class="container">
          <div class="text-center mb-5">
            <h3 class="fw-bold text-main-brown mb-4">VƯƠN TẦM RA BIỂN LỚN</h3>
          </div>
          <div class="row g-4 mb-4">
            <div class="col-md-4"><img src="@/assets/images/vuonra1.jpg" class="img-fluid rounded-4 shadow hover-zoom-img" /></div>
            <div class="col-md-4"><img src="@/assets/images/vuonra2.jpg" class="img-fluid rounded-4 shadow hover-zoom-img" /></div>
            <div class="col-md-4"><img src="@/assets/images/vuonra3.jpg" class="img-fluid rounded-4 shadow hover-zoom-img" /></div>
          </div>
          <div class="text-center">
             <p class="text-secondary fst-italic px-lg-5">Hồ tiêu sạch Việt Nam luôn nhận được sự đánh giá cao từ cộng đồng quốc tế tại các hội chợ từ châu Á đến châu Âu.</p>
          </div>
        </div>
      </section>
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

<script setup>
const coreValues = [
  { icon: 'bi-heart-fill', title: 'Đam mê', desc: 'Đam mê việc kinh doanh các loại gia vị tự nhiên.' },
  { icon: 'bi-shield-check', title: 'An toàn', desc: 'Sản phẩm không có thuốc trừ sâu, chuẩn sạch.' },
  { icon: 'bi-gem', title: 'Chính trực', desc: 'Minh bạch, trung thực và đáng tin cậy tuyệt đối.' },
  { icon: 'bi-people-fill', title: 'Con người', desc: 'Lấy khách hàng và đội ngũ làm trung tâm.' },
];
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
/* ================= UTILS ================= */
.text-main-brown { color: #4d3105 !important; }
.text-vipep-green { color: #7eb33d !important; }
.bg-brown-light { background-color: #fcf9f5; }
.ls-2 { letter-spacing: 2px; }

/* ================= HEADER ================= */
.main-logo { max-height: 55px; }
.cart-btn { background-color: #4d3105; padding: 8px 15px; border-radius: 10px; transition: 0.3s; }
.cart-btn:hover { background-color: #7eb33d; }
.main-menu { background-color: #4d3105; }
.nav-link { color: #fff !important; font-size: 13px !important; font-weight: 700; padding: 14px 18px !important; }
.nav-link:hover, .nav-link.active { color: #7eb33d !important; }

/* ================= MAIN CONTENT ENHANCEMENTS ================= */
.divider-custom { width: 60px; height: 3px; background: #7eb33d; border-radius: 2px; }

.section-title { position: relative; padding-bottom: 10px; }
.section-title::after { content: ""; position: absolute; left: 0; bottom: 0; width: 40px; height: 2px; background: #7eb33d; }

.hover-zoom-img { transition: transform 0.5s ease; cursor: pointer; }
.hover-zoom-img:hover { transform: scale(1.05); }

.card-hover-up { transition: all 0.3s ease; }
.card-hover-up:hover { transform: translateY(-10px); }

.icon-circle {
  width: 60px; height: 60px; background: #f8fdf2; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}

.video-container { border: 8px solid white; }

.story-content { position: relative; z-index: 1; }

/* WAVE & FOOTER */
.wave-separator { width: 100%; height: 120px; background: #fff; position: relative; margin-bottom: -1px; }
.wave-svg { position: absolute; bottom: 0; width: 100%; height: 120px; }

@media (max-width: 768px) {
  .display-5 { font-size: 2rem; }
  .wave-separator { height: 60px; }
  .wave-svg { height: 60px; }
}
/* Hiển thị menu con khi di chuột vào menu cha */
.dropdown-menu li:hover > .dropdown-menu {
  display: block;
  top: 0;
  left: 100%; /* Đẩy menu con sang bên phải */
  margin-top: -1px;
}
</style>