<template>
  <div class="orders-page-wrapper font-general bg-light-subtle min-vh-100">
    <main class="main-content pb-5">
      <div class="bg-white shadow-sm mb-4">
        <div class="container-fluid px-lg-5 py-4">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-2 small text-dark">
              <li class="breadcrumb-item">
                <router-link to="/" class="text-decoration-none text-muted hover-green">
                  <i class="bi bi-house-door-fill me-1"></i>Trang chủ
                </router-link>
              </li>
              <li class="breadcrumb-item active text-main-brown fw-bold">Lịch sử đơn hàng</li>
            </ol>
          </nav>
          <h2 class="fw-bold text-main-brown mb-0">Đơn hàng của tôi</h2>
        </div>
      </div>

      <div class="container-fluid px-lg-5">
        <div v-if="orders.length === 0" class="card border-0 shadow-sm rounded-4 text-center py-5 animate-fade-in bg-white">
          <div class="empty-state-icon mb-4">
            <div class="icon-circle shadow-sm mx-auto">
              <i class="bi bi-bag-x display-4 text-muted"></i>
            </div>
          </div>
          <h3 class="fw-bold text-main-brown">Chưa có đơn hàng nào</h3>
          <p class="text-muted mb-4">Bạn chưa có đơn hàng nào tại One Horeca.</p>
          <router-link to="/" class="btn btn-main-brown px-5 py-3 rounded-pill fw-bold text-uppercase">
            Mua sắm ngay
          </router-link>
        </div>

        <div v-else class="row g-4">
          <div class="col-12" v-for="order in orders" :key="order.id">
            <div class="card border-0 shadow-sm rounded-4 overflow-hidden order-item-card transition-all bg-white">
              <div class="card-header bg-white border-bottom-0 py-3 px-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div class="d-flex align-items-center">
                  <div class="order-id-badge me-3">#{{ order.id }}</div>
                  <span class="small text-muted fw-medium"><i class="bi bi-calendar3 me-2"></i>{{ order.date }}</span>
                </div>
                <div :class="getStatusClass(order.status)" class="status-pill">
                  <span class="dot"></span> {{ order.status }}
                </div>
              </div>

              <div class="card-body px-4 py-3">
                <div class="row align-items-center">
                  <div class="col-md-7">
                    <div class="d-flex align-items-center gap-4">
                      <div class="preview-box shadow-sm">
                        <i class="bi bi-box-seam fs-3 text-vipep-green"></i>
                      </div>
                      <div>
                        <h6 class="fw-bold text-main-brown mb-1">{{ order.items }} sản phẩm</h6>
                        <div class="d-flex flex-wrap gap-2 mt-2">
                          <span class="small text-muted"><i class="bi bi-person me-1"></i> {{ order.recipient }}</span>
                          <span class="small text-muted px-2 border-start"><i class="bi bi-truck me-1"></i> Giao hàng tiêu chuẩn</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-5 text-md-end mt-3 mt-md-0">
                    <p class="text-muted small mb-1">Tổng số tiền</p>
                    <h4 class="fw-bold text-vipep-green mb-0">{{ formatPrice(order.total) }}đ</h4>
                  </div>
                </div>
              </div>

              <div class="card-footer bg-light-subtle border-top-0 px-4 py-3 d-flex justify-content-end gap-2">
                <button class="btn btn-sm btn-white border rounded-pill px-4 fw-bold shadow-sm">Chi tiết</button>
                <button v-if="order.status === 'Hoàn thành'" class="btn btn-sm btn-main-brown rounded-pill px-4 fw-bold shadow-sm">Mua lại</button>
                <button v-if="order.status === 'Chờ xác nhận'" class="btn btn-sm btn-outline-danger rounded-pill px-4 fw-bold">Hủy đơn</button>
              </div>
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
        <div class="row g-4 text-start">
          <div class="col-md-3">
            <h5 class="footer-heading text-vipep-green mb-3 fw-bold">CÔNG TY ONE HORECA</h5>
            <p class="footer-text small text-white-50">Chuyên cung cấp các giải pháp F&B, nguyên liệu pha chế và thiết bị nhà hàng khách sạn chất lượng cao.</p>
            <p class="footer-text small">
              <i class="bi bi-geo-alt-fill text-vipep-green me-2"></i> 47 Hàng Chiếu, P. Hoàn Kiếm, Hà Nội<br>
              <i class="bi bi-telephone-fill text-vipep-green me-2"></i> <strong>0786667447</strong><br>
              <i class="bi bi-envelope-fill text-vipep-green me-2"></i> ctyhorecaone@gmail.com
            </p>
          </div>
          <div class="col-md-3">
            <h5 class="footer-heading text-uppercase mb-3 fw-bold text-white">Về Chúng Tôi</h5>
            <ul class="list-unstyled footer-links small">
              <li class="mb-2"><router-link to="/" class="text-white-50 text-decoration-none hover-white">Trang chủ</router-link></li>
              <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none hover-white">Giới thiệu One Horeca</a></li>
              <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none hover-white">Sản phẩm</a></li>
              <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none hover-white">Liên hệ</a></li>
            </ul>
          </div>
          <div class="col-md-3">
            <h5 class="footer-heading text-uppercase mb-3 fw-bold text-white">Hỗ Trợ</h5>
            <ul class="list-unstyled footer-links small">
              <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none hover-white">Chính sách đổi trả</a></li>
              <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none hover-white">Chính sách bảo mật</a></li>
              <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none hover-white">Hướng dẫn mua hàng</a></li>
            </ul>
          </div>
          <div class="col-md-3">
            <h5 class="footer-heading text-uppercase mb-3 fw-bold text-white">Đăng ký nhận tin</h5>
            <div class="input-group mb-3">
              <input type="text" class="form-control form-control-sm rounded-start-pill border-0 shadow-none" placeholder="Email...">
              <button class="btn btn-success btn-sm rounded-end-pill px-3">Gửi</button>
            </div>
            <div class="social-icons d-flex gap-3 mt-3">
              <i class="bi bi-facebook fs-4 pointer text-primary bg-white rounded-circle px-1"></i>
              <i class="bi bi-youtube fs-4 pointer text-danger bg-white rounded-circle px-1"></i>
              <i class="bi bi-tiktok fs-4 pointer text-dark bg-white rounded-circle px-1"></i>
            </div>
          </div>
        </div>
        <hr class="my-4 border-secondary opacity-25">
        <div class="d-md-flex justify-content-between text-center small opacity-75">
          <p class="mb-0">© 2026 Copyright <strong>OneHoreca</strong>. All Rights Reserved.</p>
          <p class="mb-0">Designed by OneHoreca Team</p>
        </div>
      </div>
    </footer>

    <div class="floating-contact">
      <a href="tel:0786667447" class="contact-item hotline" title="Gọi hotline">
        <div class="icon-wrapper"><i class="bi bi-telephone-fill"></i></div>
        <span class="label">0786.667.447</span>
      </a>
      <a href="https://zalo.me/0786667447" target="_blank" class="contact-item zalo" title="Chat Zalo">
        <div class="icon-wrapper">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/1200px-Icon_of_Zalo.svg.png" alt="Zalo" width="24">
        </div>
        <span class="label">Zalo ngay</span>
      </a>
      <button @click="scrollToTop" class="contact-item scroll-top">
        <i class="bi bi-arrow-up-short"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Demo data
const orders = ref([
  { id: 'VP100226', date: '12/02/2026 14:30', items: 3, total: 259000, status: 'Đang giao', recipient: 'Nguyễn Văn A' },
  { id: 'VP090226', date: '09/02/2026 08:15', items: 1, total: 85000, status: 'Hoàn thành', recipient: 'Nguyễn Văn A' }
]);

const getStatusClass = (status) => {
  const map = {
    'Hoàn thành': 'bg-vipep-green-subtle',
    'Chờ xác nhận': 'bg-warning-subtle',
    'Đang giao': 'bg-info-subtle'
  };
  return map[status] || 'bg-light';
}

const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p);

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<style scoped>
/* Copy y hệt Style từ Profile của bạn để đồng nhất */
.text-main-brown { color: #4d3105 !important; }
.text-vipep-green { color: #7eb33d !important; }
.btn-main-brown { background-color: #4d3105 !important; color: white; border: none; }
.btn-main-brown:hover { background-color: #7eb33d !important; transform: translateY(-3px); }

/* --- Order Specifics --- */
.order-item-card { border: 1px solid #eee !important; }
.order-item-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(77,49,5,0.08) !important; border-color: #7eb33d !important; }
.order-id-badge { background: #f8f1e7; color: #4d3105; padding: 4px 12px; border-radius: 8px; font-weight: 800; font-size: 0.85rem; }
.status-pill { font-size: 0.75rem; font-weight: 700; padding: 6px 16px; border-radius: 50px; display: flex; align-items: center; gap: 6px; text-transform: uppercase; }
.status-pill .dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
.bg-vipep-green-subtle { background: #eafbea; color: #198754; }
.bg-info-subtle { background: #e7f1ff; color: #0d6efd; }
.bg-warning-subtle { background: #fff8e1; color: #f59e0b; }
.preview-box { width: 70px; height: 70px; background: #fdfaf7; border-radius: 16px; display: flex; align-items: center; justify-content: center; }

/* --- Wave & Footer (Đồng nhất với Profile) --- */
.wave-separator { background: #f8f9fa; line-height: 0; margin-bottom: -1px; }
.wave-svg { width: 100%; height: 100px; display: block; }
.hover-white:hover { color: white !important; padding-left: 8px; transition: 0.3s; }
.hover-green:hover { color: #7eb33d !important; }
.pointer { cursor: pointer; transition: 0.3s; }
.pointer:hover { transform: scale(1.15); }

/* --- Floating Contact (Đồng nhất với Profile) --- */
.floating-contact { position: fixed; right: 20px; bottom: 80px; z-index: 9999; display: flex; flex-direction: column; gap: 15px; }
.contact-item { display: flex; align-items: center; text-decoration: none; flex-direction: row-reverse; transition: 0.3s; }
.icon-wrapper { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 22px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); background: white; z-index: 2; }
.hotline .icon-wrapper { background: #dc3545; animation: pulse-red 2s infinite; }
.zalo .icon-wrapper { background: #0088ff; }
.scroll-top { background: #4d3105; color: white; border: none; }
.contact-item .label { background: rgba(0, 0, 0, 0.75); color: white; padding: 6px 15px; border-radius: 20px; font-size: 13px; margin-right: 12px; opacity: 0; visibility: hidden; transform: translateX(20px); transition: all 0.3s ease; white-space: nowrap; }
.contact-item:hover .label { opacity: 1; visibility: visible; transform: translateX(0); }

@keyframes pulse-red {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 12px rgba(220, 53, 69, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); }
}
</style>