<template>
  <div class="store-page-wrapper font-general bg-cream-light">
    

    <main class="main-content pb-0 position-relative z-1">
      <div class="page-header-bg"></div>

      <div class="container-fluid px-lg-5 pt-4 position-relative z-2">
         <nav aria-label="breadcrumb">
          <ol class="breadcrumb mb-4 small">
            <li class="breadcrumb-item"><router-link to="/" class="text-decoration-none text-muted opacity-75 hover-green"><i class="bi bi-house-door-fill me-1"></i>Trang chủ</router-link></li>
            <li class="breadcrumb-item active text-main-brown fw-bold" aria-current="page">Hệ thống phân phối</li>
          </ol>
        </nav>

        <div class="text-center mb-5">
            <div class="d-inline-flex align-items-center justify-content-center mb-3">
                <span class="separator-line bg-main-brown opacity-25"></span>
                <span class="badge bg-white text-main-brown shadow-sm border border-light-subtle px-3 py-2 rounded-pill text-uppercase fw-bold mx-3 ls-1">Mạng lưới toàn quốc</span>
                <span class="separator-line bg-main-brown opacity-25"></span>
            </div>
            <h1 class="fw-bolder text-main-brown text-uppercase display-5 mb-3 font-primary">Tìm Cửa Hàng Gần Bạn Nhất</h1>
            <p class="text-secondary mx-auto lead fs-6" style="max-width: 680px;">
                Trải nghiệm mua sắm các sản phẩm One Horeca & Vipep chính hãng tại hệ thống siêu thị và đại lý phân phối uy tín trên khắp cả nước.
            </p>
        </div>
      </div>

      <div class="container-fluid px-lg-5 pb-5 position-relative z-2">
        <div class="row g-0 premium-shadow rounded-5 overflow-hidden bg-white" style="min-height: 800px;">
            
            <div class="col-lg-4 d-flex flex-column border-end border-light-subtle position-relative bg-white z-1">
                <div class="p-4 bg-white border-bottom border-light-subtle">
                    <div class="d-flex align-items-center mb-4">
                        <div class="icon-square bg-vipep-green-subtle text-vipep-green rounded-circle me-3">
                            <i class="bi bi-shop-window fs-4"></i>
                        </div>
                        <div>
                            <h5 class="mb-0 fw-bold text-main-brown">Bộ lọc tìm kiếm</h5>
                            <small class="text-muted">Tìm theo khu vực của bạn</small>
                        </div>
                    </div>
                    
                    <div class="row g-3">
                        <div class="col-12">
                            <label class="form-label small fw-bold text-muted text-uppercase ls-1 mb-1">Tỉnh / Thành phố</label>
                            <select class="form-select form-select border-light-subtle shadow-sm text-main-brown fw-semibold py-2" v-model="selectedCity">
                                <option value="">Tất cả địa điểm</option>
                                <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
                            </select>
                        </div>
                        <div class="col-12">
                             <label class="form-label small fw-bold text-muted text-uppercase ls-1 mb-1">Tìm tên đường / Cửa hàng</label>
                             <div class="position-relative">
                                <input type="text" class="form-control border-light-subtle shadow-sm ps-3 pe-5 py-2" placeholder="Ví dụ: Nguyễn Trãi, Winmart..." v-model="searchQuery">
                                <i class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3 text-vipep-green"></i>
                             </div>
                        </div>
                    </div>
                </div>

                <div class="px-4 py-2 bg-light-subtle d-flex justify-content-between align-items-center border-bottom border-light-subtle">
                    <small class="text-muted fw-semibold"><i class="bi bi-list-check me-1"></i>Tìm thấy: <span class="text-vipep-green fw-bold">{{ filteredStores.length }}</span> địa điểm</small>
                     <button v-if="selectedCity || searchQuery" @click="resetFilter" class="btn btn-link btn-sm text-decoration-none text-muted p-0 small hover-green">
                        <i class="bi bi-x-circle me-1"></i>Xóa lọc
                    </button>
                </div>

                <div class="store-list-container flex-grow-1 overflow-auto custom-scrollbar p-3 bg-light-subtle">
                    <div v-if="filteredStores.length === 0" class="text-center p-5 text-muted h-100 d-flex flex-column justify-content-center align-items-center">
                        <div class="bg-white rounded-circle p-4 mb-3 shadow-sm">
                             <i class="bi bi-geo-alt-fill fs-1 opacity-25 text-main-brown"></i>
                        </div>
                        <p class="mb-2 fw-bold text-main-brown">Không tìm thấy kết quả</p>
                        <p class="small mb-3">Vui lòng thử lại với từ khóa hoặc khu vực khác.</p>
                        <button class="btn btn-outline-brown rounded-pill btn-sm px-3" @click="resetFilter">Xóa bộ lọc tìm kiếm</button>
                    </div>

                    <div 
                        v-for="(store, index) in filteredStores" 
                        :key="index" 
                        class="store-item-card p-3 mb-3 bg-white border border-light-subtle rounded-4 cursor-pointer position-relative transition-all"
                        :class="{ 'active-store-card': activeStoreId === index }"
                        @click="selectStore(index)"
                    >
                        <div class="d-flex align-items-start mb-2">
                             <div class="store-marker me-3 flex-shrink-0 text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm transition-all"
                                  :class="activeStoreId === index ? 'bg-vipep-green scale-up' : 'bg-secondary bg-opacity-50'">
                                <span class="fw-bold small">{{ index + 1 }}</span>
                            </div>
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-start">
                                    <h6 class="fw-bold text-main-brown mb-1 text-truncate" style="max-width: 200px;">{{ store.name }}</h6>
                                     <span class="badge rounded-pill fw-normal d-flex align-items-center small py-1 px-2" 
                                          :class="getStatus(index).class">
                                          <i class="bi bi-dot fs-5 me-1" style="margin-top: -2px;"></i>{{ getStatus(index).text }}
                                     </span>
                                </div>
                                <p class="small text-secondary mb-3 line-clamp-2 pe-2"><i class="bi bi-geo-alt-fill text-muted me-1 opacity-50"></i>{{ store.address }}</p>

                                <div class="d-flex justify-content-between align-items-center pt-2 border-top border-light-subtle card-actions transition-all"
                                     :class="{'opacity-100': activeStoreId === index, 'opacity-75': activeStoreId !== index}">
                                    <a :href="'tel:' + store.phone" class="text-decoration-none text-main-brown small fw-bold d-flex align-items-center hover-green py-1">
                                        <div class="icon-sm bg-light-brown-subtle rounded-circle me-2 text-main-brown"><i class="bi bi-telephone-fill" style="font-size: 10px;"></i></div>
                                        {{ store.phone }}
                                    </a>
                                    <a :href="store.mapLink" target="_blank" class="btn btn-sm btn-vipep-green rounded-pill px-3 py-1 fw-semibold shadow-sm btn-navigate" @click.stop>
                                        Chỉ đường <i class="bi bi-box-arrow-up-right ms-1 small"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-8 position-relative">
                <div class="h-100 w-100 d-flex align-items-center justify-content-center position-relative map-container">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.924088730949!2d105.8499423154025!3d21.03572299291771!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abbf5c6e7ce3%3A0xcfa0176116013235!2zNDcgUC4gSMOgbmcgQ2hp4bq_dSwgxJDhu5NuZyBYdcOibiwgSG_DoG4gS2nhur9tLCBIw6AgTuG7mWksIFZpZXRuYW0!5e0!3m2!1sen!2s" 
                        width="100%" 
                        height="100%" 
                        style="border:0;" 
                        allowfullscreen="" 
                        loading="lazy" 
                        referrerpolicy="no-referrer-when-downgrade">
                    </iframe>
                    
                    <div class="position-absolute bottom-0 start-0 m-4 card premium-shadow border-0 d-none d-md-block animate-pop-in rounded-4 overflow-hidden" style="max-width: 400px; z-index: 10; min-width: 320px;" v-if="currentStore">
                        <div class="h-1 bg-vipep-green w-100"></div>
                        <div class="card-body p-4 bg-white">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                 <h5 class="card-title fw-bold text-main-brown mb-0 pe-3">{{ currentStore.name }}</h5>
                                 <button class="btn btn-light bg-light-subtle btn-sm rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center" style="width: 24px; height: 24px;" aria-label="Close" @click="activeStoreId = null"><i class="bi bi-x small"></i></button>
                            </div>
                            <div class="mb-3 d-flex align-items-center small">
                                <div class="text-warning me-2">
                                    <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-half"></i>
                                </div>
                                <span class="text-muted fw-semibold">4.8/5 (128 đánh giá)</span>
                            </div>

                            <div class="d-flex align-items-start mb-3">
                                <i class="bi bi-geo-alt-fill text-vipep-green fs-5 me-3 mt-1"></i>
                                <p class="card-text text-dark mb-0">{{ currentStore.address }}</p>
                            </div>
                             <div class="d-flex align-items-center mb-4">
                                <i class="bi bi-clock-fill text-muted fs-6 me-3"></i>
                                <div>
                                    <span class="text-success fw-bold small me-2"><i class="bi bi-dot"></i> Đang mở cửa</span>
                                    <span class="small text-muted">08:00 - 22:00 hôm nay</span>
                                </div>
                            </div>
                            
                            <div class="d-grid gap-2 d-flex">
                                <a :href="'tel:'+currentStore.phone" class="btn btn-outline-brown fw-semibold btn-sm flex-grow-1 py-2 rounded-pill"><i class="bi bi-telephone-fill me-2"></i>Gọi ngay</a>
                                <a :href="currentStore.mapLink" target="_blank" class="btn btn-vipep-green fw-semibold btn-sm flex-grow-1 py-2 rounded-pill shadow-sm"><i class="bi bi-cursor-fill me-2"></i>Chỉ đường Google</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div class="bg-white py-5 position-relative z-1" style="border-top: 1px solid rgba(0,0,0,0.04);">
        <div class="position-absolute top-0 start-0 w-100 h-100 bg-pattern-dots opacity-10 z-0"></div>
        <div class="container position-relative z-1 my-4">
            <div class="text-center mb-5">
                 <h5 class="text-vipep-green fw-bold text-uppercase ls-2 mb-2 small">Đối tác tin cậy</h5>
                 <h3 class="fw-bold text-main-brown text-uppercase mb-3 font-primary">Hệ thống phân phối chiến lược</h3>
                 <div class="divider-icon mx-auto bg-main-brown opacity-10 rounded-pill mb-4" style="width: 60px; height: 4px;"></div>
            </div>
            
            <div class="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-3 g-lg-4 align-items-center justify-content-center partners-grid">
                <div class="col partner-wrapper" v-for="(partner, index) in partners" :key="index">
                    <div class="partner-card h-100 bg-white rounded-4 p-3 d-flex align-items-center justify-content-center shadow-sm border border-light-subtle transition-all hover-lift" style="min-height: 100px;">
                        <img :src="partner.logo" class="img-fluid partner-logo transition-all" :alt="partner.name">
                    </div>
                </div>
            </div>
            
            <div class="mt-5 pt-4 text-center position-relative">
                 <div class="cta-modern-box rounded-5 p-5 text-white shadow-lg mx-auto position-relative overflow-hidden" 
                      style="max-width: 900px; background: linear-gradient(110deg, #4d3105 0%, #7eb33d 100%);">
                    
                    <div class="shape-blob shape-1" style="z-index: 1;"></div>
                    <div class="shape-blob shape-2" style="z-index: 1;"></div>

                    <div class="row align-items-center position-relative" style="z-index: 10;">
                        <div class="col-md-7 text-center text-md-start mb-4 mb-md-0">
                             <h3 class="fw-bolder mb-2 font-primary">Trở thành đại lý của One Horeca?</h3>
                             <p class="mb-0 opacity-90 fs-6">Tham gia mạng lưới phân phối ngay hôm nay để nhận các chính sách ưu đãi đặc biệt.</p>
                        </div>
                        <div class="col-md-5 text-center text-md-end">
                            <button class="btn btn-white fw-bold rounded-pill px-5 py-3 shadow-sm hover-scale text-main-brown fs-6 flex-shrink-0">
                                Đăng ký tư vấn ngay <i class="bi bi-arrow-right-short fs-5 align-middle ms-1"></i>
                            </button>
                        </div>
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
// SỬA: Import ảnh trực tiếp để tránh lỗi require trong Vite
import imgAeon from '@/assets/images/Aeon.jpg'
import imgBachHoa from '@/assets/images/BachHoaXanh.png'
import imgCoop from '@/assets/images/Coopmart.jpg'
import imgGo from '@/assets/images/Go!.jpg'
import imgLotte from '@/assets/images/Lotte.jpg'
import imgWin from '@/assets/images/Winmart.jpg'

export default {
  data() {
    return {
      selectedCity: '',
      searchQuery: '',
      activeStoreId: 0,
      cities: ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ'],
      stores: [
        { name: 'Showroom One Horeca Hà Nội', address: '47 Hàng Chiếu, P. Hoàn Kiếm, Hà Nội', phone: '0786667447', city: 'Hà Nội', mapLink: 'https://goo.gl/maps/xyz' },
        { name: 'Siêu thị WinMart Times City', address: '458 Minh Khai, Hai Bà Trưng, Hà Nội', phone: '024 1234 5678', city: 'Hà Nội', mapLink: 'https://goo.gl/maps/xyz' },
        { name: 'Co.opmart Nguyễn Đình Chiểu', address: '168 Nguyễn Đình Chiểu, Q.3, TP.HCM', phone: '028 3930 1234', city: 'TP. Hồ Chí Minh', mapLink: 'https://goo.gl/maps/xyz' },
        { name: 'Aeon Mall Long Biên', address: '27 Cổ Linh, Long Biên, Hà Nội', phone: '024 3269 3000', city: 'Hà Nội', mapLink: 'https://goo.gl/maps/xyz' },
        { name: 'Lotte Mart Đà Nẵng', address: '6 Nại Nam, P. Hòa Cường Bắc, Đà Nẵng', phone: '0236 3611 999', city: 'Đà Nẵng', mapLink: 'https://goo.gl/maps/xyz' },
        { name: 'Go! Cần Thơ', address: 'Lô 1, KDC Hưng Phú 1, Cái Răng, Cần Thơ', phone: '0292 3736 888', city: 'Cần Thơ', mapLink: 'https://goo.gl/maps/xyz' },
        { name: 'Showroom Vipep Sài Gòn', address: '123 Đường 3/2, Quận 10, TP.HCM', phone: '0909 888 777', city: 'TP. Hồ Chí Minh', mapLink: 'https://goo.gl/maps/xyz' },
        { name: 'WinMart Royal City', address: '72A Nguyễn Trãi, Thanh Xuân, Hà Nội', phone: '024 6666 8888', city: 'Hà Nội', mapLink: 'https://goo.gl/maps/xyz' }
      ],
      // SỬA: Gán biến import vào data partners
      partners: [
        { name: 'Coopmart', logo: imgCoop },
        { name: 'Winmart', logo: imgWin },
        { name: 'Aeon', logo: imgAeon },
        { name: 'Lotte', logo: imgLotte },
        { name: 'Go!', logo: imgGo },
        { name: 'BachHoaXanh', logo: imgBachHoa }
      ]
    }
  },
  computed: {
    filteredStores() {
      return this.stores.filter(store => {
        const matchCity = this.selectedCity ? store.city === this.selectedCity : true;
        const matchSearch = this.searchQuery 
            ? store.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
              store.address.toLowerCase().includes(this.searchQuery.toLowerCase())
            : true;
        return matchCity && matchSearch;
      });
    },
    currentStore() {
        if(this.filteredStores.length > 0 && this.activeStoreId !== null) {
            return this.filteredStores[this.activeStoreId] || this.filteredStores[0];
        }
        return null;
    }
  },
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    selectStore(index) {
        this.activeStoreId = index;
    },
    resetFilter() {
        this.selectedCity = '';
        this.searchQuery = '';
    },
    getStatus(index) {
        // Giả lập trạng thái mở/đóng cửa
        const isOpen = (index % 3 !== 0); 
        return {
            text: isOpen ? 'Đang mở cửa' : 'Đóng cửa',
            class: isOpen ? 'bg-success-subtle text-success border-success-subtle' : 'bg-secondary-subtle text-secondary border-secondary-subtle'
        }
    }
  }
}
</script>

<style scoped>
/* ================= GLOBAL & UTILS (PREMIUM) ================= */
:root {
  --main-brown: #4d3105;
  --light-brown-subtle: #f4ece2;
  --vipep-green: #7eb33d;
  --vipep-green-subtle: #e9f3dc;
  --cream-light: #fcfaf7;
  --font-primary: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.font-general { font-family: var(--font-primary); }
.font-primary { font-family: var(--font-primary); }
.text-main-brown { color: #4d3105 !important; }
.bg-main-brown { background-color: #4d3105 !important; }
.bg-light-brown-subtle { background-color: #f4ece2 !important; }
.bg-vipep-green { background-color: #7eb33d !important; }
.bg-vipep-green-subtle { background-color: #e9f3dc !important; }
.text-vipep-green { color: #7eb33d !important; }
.bg-cream-light { background-color: #fcfaf7 !important; }
.ls-1 { letter-spacing: 1px; }
.ls-2 { letter-spacing: 2px; }
.cursor-pointer { cursor: pointer; }
.transition-all { transition: all 0.3s ease; }

/* Premium Shadows */
.premium-shadow { box-shadow: 0 10px 30px -5px rgba(77, 49, 5, 0.1), 0 4px 12px -2px rgba(0, 0, 0, 0.05); }
.hover-lift:hover { transform: translateY(-5px); box-shadow: 0 1rem 2rem rgba(77, 49, 5, 0.1) !important; border-color: #7eb33d !important; }
.hover-scale:hover { transform: scale(1.03); }

/* Buttons & Inputs */
.btn-outline-brown { color: #4d3105; border-color: #4d3105; transition: 0.3s; }
.btn-outline-brown:hover { background-color: #4d3105; color: white; }
.btn-vipep-green { background-color: #7eb33d; color: white; border: none; transition: 0.3s; }
.btn-vipep-green:hover { background-color: #6a9c30; box-shadow: 0 4px 12px rgba(126, 179, 61, 0.4); color: white;}
.btn-white { background-color: white; color: #4d3105; border: none; transition: 0.3s; }
.btn-white:hover { background-color: #f8f9fa; box-shadow: 0 4px 15px rgba(255,255,255, 0.3); }
.hover-green:hover { color: #7eb33d !important; }
.hover-white:hover { color: white !important; }
.form-control:focus, .form-select:focus { border-color: #7eb33d; box-shadow: 0 0 0 0.25rem rgba(126, 179, 61, 0.15); }

/* ================= HEADER (GIỮ NGUYÊN) ================= */
.main-logo { max-height: 55px; }
.cart-btn { background-color: #4d3105; padding: 8px 15px; border-radius: 10px; transition: 0.3s; }
.cart-btn:hover { background-color: #7eb33d; }
.main-menu { background-color: #4d3105; }
.nav-link { color: #fff !important; font-size: 13px !important; font-weight: 700; padding: 14px 18px !important; }
.nav-link:hover, .nav-link.router-link-active { color: #7eb33d !important; }

/* ================= PAGE BACKGROUND & DECORATION ================= */
.page-header-bg {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 400px;
    background-color: var(--cream-light);
    background-image: radial-gradient(var(--main-brown) 0.5px, transparent 0.5px);
    background-size: 20px 20px;
    opacity: 0.05; z-index: 0;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0));
}
.separator-line { height: 1px; width: 60px; display: inline-block; }

/* ================= STORE LOCATOR ================= */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #dcdcdc; border-radius: 10px; border: 2px solid transparent; background-clip: padding-box;}
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #c0c0c0; }

.icon-square { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; }
.icon-sm { width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; }

.store-marker { width: 28px; height: 28px; font-size: 12px; transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.scale-up { transform: scale(1.1); }
.store-item-card:hover { border-color: #e9f3dc !important; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
.store-item-card.active-store-card { background-color: #f8fdf2 !important; border-color: #7eb33d !important; }
.active-store-card .store-marker { box-shadow: 0 4px 10px rgba(126, 179, 61, 0.3) !important; }
.btn-navigate:hover { transform: translateY(-2px); }

.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.map-container::after { 
    content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    box-shadow: inset 3px 0 10px -5px rgba(0,0,0,0.1); pointer-events: none; z-index: 5;
}
@keyframes popIn { 0% { opacity: 0; transform: scale(0.9) translateY(20px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
.animate-pop-in { animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

/* ================= PARTNERS & CTA ================= */
.partner-logo { filter: grayscale(100%); opacity: 0.5; transition: all 0.4s ease; max-height: 50px; }
.partner-card:hover .partner-logo { filter: grayscale(0%); opacity: 1; transform: scale(1.08); }

.cta-modern-box { position: relative; overflow: hidden; z-index: 1; display: block; width: 100%; }
.shape-blob { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.4; pointer-events: none; }
.shape-1 { width: 300px; height: 300px; background: #ffffff; top: -100px; left: -100px; }
.shape-2 { width: 250px; height: 250px; background: #a6d670; bottom: -80px; right: -50px; opacity: 0.3; }

.bg-pattern-dots {
    background-image: radial-gradient(var(--main-brown) 1px, transparent 1px);
    background-size: 24px 24px;
}

/* ================= FOOTER & WAVE ================= */
.wave-separator { 
    width: 100%; 
    height: 120px; 
    background: #ffffff; /* SỬA: Đổi từ var(--cream-light) thành #ffffff */
    position: relative; 
    margin-bottom: -1px; 
    z-index: 2;
}
.wave-svg { position: absolute; bottom: 0; width: 100%; height: 120px; display: block; }
@keyframes shake { 0% { transform: rotate(0deg); } 25% { transform: rotate(10deg); } 75% { transform: rotate(-10deg); } 100% { transform: rotate(0deg); } }
.shake-animation { animation: shake 1.5s infinite ease-in-out; }

/* ================= FLOATING CONTACT ================= */
.floating-contact { position: fixed; right: 20px; bottom: 80px; z-index: 9999; display: flex; flex-direction: column; gap: 12px; }
.contact-item { display: flex; align-items: center; text-decoration: none; transition: all 0.3s ease; position: relative; flex-direction: row-reverse; }
.icon-wrapper { width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 22px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); z-index: 2; background: white; }
.hotline .icon-wrapper { background: #dc3545; animation: pulse-red 2s infinite; }
.zalo .icon-wrapper { background: #0088ff; }
.messenger .icon-wrapper { background: #0078ff; }
.scroll-top { background: #4d3105; color: white; border: none; width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; }
.contact-item .label { background: rgba(0, 0, 0, 0.7); color: white; padding: 5px 15px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-right: 10px; opacity: 0; visibility: hidden; transform: translateX(20px); transition: all 0.3s ease; white-space: nowrap; }
.contact-item:hover .label { opacity: 1; visibility: visible; transform: translateX(0); }
.contact-item:hover .icon-wrapper { transform: scale(1.1); }
@keyframes pulse-red { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(220, 53, 69, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); } }

@media (max-width: 991px) {
  .map-container { height: 400px; border-radius: 0; }
  .store-list-container { max-height: 400px; }
  .cta-modern-box { text-align: center; }
}
@media (max-width: 768px) {
  .floating-contact { right: 10px; bottom: 100px; }
  .icon-wrapper { width: 40px; height: 40px; font-size: 20px; }
  .contact-item .label { display: none; }
  .premium-shadow { border-radius: 1rem !important; }
  .store-item-card { margin-bottom: 0.75rem; }
}
.dropdown-menu li:hover > .dropdown-menu { display: block; top: 0; left: 100%; margin-top: -1px; }
</style>