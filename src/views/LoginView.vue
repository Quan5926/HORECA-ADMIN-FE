<template>
  <div class="auth-page-wrapper font-general">
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999">
      <transition-group name="toast-fade">
        <div v-for="toast in toasts" :key="toast.id" class="custom-toast shadow-lg d-flex align-items-center" :class="toast.type">
          <div class="toast-icon me-3">
            <i v-if="toast.type === 'success'" class="bi bi-check-circle-fill"></i>
            <i v-else class="bi bi-exclamation-circle-fill"></i>
          </div>
          <div class="toast-body flex-grow-1">
            <h6 class="mb-0 fw-bold small text-uppercase">{{ toast.title }}</h6>
            <p class="mb-0 smaller opacity-75">{{ toast.message }}</p>
          </div>
          <div class="toast-progress-bar"></div>
        </div>
      </transition-group>
    </div>

    <main class="main-content bg-light pb-0">
      <nav aria-label="breadcrumb" class="breadcrumb-wrapper">
        <div class="container-fluid px-lg-5">
          <ol class="breadcrumb mb-0 py-3 small">
            <li class="breadcrumb-item">
              <router-link to="/" class="text-decoration-none text-muted">
                <i class="bi bi-house-door-fill me-1"></i>Trang chủ
              </router-link>
            </li>
            <li class="breadcrumb-item active text-main-brown fw-bold" aria-current="page">
              {{ isLoginView ? 'Đăng nhập' : 'Đăng ký' }}
            </li>
          </ol>
        </div>
      </nav>

      <div class="container py-5">
        <div class="auth-card mx-auto bg-white shadow-lg rounded-4 overflow-hidden" style="max-width: 900px;">
          <div class="row g-0">
            <div class="col-lg-7 p-4 p-md-5 order-2 order-lg-1 border-end">
              <transition name="fade-slide" mode="out-in">
                <div v-if="isLoginView" key="login">
                  <h3 class="fw-bold text-main-brown mb-2 text-uppercase">Đăng nhập</h3>
                  <p class="text-muted small mb-4">Chào mừng bạn quay trở lại với Vipep!</p>

                  <!-- Đăng nhập bằng Google -->
                  <button 
                    @click="handleGoogleLogin" 
                    type="button"
                    class="btn btn-google w-100 py-3 mb-4 d-flex align-items-center justify-content-center gap-3"
                    :disabled="isLoading"
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/24px-Google_%22G%22_logo.svg.png" alt="Google" width="24">
                    <span class="fw-bold">Đăng nhập với Google</span>
                  </button>

                  <!-- Divider -->
                  <div class="position-relative my-4">
                    <hr>
                    <span class="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small fw-bold">HOẶC</span>
                  </div>

                  <form @submit.prevent="handleLogin">
                    <div class="mb-3">
                      <label class="form-label small fw-bold">Email / Số điện thoại</label>
                      <input v-model="loginForm.identifier" type="text" class="form-control custom-input" placeholder="Nhập tài khoản của bạn">
                    </div>
                    <div class="mb-4">
                      <label class="form-label small fw-bold">Mật khẩu</label>
                      <input v-model="loginForm.password" type="password" class="form-control custom-input" placeholder="********">
                    </div>
                    <div v-if="errorMessage" class="alert alert-danger py-2 small mb-3">
                      {{ errorMessage }}
                    </div>
                    <button type="submit" class="btn btn-vipep-primary w-100 py-2 fw-bold mb-3" :disabled="isLoading">
                      <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span> 
                      {{ isLoading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP' }}
                    </button>
                    <div class="text-center small">
                      Chưa có tài khoản? 
                      <button @click="switchView(false)" type="button" class="btn btn-link p-0 text-vipep-green fw-bold text-decoration-none">Đăng ký ngay</button>
                    </div>
                  </form>
                </div>

                <div v-else key="register">
                  <h3 class="fw-bold text-main-brown mb-2 text-uppercase">
                    {{ otpSent ? 'Xác thực tài khoản' : 'Đăng ký thành viên' }}
                  </h3>
                  <p class="text-muted small mb-4">
                    {{ otpSent ? 'Vui lòng nhập mã xác thực đã được gửi cho bạn.' : 'Nhận ngay ưu đãi 10% khi trở thành thành viên.' }}
                  </p>
                  <form @submit.prevent="otpSent ? handleVerifyRegisterOtp() : handleRequestRegister()">
                    <div v-if="!otpSent">
                      <div class="row g-2 mb-3">
                        <div class="col-md-6">
                          <label class="form-label small fw-bold">Họ & Tên</label>
                          <input v-model="registerForm.fullname" type="text" class="form-control custom-input" placeholder="Họ tên">
                        </div>
                        <div class="col-md-6">
                          <label class="form-label small fw-bold">Số điện thoại</label>
                          <input v-model="registerForm.phone" type="tel" class="form-control custom-input" placeholder="0xxx">
                        </div>
                      </div>
                      <div class="mb-3">
                        <label class="form-label small fw-bold">Email</label>
                        <input v-model="registerForm.email" type="email" class="form-control custom-input" placeholder="email@example.com">
                      </div>
                      <div class="mb-4">
                        <label class="form-label small fw-bold">Mật khẩu</label>
                        <input v-model="registerForm.password" type="password" class="form-control custom-input" placeholder="Tối thiểu 6 ký tự">
                      </div>
                    </div>
                    <div v-else class="mb-4">
                      <div class="alert alert-info py-2 small">
                        Mã OTP đã được gửi đến: <strong>{{ registerForm.email || registerForm.phone }}</strong>
                      </div>
                      <label class="form-label small fw-bold text-vipep-green">Nhập mã OTP (6 chữ số)</label>
                      <input v-model="otpCode" type="text" class="form-control custom-input border-success" placeholder="______" maxlength="6">
                      <div class="mt-2 text-end">
                        <small v-if="countdown > 0" class="text-muted">Gửi lại mã sau {{ countdown }}s</small>
                        <button v-else type="button" @click="handleRequestRegister" class="btn btn-link p-0 small text-vipep-green fw-bold text-decoration-none">Gửi lại mã</button>
                      </div>
                    </div>
                    <div v-if="errorMessage" class="alert alert-danger py-2 small mb-3">
                      {{ errorMessage }}
                    </div>
                    <button type="submit" class="btn btn-vipep-primary w-100 py-2 fw-bold mb-3" :disabled="isLoading">
                      <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                      {{ isLoading ? 'ĐANG XỬ LÝ...' : (otpSent ? 'XÁC NHẬN & ĐĂNG KÝ' : 'GỬI MÃ XÁC THỰC') }}
                    </button>
                    <button v-if="otpSent" @click="resetRegisterForm" type="button" class="btn btn-link w-100 text-muted small text-decoration-none">
                      <i class="bi bi-arrow-left"></i> Quay lại sửa thông tin
                    </button>
                    <button v-else @click="switchView(true)" type="button" class="btn btn-link w-100 text-muted small text-decoration-none">
                      Đã có tài khoản? Đăng nhập
                    </button>
                  </form>
                </div>
              </transition>
            </div>
            <div class="col-lg-5 p-4 p-md-5 bg-vipep-gradient text-white d-flex flex-column justify-content-center text-center order-1 order-lg-2">
              <h4 class="fw-bold mb-3">{{ isLoginView ? 'Chào mừng quay lại!' : 'Gia nhập Vipep' }}</h4>
              <p class="small opacity-75">Vipep cam kết mang đến những sản phẩm gia vị sạch và an toàn tuyệt đối cho gia đình bạn.</p>
              <div class="mt-4"><i class="bi bi-shield-check display-1 opacity-25"></i></div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Wave Separator -->
    <div class="wave-separator">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" class="wave-svg">
        <path d="M0,0 C360,100 1080,20 1440,80 L1440,120 L0,120 Z" fill="#212529" shape-rendering="geometricPrecision"></path>
      </svg>
    </div>

    <!-- FOOTER -->
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

    <!-- Floating Contact -->
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
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoginView = ref(true);
const isLoading = ref(false);
const errorMessage = ref('');
const toasts = ref([]);
const countdown = ref(0);

// Forms
const loginForm = reactive({ identifier: '', password: '' });
const registerForm = reactive({ fullname: '', phone: '', email: '', password: '' });

// OTP States
const otpSent = ref(false);
const otpCode = ref('');

const pushToast = (title, message, type = 'success') => {
  const id = Date.now();
  toasts.value.push({ id, title, message, type });
  setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id); }, 3000);
};

const switchView = (isLogin) => {
  isLoginView.value = isLogin;
  otpSent.value = false;
  errorMessage.value = '';
  otpCode.value = '';
};

const resetRegisterForm = () => {
  otpSent.value = false;
  otpCode.value = '';
  errorMessage.value = '';
};

// Đăng nhập bằng Google (mock)
const handleGoogleLogin = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    localStorage.setItem('user_name', 'Người dùng Google');
    localStorage.setItem('is_auth', 'true');
    pushToast('Thành công', 'Đăng nhập với Google thành công!');
    setTimeout(() => router.push('/'), 1000);
  }, 1500);
};

// Đăng nhập thường
const handleLogin = () => {
  errorMessage.value = '';
  if (!loginForm.identifier || !loginForm.password) {
    errorMessage.value = 'Vui lòng nhập đầy đủ thông tin!';
    return;
  }
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    localStorage.setItem('user_name', loginForm.identifier.split('@')[0] || loginForm.identifier);
    localStorage.setItem('is_auth', 'true');
    pushToast('Thành công', 'Đang chuyển hướng về trang chủ...');
    setTimeout(() => router.push('/'), 1000);
  }, 1500);
};

// Đăng ký - Gửi OTP
const handleRequestRegister = async () => {
  errorMessage.value = '';
  if (!registerForm.fullname || !registerForm.password || (!registerForm.email && !registerForm.phone)) {
    errorMessage.value = "Vui lòng điền đầy đủ các thông tin bắt buộc!";
    return;
  }
  isLoading.value = true;
  try {
    await new Promise(res => setTimeout(res, 1500));
    otpSent.value = true;
    countdown.value = 60;
    const timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) clearInterval(timer);
    }, 1000);
    pushToast("Đã gửi mã", "Vui lòng kiểm tra tin nhắn hoặc email để lấy mã OTP.");
  } catch (e) {
    errorMessage.value = "Có lỗi xảy ra khi gửi mã. Thử lại sau!";
  } finally {
    isLoading.value = false;
  }
};

// Đăng ký - Xác thực OTP
const handleVerifyRegisterOtp = async () => {
  if (otpCode.value.length !== 6 || !/^\d+$/.test(otpCode.value)) {
    errorMessage.value = "Mã OTP phải gồm 6 chữ số!";
    return;
  }
  isLoading.value = true;
  try {
    await new Promise(res => setTimeout(res, 1500));
    pushToast("Tuyệt vời!", "Tài khoản của bạn đã được tạo thành công.");
    setTimeout(() => {
      isLoginView.value = true;
      otpSent.value = false;
      loginForm.identifier = registerForm.email || registerForm.phone;
      loginForm.password = registerForm.password;
      Object.assign(registerForm, { fullname: '', phone: '', email: '', password: '' });
      isLoading.value = false;
    }, 1500);
  } catch (e) {
    isLoading.value = false;
    errorMessage.value = "Mã OTP không chính xác hoặc đã hết hạn!";
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<style scoped>
/* Theme */
.text-main-brown { color: #4d3105 !important; }
.text-vipep-green { color: #7eb33d !important; }
.bg-vipep-gradient { background: linear-gradient(135deg, #4d3105 0%, #7eb33d 100%); }
.custom-input { border-radius: 8px; padding: 12px; border: 1px solid #ddd; transition: 0.3s; }
.custom-input:focus { border-color: #7eb33d; box-shadow: 0 0 0 3px rgba(126,179,61,0.1); outline: none; }
.btn-vipep-primary { background-color: #4d3105; color: white; border-radius: 25px; border: none; padding: 10px; transition: 0.3s; }
.btn-vipep-primary:hover { background-color: #7eb33d; transform: translateY(-2px); }

/* Nút Google */
.btn-google {
  background: #fff;
  border: 1px solid #dadce0;
  color: #3c4043;
  font-weight: 500;
}
.btn-google:hover {
  background: #f8f9fa;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

/* Toast */
.custom-toast {
  background: white;
  min-width: 320px;
  padding: 16px 20px;
  border-radius: 12px;
  border-left: 6px solid #7eb33d;
  margin-bottom: 12px;
  position: relative;
  overflow: hidden;
}
.custom-toast.success { border-left-color: #7eb33d; }
.custom-toast.error { border-left-color: #dc3545; }
.toast-icon { font-size: 1.6rem; color: #7eb33d; }
.toast-progress-bar { position: absolute; bottom: 0; left: 0; height: 4px; width: 100%; background: rgba(0,0,0,0.05); }
.toast-progress-bar::after { content: ""; position: absolute; right: 0; height: 100%; width: 100%; background: #7eb33d; animation: shrink-width 3s linear forwards; }
@keyframes shrink-width { from { width: 100%; } to { width: 0%; } }

/* Breadcrumb */
.breadcrumb-wrapper { background-color: #f8f9fa; }

/* Wave & Footer */
.wave-separator { width: 100%; height: 120px; background: #f8f9fa; position: relative; overflow: hidden; }
.wave-svg { position: absolute; bottom: 0; width: 100%; height: 120px; }
.footer-custom { background: #212529; }
.footer-heading { font-weight: 700; font-size: 1.1rem; }
.hover-white:hover { color: #fff !important; text-decoration: underline !important; }
.pointer { cursor: pointer; transition: transform 0.3s ease; }
.pointer:hover { transform: scale(1.1); }

/* Floating Contact */
.floating-contact {
  position: fixed;
  right: 20px;
  bottom: 30px;
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
  flex-direction: row-reverse;
}
.icon-wrapper {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}
.hotline .icon-wrapper { background: #dc3545; animation: pulse-red 2s infinite; }
.zalo .icon-wrapper { background: #0088ff; }
.messenger .icon-wrapper { background: #0078ff; }
.scroll-top { background: #4d3105; color: white; width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer; }
.contact-item .label {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 13px;
  margin-right: 10px;
  opacity: 0;
  visibility: hidden;
  transform: translateX(20px);
  transition: all 0.3s ease;
  white-space: nowrap;
}
.contact-item:hover .label { opacity: 1; visibility: visible; transform: translateX(0); }
@keyframes pulse-red {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(220, 53, 69, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); }
}

/* Transition */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateY(20px); }
.fade-slide-leave-to { opacity: 0; transform: translateY(-20px); }
.toast-fade-enter-active, .toast-fade-leave-active { transition: all 0.4s ease; }
.toast-fade-enter-from { transform: translateX(100%); opacity: 0; }
.toast-fade-leave-to { transform: translateX(50%); opacity: 0; }

@media (max-width: 768px) {
  .floating-contact { right: 10px; bottom: 100px; }
  .icon-wrapper { width: 40px; height: 40px; font-size: 20px; }
  .contact-item .label { display: none; }
}
</style>