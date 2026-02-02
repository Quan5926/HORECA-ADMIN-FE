<template>
  <div class="news-page-wrapper font-general">
    
    <main class="main-content bg-white pb-5">
      <div class="container-fluid px-lg-5">
        <nav aria-label="breadcrumb" class="py-3">
          <ol class="breadcrumb mb-0 small text-dark">
            <li class="breadcrumb-item"><router-link to="/" class="text-decoration-none text-muted"><i class="bi bi-house-door-fill me-1"></i>Trang chủ</router-link></li>
            <li class="breadcrumb-item active text-main-brown fw-bold" aria-current="page">Tin tức & Sự kiện</li>
          </ol>
        </nav>

        <div class="featured-news mb-5" v-if="featuredPost">
          <div class="row g-0 rounded overflow-hidden shadow-sm border">
            <div class="col-md-7 position-relative overflow-hidden group-hover-parent">
               <img :src="featuredPost.image" class="w-100 h-100 object-fit-cover transition-zoom" :alt="featuredPost.title" style="min-height: 350px;">
               <div class="position-absolute top-0 start-0 m-3">
                 <span class="badge bg-vipep-red shadow">Nổi bật</span>
               </div>
            </div>
            <div class="col-md-5 bg-light-brown-subtle d-flex align-items-center">
              <div class="p-4 p-lg-5">
                <div class="mb-2 text-muted small"><i class="bi bi-calendar3 me-2"></i>{{ featuredPost.date }}</div>
                <h2 class="display-6 fw-bold text-main-brown mb-3 hover-text-green cursor-pointer">{{ featuredPost.title }}</h2>
                <p class="lead mb-4 text-secondary fs-6">{{ featuredPost.desc }}</p>
                <button class="btn btn-outline-main-brown rounded-pill px-4">Đọc tiếp <i class="bi bi-arrow-right ms-2"></i></button>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-5">
          <div class="col-lg-9">
            <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
               <h3 class="fw-bold text-main-brown m-0 text-uppercase">Tin mới nhất</h3>
               <div class="dropdown">
                  <button class="btn btn-sm btn-light border dropdown-toggle" type="button" data-bs-toggle="dropdown">Mới nhất</button>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="#">Mới nhất</a></li>
                    <li><a class="dropdown-item" href="#">Cũ nhất</a></li>
                    <li><a class="dropdown-item" href="#">Xem nhiều</a></li>
                  </ul>
               </div>
            </div>

            <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
              <div class="col" v-for="news in newsList" :key="news.id">
                <article class="card h-100 border-0 shadow-sm hover-up transition-all">
                  <div class="card-img-wrapper overflow-hidden position-relative" style="height: 200px;">
                    <img :src="news.image" class="card-img-top w-100 h-100 object-fit-cover transition-zoom" :alt="news.title">
                    <span class="badge bg-vipep-green position-absolute bottom-0 start-0 m-2">{{ news.category }}</span>
                  </div>
                  <div class="card-body">
                    <div class="small text-muted mb-2 d-flex justify-content-between">
                      <span><i class="bi bi-calendar-event me-1"></i> {{ news.date }}</span>
                      <span><i class="bi bi-eye me-1"></i> {{ news.views }}</span>
                    </div>
                    <h5 class="card-title fw-bold text-dark hover-text-brown cursor-pointer line-clamp-2">{{ news.title }}</h5>
                    <p class="card-text text-secondary small line-clamp-3">{{ news.desc }}</p>
                  </div>
                  <div class="card-footer bg-white border-top-0 pt-0 pb-3">
                    <a href="#" class="text-decoration-none text-main-brown fw-bold small hover-green">Xem chi tiết <i class="bi bi-chevron-right" style="font-size: 10px;"></i></a>
                  </div>
                </article>
              </div>
            </div>

            <nav class="mt-5">
              <ul class="pagination justify-content-center">
                <li class="page-item disabled"><a class="page-link" href="#">Trước</a></li>
                <li class="page-item active"><a class="page-link" href="#">1</a></li>
                <li class="page-item"><a class="page-link" href="#">2</a></li>
                <li class="page-item"><a class="page-link" href="#">3</a></li>
                <li class="page-item"><a class="page-link" href="#">Sau</a></li>
              </ul>
            </nav>
          </div>

          <aside class="col-lg-3">
            <div class="sidebar-block mb-4">
               <h5 class="sidebar-title">Tìm kiếm</h5>
               <div class="border p-3 rounded-bottom bg-light">
                 <div class="input-group">
                   <input type="text" class="form-control" placeholder="Từ khóa...">
                   <button class="btn btn-main-brown text-white"><i class="bi bi-search"></i></button>
                 </div>
               </div>
            </div>

            <div class="sidebar-block mb-4">
              <h5 class="sidebar-title">Danh mục tin</h5>
              <ul class="list-unstyled sidebar-list border p-3 pt-2">
                <li v-for="cat in categories" :key="cat.name">
                    <a href="#" class="d-flex justify-content-between align-items-center">
                        {{ cat.name }} <i class="bi bi-chevron-right small text-muted"></i>
                    </a>
                </li>
              </ul>
            </div>

            <div class="sidebar-block mb-4">
              <h5 class="sidebar-title">Tin xem nhiều</h5>
              <div class="border p-3 bg-white">
                 <div class="d-flex gap-3 mb-3 align-items-start" v-for="post in recentPosts" :key="post.id">
                    <img :src="post.image" class="rounded object-fit-cover" style="width: 70px; height: 70px;" alt="thumb">
                    <div>
                      <h6 class="small fw-bold mb-1 hover-text-green cursor-pointer line-clamp-2">{{ post.title }}</h6>
                      <small class="text-muted" style="font-size: 11px;">{{ post.date }}</small>
                    </div>
                 </div>
              </div>
            </div>

            <div class="sidebar-block">
               <h5 class="sidebar-title">Tags nổi bật</h5>
               <div class="border p-3 d-flex flex-wrap gap-2">
                  <a href="#" class="badge bg-light text-secondary border text-decoration-none fw-normal p-2 hover-bg-brown" v-for="tag in tags" :key="tag">{{ tag }}</a>
               </div>
             </div>
          </aside>
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
  name: 'NewsView',
  data() {
    return {
      // Dữ liệu bài viết nổi bật
      featuredPost: {
        id: 0,
        title: 'Hành trình Vipep mang Gia vị Việt vươn tầm thế giới tại Organic Food Show 2025',
        desc: 'Vipep tự hào là thương hiệu gia vị hữu cơ Việt Nam duy nhất góp mặt tại triển lãm quốc tế, giới thiệu đến bạn bè năm châu hương vị đậm đà bản sắc Việt...',
        date: '20/12/2025',
        image: 'https://placehold.co/800x450?text=Featured+News'
      },
      // Dữ liệu danh sách tin tức
      newsList: [
        { id: 1, title: 'Cách phân biệt Tiêu đen hữu cơ và Tiêu thường chuẩn xác nhất', desc: 'Mẹo nhỏ giúp bà nội trợ chọn đúng tiêu sạch, an toàn cho sức khỏe gia đình.', date: '18/12/2025', views: 1250, category: 'Mẹo vặt', image: 'https://placehold.co/400x300?text=News+1' },
        { id: 2, title: 'Ra mắt bộ sưu tập Sốt chấm Vipep - Tròn vị mọi bữa ăn', desc: 'Thưởng thức hương vị BBQ Hàn Quốc, Sốt tiêu đen ngay tại nhà chỉ với 1 bước.', date: '15/12/2025', views: 890, category: 'Sản phẩm mới', image: 'https://placehold.co/400x300?text=News+2' },
        { id: 3, title: 'Lợi ích bất ngờ của Muối hồng Himalaya đối với sức khỏe', desc: 'Không chỉ là gia vị, muối hồng còn là liệu pháp spa tại gia tuyệt vời.', date: '10/12/2025', views: 2100, category: 'Sức khỏe', image: 'https://placehold.co/400x300?text=News+3' },
        { id: 4, title: 'Vipep đạt chứng nhận Organic USDA năm thứ 5 liên tiếp', desc: 'Khẳng định cam kết chất lượng bền vững với người tiêu dùng Việt.', date: '05/12/2025', views: 3400, category: 'Sự kiện', image: 'https://placehold.co/400x300?text=News+4' },
        { id: 5, title: 'Công thức Gà nướng mật ong sốt tiêu đen ngon khó cưỡng', desc: 'Bí quyết ướp gà thấm vị, da giòn thịt mềm với gia vị Vipep.', date: '01/12/2025', views: 1500, category: 'Góc bếp', image: 'https://placehold.co/400x300?text=News+5' },
        { id: 6, title: 'Thông báo lịch nghỉ Tết Nguyên Đán Ất Tỵ 2025', desc: 'Vipep xin trân trọng thông báo đến Quý khách hàng lịch nghỉ tết và giao hàng.', date: '28/11/2025', views: 5000, category: 'Thông báo', image: 'https://placehold.co/400x300?text=News+6' }
      ],
      // Danh mục sidebar
      categories: [
        { name: 'Tin tức công ty' },
        { name: 'Sự kiện & Khuyến mãi' },
        { name: 'Góc bếp Vipep' },
        { name: 'Kiến thức gia vị' },
        { name: 'Sống xanh - Sống sạch' }
      ],
      // Bài viết xem nhiều sidebar
      recentPosts: [
        { id: 101, title: 'Top 5 loại gia vị không thể thiếu trong ngày Tết', date: '22/12/2025', image: 'https://placehold.co/100x100?text=Tet' },
        { id: 102, title: 'Khuyến mãi mua 1 tặng 1 mừng Giáng Sinh', date: '24/12/2025', image: 'https://placehold.co/100x100?text=Xmas' },
        { id: 103, title: 'Hướng dẫn làm quà tặng doanh nghiệp từ gia vị', date: '20/12/2025', image: 'https://placehold.co/100x100?text=Gift' }
      ],
      tags: ['Organic', 'Tiêu đen', 'Sốt BBQ', 'Món ngon', 'Sức khỏe', 'Khuyến mãi', 'Vipep']
    }
  }
}
</script>

<style scoped>
/* ================= VARIABLES & UTILS (GIỮ NGUYÊN TỪ HOTDEAL) ================= */
:root {
  --main-brown: #4d3105;
  --light-brown: #8b572a;
  --vipep-green: #7eb33d;
  --vipep-red: #ee2624;
}

.text-main-brown { color: #4d3105 !important; }
.bg-main-brown { background-color: #4d3105 !important; }
.text-vipep-green { color: #7eb33d !important; }
.bg-vipep-green { background-color: #7eb33d !important; }
.bg-vipep-red { background-color: #ee2624 !important; }
.bg-light-brown-subtle { background-color: #fdf8f0; }
.hover-text-brown:hover { color: #4d3105 !important; transition: 0.2s; }
.hover-text-green:hover { color: #7eb33d !important; transition: 0.2s; }
.hover-green:hover { color: #7eb33d !important; }
.hover-white:hover { color: white !important; }
.hover-bg-brown:hover { background-color: #4d3105 !important; color: white !important; }
.cursor-pointer { cursor: pointer; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.object-fit-cover { object-fit: cover; }

/* ================= HEADER STYLE (GIỮ NGUYÊN) ================= */
.main-logo { max-height: 55px; }
.cart-btn { background-color: #4d3105; padding: 8px 15px; border-radius: 10px; transition: 0.3s; }
.cart-btn:hover { background-color: #7eb33d; }
.main-menu { background-color: #4d3105; }
.nav-link { color: #fff !important; font-size: 13px !important; font-weight: 700; padding: 14px 18px !important; }
.nav-link:hover, .nav-link.active { color: #7eb33d !important; }

/* ================= NEWS SPECIFIC STYLES (MỚI) ================= */
.btn-outline-main-brown { border: 1px solid #4d3105; color: #4d3105; transition: 0.3s; }
.btn-outline-main-brown:hover { background-color: #4d3105; color: #fff; }

.hover-up:hover { transform: translateY(-5px); box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; }
.transition-all { transition: all 0.3s ease; }
.transition-zoom { transition: transform 0.6s ease; }
.group-hover-parent:hover .transition-zoom,
.card:hover .transition-zoom { transform: scale(1.05); }

/* Sidebar Styles */
.sidebar-title { background-color: #4d3105; color: #fff; padding: 10px 15px; font-size: 16px; font-weight: bold; border-radius: 8px 8px 0 0; margin-bottom: 0; }
.sidebar-list { border-radius: 0 0 8px 8px; }
.sidebar-list li { padding: 10px 0; border-bottom: 1px dashed #eee; }
.sidebar-list li:last-child { border-bottom: none; }
.sidebar-list a { text-decoration: none; color: #555; font-size: 14px; transition: 0.2s; }
.sidebar-list a:hover { color: #7eb33d; padding-left: 5px; }

/* Pagination Override */
.pagination .page-link { color: #333; border: none; margin: 0 3px; border-radius: 4px; font-weight: 600; }
.pagination .page-item.active .page-link { background-color: #4d3105; color: white; }

/* ================= FOOTER & ANIMATION (GIỮ NGUYÊN) ================= */
.wave-separator { width: 100%; height: 120px; background: #ffffff; position: relative; margin-bottom: -1px; }
.wave-svg { position: absolute; bottom: 0; width: 100%; height: 120px; display: block; }
@keyframes shake { 0% { transform: rotate(0deg); } 25% { transform: rotate(10deg); } 75% { transform: rotate(-10deg); } 100% { transform: rotate(0deg); } }
.shake-animation { animation: shake 1.5s infinite ease-in-out; }
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