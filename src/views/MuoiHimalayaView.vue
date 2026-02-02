<template>
  <div class="muoi-himalaya-page-wrapper font-general">
    

    <main class="main-content bg-white pb-5">
      <div class="container-fluid px-lg-5">
        <nav aria-label="breadcrumb" class="py-3">
          <ol class="breadcrumb mb-0 small text-dark">
            <li class="breadcrumb-item"><router-link to="/" class="text-decoration-none text-muted"><i class="bi bi-house-door-fill me-1"></i>Trang chủ</router-link></li>
            <li class="breadcrumb-item"><router-link to="/san-pham" class="text-decoration-none text-muted">Sản phẩm</router-link></li>
            <li class="breadcrumb-item active text-main-brown fw-bold" aria-current="page">Muối Hồng Himalaya</li>
          </ol>
        </nav>

        <div id="muoiCarousel" class="carousel slide mb-5 rounded overflow-hidden shadow-sm" data-bs-ride="carousel">
          <div class="carousel-indicators">
            <button v-for="(banner, index) in banners" :key="'ind'+index" type="button" data-bs-target="#muoiCarousel" :data-bs-slide-to="index" :class="{ active: index === 0 }"></button>
          </div>
          <div class="carousel-inner">
            <div class="carousel-item" v-for="(banner, index) in banners" :key="index" :class="{ active: index === 0 }">
              <img :src="banner.image" class="d-block w-100 banner-img" :alt="banner.alt">
              <div class="carousel-caption d-none d-md-block text-start banner-caption">
                <h2 class="display-5 fw-bold text-uppercase mb-2 animate-slide-right" v-html="banner.title"></h2>
                <p class="lead mb-4 animate-slide-up">{{ banner.desc }}</p>
                <button v-if="banner.title" class="btn btn-main-brown px-4 py-2 rounded-pill shadow animate-fade-in">Mua ngay</button>
              </div>
              <div class="overlay-gradient"></div>
            </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#muoiCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon bg-dark rounded-circle p-3" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#muoiCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon bg-dark rounded-circle p-3" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>

        <div class="row g-4">
          <aside class="col-lg-3">
            <div class="sidebar-block mb-4">
              <h5 class="sidebar-title">Phân loại Muối</h5>
              <ul class="list-unstyled sidebar-list border p-3 pt-2">
                <li v-for="cat in categories" :key="cat.name">
                    <a href="#" class="d-flex justify-content-between">
                        {{ cat.name }} <span class="badge bg-light text-secondary rounded-pill">{{ cat.count }}</span>
                    </a>
                </li>
              </ul>
            </div>

            <div class="sidebar-block mb-4">
              <h5 class="sidebar-title-simple">Lọc giá</h5>
              <div class="ps-1">
                <div class="form-check mb-2" v-for="(range, i) in priceFilters" :key="i">
                  <input class="form-check-input cursor-pointer" type="radio" name="priceRange" :id="'p'+i">
                  <label class="form-check-label small cursor-pointer" :for="'p'+i">{{ range }}</label>
                </div>
              </div>
            </div>

            <div class="sidebar-block mb-4">
              <h5 class="sidebar-title-simple">Thương hiệu</h5>
              <div class="d-flex gap-2">
                <input type="text" class="form-control form-control-sm w-50" placeholder="Khác">
                <input type="text" class="form-control form-control-sm w-50" value="Vipep" readonly>
              </div>
            </div>

            <div class="sidebar-block">
              <h5 class="sidebar-title">Góc Sức Khỏe</h5>
              <div class="border p-3 bg-light-brown-subtle">
                 <div class="d-flex gap-3 small align-items-center mb-3 cursor-pointer" v-for="k in 3" :key="k">
                    <img src="https://placehold.co/60x60/8b572a/ffffff?text=Salt" class="rounded border" alt="tip">
                    <span class="fw-bold text-main-brown line-clamp-2">Lợi ích tuyệt vời của việc ngâm chân đá muối Himalaya...</span>
                 </div>
              </div>
            </div>
          </aside>

          <div class="col-lg-9">
            <div class="sort-bar d-flex align-items-center gap-2 mb-4 flex-wrap pb-3 border-bottom">
              <span class="small fw-bold text-secondary">Sắp xếp theo:</span>
              <button class="btn btn-sort active">Bán chạy nhất</button>
              <button class="btn btn-sort">Giá tăng dần</button>
              <button class="btn btn-sort">Giá giảm dần</button>
              <button class="btn btn-sort">Mới nhất</button>
            </div>

            <div class="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-3">
              <div class="col" v-for="(product, index) in products" :key="index">
                <div class="product-item card h-100 border-0 shadow-sm overflow-hidden group-hover-parent">
                  <div v-if="product.discount" class="discount-badge">-{{ product.discount }}%</div>
                  
                  <div class="p-2 position-relative overflow-hidden">
                    <img :src="product.image" class="card-img-top transition-zoom" :alt="product.name">
                    
                    <div class="hover-actions position-absolute bottom-0 start-0 w-100 p-2 d-flex justify-content-center gap-2 opacity-0 group-hover-show">
                        <button class="btn btn-light btn-sm rounded-circle shadow text-main-brown" title="Thêm vào giỏ"><i class="bi bi-cart-plus-fill"></i></button>
                        <button class="btn btn-light btn-sm rounded-circle shadow text-danger" title="Yêu thích"><i class="bi bi-heart"></i></button>
                    </div>
                  </div>
                  
                  <div class="card-body p-3 pt-0 text-center">
                    <h6 class="product-name text-dark hover-text-brown cursor-pointer">{{ product.name }}</h6>
                    <div class="price-wrapper">
                      <span class="current-price text-danger fw-bold fs-5">{{ product.price }}</span>
                      <span v-if="product.oldPrice" class="old-price text-muted small text-decoration-line-through ms-2">{{ product.oldPrice }}</span>
                    </div>
                    <div class="rating text-warning small mt-1">
                        <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <nav class="mt-5">
              <ul class="pagination justify-content-center pagination-sm">
                <li class="page-item active"><a class="page-link px-3" href="#">1</a></li>
                <li class="page-item"><a class="page-link px-3" href="#">2</a></li>
                <li class="page-item"><a class="page-link px-3" href="#">3</a></li>
                <li class="page-item"><a class="page-link px-3" href="#">...</a></li>
                <li class="page-item"><a class="page-link px-3" href="#">Sau</a></li>
              </ul>
            </nav>
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
// Sử dụng chung banner hoặc thay ảnh muối hồng nếu bạn có file mới
import banner1 from '@/assets/images/bannerhotdeal1.png';
import banner2 from '@/assets/images/bannerhotdeal2.png';
import banner3 from '@/assets/images/bannerhotdeal3.png';

export default {
  data() {
    return {
      banners: [
        {
          image: banner1,
          alt: 'Muối hồng Vipep',
          title: 'KHOÁNG CHẤT TỰ NHIÊN <br><span class="text-vipep-green">TỪ DÃY HIMALAYA</span>',
          desc: 'Chứa 84 loại khoáng chất có lợi cho sức khỏe gia đình bạn.'
        },
        {
          image: banner2,
          alt: 'Xu hướng Eat Clean',
          title: 'XU HƯỚNG EAT CLEAN <br><span class="text-vipep-green">SỐNG KHỎE MỖI NGÀY</span>',
          desc: 'Muối hồng ít natri, hương vị thanh khiết tự nhiên.'
        },
        {
          image: banner3,
          alt: 'Đèn đá muối',
          title: 'ĐÁ MUỐI NƯỚNG <br><span class="text-vipep-green">GIỮ TRỌN VỊ NGON</span>',
          desc: 'Trải nghiệm phong cách nướng thực phẩm độc đáo.'
        }
      ],
      priceFilters: [
        'Dưới 20.000đ', '20.000đ - 50.000đ', '50.000đ - 100.000đ', 
        '100.000đ - 300.000đ', 'Trên 300.000đ'
      ],
      categories: [
        { name: 'Muối hồng hạt mịn', count: 18 },
        { name: 'Muối hồng hạt thô', count: 12 },
        { name: 'Cối xay muối hồng', count: 5 },
        { name: 'Gia vị muối kết hợp', count: 15 },
        { name: 'Đèn đá muối & Spa', count: 8 }
      ],
      // DỮ LIỆU SẢN PHẨM MUỐI HIMALAYA
      products: [
        { name: "Muối Hồng Himalaya Hạt Mịn Túi 500g", price: "45,000đ", oldPrice: "55,000đ", discount: 18, image: "https://placehold.co/300x300?text=Muoi+Hong+Min+500g" },
        { name: "Muối Hồng Himalaya Hạt Thô Hũ 500g", price: "50,000đ", oldPrice: "62,000đ", discount: 19, image: "https://placehold.co/300x300?text=Muoi+Hong+Tho" },
        { name: "Cối Xay Muối Hồng Himalaya Tiêu Đen 95g", price: "68,000đ", oldPrice: "85,000đ", discount: 20, image: "https://placehold.co/300x300?text=Coi+Xay+Muoi+Tieu" },
        { name: "Muối Ớt Hồng Himalaya Vipep Hũ 110g", price: "35,000đ", oldPrice: null, discount: null, image: "https://placehold.co/300x300?text=Muoi+Ot+Himalaya" },
        { name: "Muối Tôm Himalaya Vipep Hũ 100g", price: "38,000đ", oldPrice: "45,000đ", discount: 15, image: "https://placehold.co/300x300?text=Muoi+Tom+Himalaya" },
        { name: "Đá Muối Nướng Vuông 20x20cm", price: "180,000đ", oldPrice: "220,000đ", discount: 18, image: "https://placehold.co/300x300?text=Da+Nuong+Muoi" },
        { name: "Muối Hồng Himalaya Ngâm Chân Hộp 1kg", price: "85,000đ", oldPrice: "100,000đ", discount: 15, image: "https://placehold.co/300x300?text=Muoi+Ngam+Chan" },
        { name: "Cối Xay Muối Hồng Nguyên Chất 180g", price: "75,000đ", oldPrice: null, discount: null, image: "https://placehold.co/300x300?text=Coi+Xay+Muoi" },
        { name: "Muối Sả Ớt Himalaya Vipep 100g", price: "32,000đ", oldPrice: "40,000đ", discount: 20, image: "https://placehold.co/300x300?text=Muoi+Sa+Ot" },
        { name: "Đèn Đá Muối Hình Cầu Tự Nhiên", price: "350,000đ", oldPrice: "450,000đ", discount: 22, image: "https://placehold.co/300x300?text=Den+Da+Muoi" },
        { name: "Muối Hồng Hạt Mịn Hũ Rắc 150g", price: "28,000đ", oldPrice: null, discount: null, image: "https://placehold.co/300x300?text=Muoi+Hu+Rac" },
        { name: "Combo 3 Túi Muối Hồng Mịn 1kg", price: "250,000đ", oldPrice: "270,000đ", discount: 7, image: "https://placehold.co/300x300?text=Combo+Muoi+3kg" }
      ]
    }
  },
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
</script>

<style scoped>
/* ================= VARIABLES & UTILS ================= */
:root {
  --main-brown: #4d3105;
  --light-brown: #8b572a;
  --vipep-green: #7eb33d;
  --vipep-red: #ee2624;
}

.text-main-brown { color: #4d3105 !important; }
.bg-main-brown { background-color: #4d3105 !important; }
.text-vipep-green { color: #7eb33d !important; }
.bg-light-brown-subtle { background-color: #fdf8f0; }
.hover-text-brown:hover { color: #4d3105 !important; transition: 0.2s; }
.hover-green:hover { color: #7eb33d !important; }
.hover-white:hover { color: white !important; }
.cursor-pointer { cursor: pointer; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

/* ================= HEADER ================= */
.main-logo { max-height: 55px; }
.cart-btn { background-color: #4d3105; padding: 8px 15px; border-radius: 10px; transition: 0.3s; }
.cart-btn:hover { background-color: #7eb33d; }
.main-menu { background-color: #4d3105; }
.nav-link { color: #fff !important; font-size: 13px !important; font-weight: 700; padding: 14px 18px !important; }
.nav-link:hover, .nav-link.router-link-active { color: #7eb33d !important; }

/* ================= BANNER SLIDER (CAROUSEL) ================= */
#muoiCarousel {
  position: relative;
}
.carousel-item {
  height: 400px; /* Chiều cao cố định cho banner */
}
.banner-img {
  height: 100%;
  object-fit: cover; /* Đảm bảo ảnh phủ kín khung mà không bị méo */
}
.overlay-gradient {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 60%);
  pointer-events: none;
}
.banner-caption {
  top: 50%; left: 8%; transform: translateY(-50%); bottom: auto;
  z-index: 2;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

/* Animation cho chữ trong banner */
@keyframes slideRight { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

.carousel-item.active .animate-slide-right { animation: slideRight 0.8s ease-out forwards; }
.carousel-item.active .animate-slide-up { animation: slideUp 0.8s ease-out 0.3s forwards; opacity: 0; }
.carousel-item.active .animate-fade-in { animation: slideUp 0.8s ease-out 0.6s forwards; opacity: 0; }

/* ================= SIDEBAR ================= */
.sidebar-title { background-color: #4d3105; color: #fff; padding: 10px 15px; font-size: 16px; font-weight: bold; border-radius: 8px 8px 0 0; margin-bottom: 0; }
.sidebar-title-simple { font-size: 16px; font-weight: bold; color: #4d3105; margin-bottom: 12px; border-bottom: 2px solid #eee; padding-bottom: 5px; }
.sidebar-list { border-radius: 0 0 8px 8px; }
.sidebar-list li { padding: 8px 0; border-bottom: 1px dashed #eee; }
.sidebar-list li:last-child { border-bottom: none; }
.sidebar-list a { text-decoration: none; color: #555; font-size: 14px; transition: 0.2s; }
.sidebar-list a:hover { color: #7eb33d; padding-left: 5px; }

/* ================= PRODUCT CARD ================= */
.product-item { transition: all 0.3s ease; }
.product-item:hover { border-color: #4d3105; box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; transform: translateY(-5px); }
.discount-badge { position: absolute; top: 10px; left: 0; background-color: #ee2624; color: white; font-size: 11px; padding: 4px 10px; border-radius: 0 20px 20px 0; z-index: 2; font-weight: bold; box-shadow: 2px 2px 5px rgba(0,0,0,0.2); }
.transition-zoom { transition: transform 0.6s ease; }
.product-item:hover .transition-zoom { transform: scale(1.1); }
.group-hover-show { transition: opacity 0.3s ease, transform 0.3s ease; transform: translateY(10px); }
.product-item:hover .group-hover-show { opacity: 1; transform: translateY(0); }
.product-name { font-size: 14px; line-height: 1.4; font-weight: 600; margin-bottom: 5px; height: 40px; overflow: hidden; }

/* ================= SORT BAR & PAGINATION ================= */
.btn-sort { border: 1px solid #ddd; background: #fff; color: #555; font-size: 13px; padding: 6px 15px; border-radius: 4px; transition: 0.2s; }
.btn-sort:hover, .btn-sort.active { border-color: #4d3105; background-color: #4d3105; color: #fff; }
.pagination .page-link { color: #333; border: none; margin: 0 3px; border-radius: 4px; font-weight: 600; }
.pagination .page-item.active .page-link { background-color: #4d3105; color: white; }

/* ================= FOOTER & ANIMATION ================= */
.wave-separator {
  width: 100%;
  height: 120px;
  background: #ffffff; /* Giữ nền trắng để khớp với phần Main bên trên */
  position: relative;
  margin-bottom: -1px; /* Tránh đường kẻ hở siêu nhỏ giữa SVG và Footer */
}

.wave-svg {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 120px;
  display: block; /* Loại bỏ khoảng trống inline */
}
@keyframes shake { 0% { transform: rotate(0deg); } 25% { transform: rotate(10deg); } 75% { transform: rotate(-10deg); } 100% { transform: rotate(0deg); } }
.shake-animation { animation: shake 1.5s infinite ease-in-out; }

/* FOOTER STYLE */
.text-vipep-green { color: #28a745 !important; }
.hover-white:hover { color: #fff !important; text-decoration: underline !important; }
.pointer { cursor: pointer; transition: transform 0.3s ease; }
.pointer:hover { transform: scale(1.1); }
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
/* Hiển thị menu con khi di chuột vào menu cha */
.dropdown-menu li:hover > .dropdown-menu {
  display: block;
  top: 0;
  left: 100%; /* Đẩy menu con sang bên phải */
  margin-top: -1px;
}
</style>