<template>
  <div class="home-page font-general">
    <!-- HEADER STICKY - GIỐNG HỆT TRANG LIÊN HỆ (CẤU TRÚC, ACTIVE LINK, BORDER-END-0 TRÊN ITEM CUỐI) -->
  

    <!-- Carousel Banner -->
    <section class="container-fluid px-0 my-0">
      <div id="vipepCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="4000">
        <div class="carousel-indicators">
          <button type="button" data-bs-target="#vipepCarousel" data-bs-slide-to="0" class="active"></button>
          <button type="button" data-bs-target="#vipepCarousel" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#vipepCarousel" data-bs-slide-to="2"></button>
        </div>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="@/assets/images/banner.png" class="d-block w-100 banner-img" alt="Banner chính VIPEP">
          </div>
          <div class="carousel-item">
            <img src="@/assets/images/banner-flash-sale.png" class="d-block w-100 banner-img" alt="Flash Sale VIPEP">
          </div>
          <div class="carousel-item">
            <img src="@/assets/images/banner1.png" class="d-block w-100 banner-img" alt="Banner Khuyến Mãi">
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#vipepCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon p-3 bg-dark rounded-circle opacity-50"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#vipepCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon p-3 bg-dark rounded-circle opacity-50"></span>
        </button>
      </div>
    </section>

    <!-- Service Bar -->
    <section class="service-bar py-4 bg-white border-bottom shadow-sm position-relative" style="z-index: 10;">
      <div class="container">
        <div class="row text-center g-3">
          <div class="col-lg-3 col-6 service-item">
            <div class="d-flex align-items-center justify-content-center gap-2">
              <i class="bi bi-shield-check text-vipep-green fs-2"></i>
              <div class="text-start lh-1">
                <span class="d-block fw-bold text-dark">100% Tự Nhiên</span>
                <small class="text-muted" style="font-size: 12px;">Không tạp chất</small>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-6 service-item">
            <div class="d-flex align-items-center justify-content-center gap-2">
              <i class="bi bi-patch-check text-vipep-green fs-2"></i>
              <div class="text-start lh-1">
                <span class="d-block fw-bold text-dark">Chất Lượng</span>
                <small class="text-muted" style="font-size: 12px;">Cam kết đổi trả</small>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-6 service-item">
            <div class="d-flex align-items-center justify-content-center gap-2">
              <i class="bi bi-headset text-vipep-green fs-2"></i>
              <div class="text-start lh-1">
                <span class="d-block fw-bold text-dark">Hỗ Trợ 24/7</span>
                <small class="text-muted" style="font-size: 12px;">Tư vấn nhiệt tình</small>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-6 service-item">
            <div class="d-flex align-items-center justify-content-center gap-2">
              <i class="bi bi-truck text-vipep-green fs-2"></i>
              <div class="text-start lh-1">
                <span class="d-block fw-bold text-dark">Giao Hàng Nhanh</span>
                <small class="text-muted" style="font-size: 12px;">Toàn quốc</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Danh Mục Sản Phẩm -->
   <section class="container my-5">
    <h3 class="fw-bold mb-4 text-uppercase text-dark" style="color: #4a4a4a;">DANH MỤC VIPEP</h3>
    <div class="row g-3">
      <div class="col-lg-3 col-md-6" v-for="(cat, index) in vipepCategories" :key="index">
        <router-link :to="cat.link" class="vipep-cat-card d-flex align-items-center justify-content-between p-3 h-100 position-relative overflow-hidden text-decoration-none shadow-sm">
          
          <div class="cat-content z-2">
            <h5 class="fw-bold text-white mb-2">{{ cat.title }}</h5>
            <ul class="list-unstyled mb-0 text-white-50 small">
              <li v-for="(sub, sIndex) in cat.subs" :key="sIndex">
                <i class="bi bi-dot"></i> {{ sub }}
              </li>
            </ul>
          </div>
          
          <div class="cat-img-wrapper z-2">
            <img :src="cat.img" :alt="cat.title" class="img-fluid rounded-circle border-glow">
          </div>

          <div class="bg-gradient-overlay"></div>
        </router-link>
      </div>
    </div>
  </section>

    <!-- Flash Sale -->
    <section class="container my-5 section-divider">
      <div class="flash-sale-wrapper border border-2 border-danger rounded-4 p-4 bg-white position-relative shadow-sm">
        <div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <div class="d-flex align-items-center">
            <i class="bi bi-lightning-fill text-danger fs-2 me-2 animate-flicker"></i>
            <h3 class="fw-bold mb-0 text-uppercase text-danger fst-italic">Flash Sale Giá Sốc</h3>
          </div>
          <div class="countdown-timer d-flex gap-2">
            <span class="bg-dark text-white rounded px-2 py-1 fw-bold">02</span> :
            <span class="bg-dark text-white rounded px-2 py-1 fw-bold">15</span> :
            <span class="bg-dark text-white rounded px-2 py-1 fw-bold">45</span>
          </div>
        </div>
        <div class="row g-3">
          <div class="col-lg-2-4 col-md-4 col-6" v-for="item in flashSaleProducts" :key="item.id">
            <div class="flash-product-card border rounded-3 p-2 position-relative h-100 bg-white">
              <div class="badge-sale shadow-sm">-{{ item.discount }}%</div>
              <div class="img-container text-center mb-3">
                <img :src="item.image" class="img-fluid hover-zoom" alt="Sản phẩm sale">
              </div>
              <h6 class="product-name-mini text-truncate-2 mb-1">{{ item.name }}</h6>
              <div class="price-section">
                <span class="current-price text-danger fw-bold fs-5">{{ item.salePrice }}₫</span>
                <span class="old-price text-muted text-decoration-line-through small ms-2">{{ item.originalPrice }}₫</span>
              </div>
              <div class="stock-progress mt-2 position-relative">
                <div class="progress" style="height: 14px; background-color: #ffcccc;">
                  <div class="progress-bar bg-danger rounded-pill" role="progressbar" :style="{ width: item.soldPercent + '%' }"></div>
                </div>
                <span class="progress-text">Đã bán {{ item.soldCount || '85%' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Video + Banner bên phải -->
    <section class="container my-5 section-divider">
      <div class="row g-4 align-items-stretch">
        <div class="col-lg-6">
          <div class="video-container h-100 rounded-4 overflow-hidden shadow-sm border">
            <iframe width="100%" height="100%" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Vipep Intro" frameborder="0" allowfullscreen style="min-height: 400px;"></iframe>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="row g-3 h-100">
            <div class="col-12 h-50"><img src="@/assets/images/banner5.png" class="img-fluid rounded-4 shadow-sm w-100 h-100 object-fit-cover" alt="Banner Chính"></div>
            <div class="col-6 h-50"><img src="@/assets/images/sanpham1.png" class="img-fluid rounded-4 shadow-sm border w-100 h-100 object-fit-cover" alt="SP1"></div>
            <div class="col-6 h-50"><img src="@/assets/images/sanpham2.png" class="img-fluid rounded-4 shadow-sm border w-100 h-100 object-fit-cover" alt="SP2"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Gia Vị Hữu Cơ -->
    <section class="container my-5 section-group section-divider">
      <div class="d-flex justify-content-between align-items-center mb-3 border-bottom-green pb-2">
        <h4 class="fw-bold text-uppercase m-0 text-vipep-green">Gia Vị Hữu Cơ - Organic</h4>
        <a href="#" class="text-secondary text-decoration-none d-none d-md-block small hover-underline">Xem tất cả <i class="bi bi-chevron-right"></i></a>
      </div>
      <div class="row g-3">
        <div class="col-lg-3 d-none d-lg-block">
          <div class="banner-side rounded-4 h-100 shadow-sm" :style="{ backgroundImage: `url(${giavihuuco1})` }">
            <div class="banner-overlay p-4 d-flex flex-column justify-content-end h-100">
              <span class="badge bg-warning text-dark w-auto mb-2">Best Seller</span>
              <h5 class="fw-bold text-white mb-0 text-shadow">100% ORGANIC</h5>
              <p class="text-white-50 small">Chuẩn USDA, EU</p>
            </div>
          </div>
        </div>
        <div class="col-lg-9">
          <div class="row g-3">
            <div class="col-md-3 col-6" v-for="p in organicProducts" :key="p.id">
              <div class="product-item-card border rounded-3 p-3 bg-white h-100 text-center position-relative">
                <div class="badge-discount">-{{ p.discount }}%</div>
                <img :src="p.image" class="img-fluid mb-3 p-2 hover-zoom" :alt="p.name">
                <h6 class="product-name-small text-truncate-2 mb-2">{{ p.name }}</h6>
                <div class="price-box">
                  <span class="text-danger fw-bold fs-5">{{ p.price }}₫</span>
                  <div class="text-muted small text-decoration-line-through">{{ p.oldPrice }}₫</div>
                </div>
                <button class="btn btn-outline-success btn-sm rounded-pill w-100 mt-2 add-cart-btn"><i class="bi bi-cart-plus"></i> Thêm</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Muối Hồng Himalaya -->
    <section class="container my-5 section-group section-divider">
      <div class="d-flex justify-content-between align-items-center mb-3 border-bottom-green pb-2">
        <h4 class="fw-bold text-uppercase m-0 text-vipep-green">Muối Hồng Himalaya</h4>
        <a href="#" class="text-secondary text-decoration-none d-none d-md-block small hover-underline">Xem tất cả <i class="bi bi-chevron-right"></i></a>
      </div>
      <div class="row g-3">
        <div class="col-lg-9">
          <div class="row g-3">
            <div class="col-md-3 col-6" v-for="p in saltProducts" :key="p.id">
              <div class="product-item-card border rounded-3 p-3 bg-white h-100 text-center position-relative">
                <div class="badge-discount">-{{ p.discount }}%</div>
                <img :src="p.image" class="img-fluid mb-3 p-2 hover-zoom" :alt="p.name">
                <h6 class="product-name-small text-truncate-2 mb-2">{{ p.name }}</h6>
                <div class="price-box">
                  <span class="text-danger fw-bold fs-5">{{ p.price }}₫</span>
                  <div class="text-muted small text-decoration-line-through">{{ p.oldPrice }}₫</div>
                </div>
                <button class="btn btn-outline-success btn-sm rounded-pill w-100 mt-2 add-cart-btn"><i class="bi bi-cart-plus"></i> Thêm</button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 d-none d-lg-block">
          <div class="banner-side rounded-4 h-100 shadow-sm" :style="{ backgroundImage: `url(${muoihong5})` }">
            <div class="banner-overlay p-4 d-flex flex-column justify-content-end h-100 text-end">
              <h5 class="fw-bold text-white mb-0 text-shadow">PINK SALT</h5>
              <p class="text-white-50 small">Tinh khiết từ thiên nhiên</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Gia Vị Nấu Hoàn Chỉnh -->
    <section class="container my-5 section-group section-divider">
      <div class="d-flex justify-content-between align-items-center mb-3 border-bottom-green pb-2">
        <h4 class="fw-bold text-uppercase m-0 text-vipep-green">Gia Vị Nấu Hoàn Chỉnh</h4>
        <a href="#" class="text-secondary text-decoration-none d-none d-md-block small hover-underline">Xem tất cả <i class="bi bi-chevron-right"></i></a>
      </div>
      <div class="row g-3">
        <div class="col-lg-3 d-none d-lg-block">
          <div class="banner-side rounded-4 h-100 shadow-sm" :style="{ backgroundImage: `url(${nguyenlieu1})` }">
            <div class="banner-overlay p-4 d-flex flex-column justify-content-end h-100">
              <h5 class="fw-bold text-white mb-0 text-shadow">READY TO COOK</h5>
              <p class="text-white-50 small">Nấu ngon chỉ trong 30p</p>
            </div>
          </div>
        </div>
        <div class="col-lg-9">
          <div class="row g-3">
            <div class="col-md-3 col-6" v-for="p in ingredientProducts" :key="p.id">
              <div class="product-item-card border rounded-3 p-3 bg-white h-100 text-center position-relative">
                <div class="badge-discount">-{{ p.discount }}%</div>
                <img :src="p.image" class="img-fluid mb-3 p-2 hover-zoom" :alt="p.name">
                <h6 class="product-name-small text-truncate-2 mb-2">{{ p.name }}</h6>
                <div class="price-box">
                  <span class="text-danger fw-bold fs-5">{{ p.price }}₫</span>
                  <div class="text-muted small text-decoration-line-through">{{ p.oldPrice }}₫</div>
                </div>
                <button class="btn btn-outline-success btn-sm rounded-pill w-100 mt-2 add-cart-btn"><i class="bi bi-cart-plus"></i> Thêm</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sốt Hàn Quốc -->
    <section class="container my-5 section-divider">
      <div class="mb-4 rounded-4 overflow-hidden shadow-sm">
        <img :src="bannerHanQuoc" class="w-100 img-fluid" alt="Banner Sốt Chấm Hàn Quốc">
      </div>
      <div class="text-center mb-4">
        <h4 class="korean-title d-inline-block px-5 py-2 text-uppercase fw-bold shadow-sm">
          🔥 CÔNG THỨC SỐT HÀN QUỐC ĐỘC QUYỀN
        </h4>
      </div>
      <div class="row g-3">
        <div class="col-lg-3 col-md-6" v-for="p in koreanSauces" :key="p.id">
          <div class="product-item-card border-gold rounded-3 p-3 bg-white h-100 text-center position-relative shadow-sm">
            <div class="badge-discount bg-danger">Hot</div>
            <img :src="p.image" class="img-fluid mb-3 p-2 hover-zoom" :alt="p.name">
            <h6 class="product-name-small text-truncate-2 px-2 text-start">{{ p.name }}</h6>
            <div class="price-box text-start px-2 d-flex justify-content-between align-items-center">
              <div>
                <span class="text-danger fw-bold fs-5">{{ p.price }}₫</span>
                <span class="text-muted small text-decoration-line-through ms-1">{{ p.oldPrice }}₫</span>
              </div>
              <button class="btn btn-sm btn-dark rounded-circle"><i class="bi bi-bag-plus"></i></button>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center mt-5 position-relative">
        <div class="line-center"></div>
        <button class="btn btn-brown rounded-pill px-5 py-2 btn-more fw-bold text-uppercase shadow">Xem thêm sản phẩm khác</button>
      </div>
    </section>

    <!-- Review Khách Hàng -->
    <section class="container my-5 pb-5">
      <div class="text-center mb-5">
        <h3 class="fw-bold text-uppercase" style="color: #4a4a4a;">KHÁCH HÀNG NÓI GÌ VỀ VIPEP?</h3>
        <div class="divider-small mx-auto bg-success mt-2"></div>
      </div>
      <div id="reviewCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="5000">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <div class="row g-4">
              <div class="col-md-6">
                <div class="review-card p-4 bg-white border rounded-4 shadow-sm h-100 position-relative">
                  <div class="d-flex align-items-center mb-3">
                    <img src="https://i.pravatar.cc/150?u=trang" class="rounded-circle me-3 border border-2 border-success p-1" width="65" height="65" alt="Avatar">
                    <div>
                      <h6 class="fw-bold mb-0 text-brown">Chị Trang Nguyễn</h6>
                      <small class="text-muted">Nhân viên văn phòng - TP.HCM</small>
                      <div class="text-warning small"><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i></div>
                    </div>
                  </div>
                  <p class="mb-0 text-secondary review-content fst-italic">
                    "Gia vị sạch, thơm chuẩn, nấu món nào cũng dậy mùi. Đặc biệt là muối hồng Himalaya dùng ướp thịt nướng rất ngon, không bị mặn gắt như muối thường. Rất đáng tiền!"
                  </p>
                  <i class="bi bi-quote quote-icon opacity-25"></i>
                </div>
              </div>
              <div class="col-md-6">
                <div class="review-card p-4 bg-white border rounded-4 shadow-sm h-100 position-relative">
                  <div class="d-flex align-items-center mb-3">
                    <img src="https://i.pravatar.cc/150?u=nhung" class="rounded-circle me-3 border border-2 border-success p-1" width="65" height="65" alt="Avatar">
                    <div>
                      <h6 class="fw-bold mb-0 text-brown">Cô Hồng Nhung</h6>
                      <small class="text-muted">Nội trợ - Hà Nội</small>
                      <div class="text-warning small"><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i></div>
                    </div>
                  </div>
                  <p class="mb-0 text-secondary review-content fst-italic">
                    "Ưng nhất là hũ tiêu xay và bột tỏi, mùi thơm rất tự nhiên không bị pha trộn. Đóng gói hũ thủy tinh rất đẹp và sạch sẽ, mình mua biếu ông bà cũng rất thích."
                  </p>
                  <i class="bi bi-quote quote-icon opacity-25"></i>
                </div>
              </div>
            </div>
          </div>
          <!-- Các carousel-item khác giữ nguyên như code bạn cung cấp -->
          <!-- (carousel-item thứ 2 và 3) -->
        </div>
        <button class="carousel-control-prev w-auto ps-0" type="button" data-bs-target="#reviewCarousel" data-bs-slide="prev" style="left: -50px; opacity: 1;">
          <span class="carousel-control-prev-icon bg-brown rounded-circle p-3" aria-hidden="true"></span>
        </button>
        <button class="carousel-control-next w-auto pe-0" type="button" data-bs-target="#reviewCarousel" data-bs-slide="next" style="right: -50px; opacity: 1;">
          <span class="carousel-control-next-icon bg-brown rounded-circle p-3" aria-hidden="true"></span>
        </button>
      </div>
    </section>

    <!-- Nấu Ăn Cùng Vipep -->
    <section class="cooking-section my-5 pb-4">
      <div class="container">
        <h2 class="section-title text-uppercase fw-bold mb-4" style="color: #4a4a4a;">NẤU ĂN CÙNG VIPEP</h2>
        <div class="row g-4">
          <div class="col-lg-3 col-md-6" v-for="item in cookingList" :key="item.id">
            <div class="cooking-item mb-3">
              <div class="img-box rounded-3 overflow-hidden mb-3" style="height: 180px;">
                <img :src="item.img" :alt="item.title" class="img-fluid w-100 h-100 object-fit-cover zoom-effect">
              </div>
              <h6 class="fw-bold text-uppercase text-dark" style="font-size: 0.9rem; line-height: 1.4;">
                <a href="#" class="text-decoration-none text-dark hover-green">{{ item.title }}</a>
              </h6>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tin Tức -->
    <section class="news-section my-5 pb-5">
      <div class="container">
        <h2 class="section-title text-uppercase fw-bold mb-4" style="color: #4a4a4a;">THÔNG TIN VIPEP</h2>
        <div class="row g-4">
          <div class="col-lg-4 col-md-6" v-for="news in newsList" :key="news.id">
            <div class="news-item mb-3">
              <div class="img-box position-relative rounded-3 overflow-hidden mb-3" style="height: 240px;">
                <div class="date-badge position-absolute top-0 start-0 bg-brown-accent text-white p-2 text-center" style="border-bottom-right-radius: 10px; min-width: 60px;">
                  <span class="d-block fw-bold fs-4 lh-1">{{ news.day }}</span>
                  <small style="font-size: 0.7rem;">{{ news.year }}</small>
                </div>
                <img :src="news.img" :alt="news.title" class="img-fluid w-100 h-100 object-fit-cover zoom-effect">
              </div>
              <div class="news-content">
                <h6 class="fw-bold text-dark mb-2 text-truncate-2" style="font-size: 1rem;">
                  <a href="#" class="text-decoration-none text-dark hover-green">{{ news.title }}</a>
                </h6>
                <p class="text-muted small text-truncate-3 mb-0">{{ news.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PHẦN SÓNG NÂU TRƯỚC FOOTER -->
 <div class="wave-separator">
  <svg viewBox="0 0 1440 120" preserveAspectRatio="none" class="wave-svg">
    <path d="M0,0 C360,100 1080,20 1440,80 L1440,120 L0,120 Z" fill="#212529"></path>
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
import Navbar from '@/components/Navbar.vue'

// Import ảnh
import muoiHongImg from '@/assets/images/muoi-hong.jpg'
import taoDoImg from '@/assets/images/tao-do.jpg'
import giavihuuco1 from '@/assets/images/giavihuuco1.png'
import giavihuuco2 from '@/assets/images/giavihuuco2.png'
import giavihuuco3 from '@/assets/images/giavihuuco3.jpg'
import giavihuuco4 from '@/assets/images/giavihuuco4.jpg'
import giavihuuco5 from '@/assets/images/giavihuuco5.jpg'
import muoihong1 from '@/assets/images/muoihong1.jpg'
import muoihong2 from '@/assets/images/muoihong2.jpg'
import muoihong3 from '@/assets/images/muoihong3.jpg'
import muoihong4 from '@/assets/images/muoihong4.jpg'
import muoihong5 from '@/assets/images/muoihong5.png'
import nguyenlieu1 from '@/assets/images/nguyenlieu1.png'
import nguyenlieu2 from '@/assets/images/nguyenlieu2.jpg'
import nguyenlieu3 from '@/assets/images/nguyenlieu3.jpg'
import nguyenlieu4 from '@/assets/images/nguyenlieu4.jpg'
import nguyenlieu5 from '@/assets/images/nguyenlieu5.jpg'
import bannerHanQuoc from '@/assets/images/banner-han-quoc.png'
import poster1 from '@/assets/images/poster1.png'
import poster2 from '@/assets/images/poster2.png'
import poster3 from '@/assets/images/poster3.png'
import poster4 from '@/assets/images/poster4.png'
import poster5 from '@/assets/images/poster5.jpg'
import poster6 from '@/assets/images/poster6.jpg'
import poster7 from '@/assets/images/poster7.jpg'
import poster8 from '@/assets/images/poster8.jpg'
import poster9 from '@/assets/images/poster9.jpg'
import poster10 from '@/assets/images/poster10.jpg'
import poster11 from '@/assets/images/poster11.jpg'
import img1 from '@/assets/images/image1.png'
import img2 from '@/assets/images/image2.png'
import img3 from '@/assets/images/image3.png'
import img4 from '@/assets/images/image4.png'

const vipepCategories = [
  {
    title: "Gia Vị",
    subs: ["Gia vị tự nhiên", "Gia vị hữu cơ", "Gia vị kết hợp"],
    img: img1,
    link: "/san-pham/gia-vi"
  },
  {
    title: "Muối Himalaya",
    subs: ["Muối hồng hạt", "Muối hồng mịn"],
    img: img2,
    link: "/san-pham/muoi-himalaya"
  },
  {
    title: "Nguyên Liệu",
    subs: ["Nấu phở", "Nấu lẩu", "Nướng & Kho"],
    img: img3,
    link: "/san-pham/nguyen-lieu"
  },
  {
    title: "Combo Nấu Ăn",
    subs: ["Combo ăn dặm", "Combo tẩm ướp", "Combo tiết kiệm"],
    img: img4,
    link: "/san-pham/combo"
  }
];

// Data sản phẩm và nội dung
const categories = [
  { title: 'Gia Vị Tự Nhiên', subs: ['Tiêu', 'Ớt bột', 'Ngũ vị hương'], img: muoiHongImg },
  { title: 'Muối Himalaya', subs: ['Muối ăn', 'Muối tắm', 'Đèn đá muối'], img: muoiHongImg },
  { title: 'Nông Sản - Nguyên Liệu', subs: ['Quế, Hồi', 'Thảo quả', 'Táo đỏ'], img: taoDoImg },
  { title: 'Combo Tiện Lợi', subs: ['Gia vị nấu phở', 'Gia vị lẩu', 'Ướp BBQ'], img: taoDoImg }
]

const flashSaleProducts = [
  { id: 1, name: 'Combo 02 Hũ Muối Hồng Himalaya Xay Nhuyễn 500g', discount: 25, salePrice: '85,000', originalPrice: '114,000', soldPercent: 90, soldCount: 1500, image: muoiHongImg },
  { id: 2, name: 'Tiêu Đen Xay Phú Quốc Hũ 60g - Thơm Cay Nồng', discount: 15, salePrice: '45,000', originalPrice: '53,000', soldPercent: 70, soldCount: 520, image: taoDoImg },
  { id: 3, name: 'Gói Gia Vị Nấu Phở Bò Truyền Thống (Set 2 gói)', discount: 10, salePrice: '38,000', originalPrice: '42,000', soldPercent: 45, soldCount: 300, image: taoDoImg },
  { id: 4, name: 'Sốt Ướp Đồ Nướng BBQ Vị Truyền Thống 250g', discount: 20, salePrice: '55,000', originalPrice: '69,000', soldPercent: 60, soldCount: 400, image: muoiHongImg },
  { id: 5, name: 'Táo Đỏ Tân Cương Trái To Loại 1 (Túi 500g)', discount: 12, salePrice: '125,000', originalPrice: '142,000', soldPercent: 80, soldCount: 950, image: taoDoImg }
]

const organicProducts = [
  { id: 1, name: 'Bột Nghệ Hữu Cơ Vipep Organic 45g', price: '48,000', oldPrice: '55,000', discount: 12, image: giavihuuco2 },
  { id: 2, name: 'Bột Tỏi Nguyên Chất Hữu Cơ 50g', price: '52,000', oldPrice: '60,000', discount: 15, image: giavihuuco3 },
  { id: 3, name: 'Bột Gừng Sẻ Hữu Cơ 40g', price: '45,000', oldPrice: '50,000', discount: 10, image: giavihuuco4 },
  { id: 4, name: 'Bột Quế Rừng Organic Cao Cấp 45g', price: '55,000', oldPrice: '65,000', discount: 15, image: giavihuuco5 }
]

const saltProducts = [
  { id: 5, name: 'Muối Hồng Himalaya Nguyên Hạt 500g', price: '45,000', oldPrice: '55,000', discount: 18, image: muoihong2 },
  { id: 6, name: 'Muối Hồng Himalaya Xay Nhuyễn Hũ 1.1kg', price: '95,000', oldPrice: '120,000', discount: 20, image: muoihong3 },
  { id: 7, name: 'Đèn Đá Muối Himalaya Hình Cầu Tự Nhiên', price: '350,000', oldPrice: '450,000', discount: 22, image: muoihong4 },
  { id: 8, name: 'Muối Hồng Hạt Tắm Tẩy Tế Bào Chết 1kg', price: '65,000', oldPrice: '80,000', discount: 19, image: muoihong1 }
]

const ingredientProducts = [
  { id: 9, name: 'Set Nguyên Liệu Nấu Phở Bò Gia Truyền (5 người ăn)', price: '89,000', oldPrice: '110,000', discount: 19, image: nguyenlieu2 },
  { id: 10, name: 'Combo Gia Vị Nấu Lẩu Thái Chua Cay', price: '55,000', oldPrice: '65,000', discount: 15, image: nguyenlieu3 },
  { id: 11, name: 'Gia Vị Nấu Bò Kho/Cà Ri Gói Tiện Lợi', price: '25,000', oldPrice: '30,000', discount: 16, image: nguyenlieu4 },
  { id: 12, name: 'Quế Thanh Cạo Vỏ Loại 1 (Túi 200g)', price: '75,000', oldPrice: '90,000', discount: 17, image: nguyenlieu5 }
]

const koreanSauces = [
  { id: 1, name: 'Sốt Chấm Thịt Nướng Hàn Quốc Ssamjang 200g', price: '45,000', oldPrice: '55,000', discount: 18, image: poster1 },
  { id: 2, name: 'Sốt Ướp Bulgogi Lê Táo Thượng Hạng', price: '65,000', oldPrice: '75,000', discount: 13, image: poster2 },
  { id: 3, name: 'Sốt Muối Ớt Xanh Chấm Hải Sản (Chai 250ml)', price: '55,000', oldPrice: '65,000', discount: 15, image: poster3 },
  { id: 4, name: 'Sốt Tương Đen Jajangmyeon Chuẩn Vị', price: '50,000', oldPrice: '60,000', discount: 16, image: poster4 }
]

const cookingList = [
  { id: 1, title: "CÁCH NẤU PHỞ CHAY VIPEP NGON BẤT BẠI", img: poster5 },
  { id: 2, title: "CÁCH NẤU PHỞ GÀ VIPEP NGON BẤT BẠI", img: poster6 },
  { id: 3, title: "CÁCH NẤU PHỞ BÒ VIPEP NGON BẤT BẠI", img: poster7 },
  { id: 4, title: "BỘT NGHỆ VÀ TINH BỘT NGHỆ KHÁC GÌ NHAU? CÔNG DỤNG LÀ GÌ?", img: poster8 },
]

const newsList = [
  {
    id: 1, day: '05', year: '05/2025', img: poster9,
    title: 'Gian hàng VIPEP tại FOODEX 2025 - Trong không khí hân hoan của ngày khai mạc...',
    desc: 'Trong không khí hân hoan của ngày khai mạc, Vipep đã vinh hạnh đón tiếp nhiều...'
  },
  {
    id: 2, day: '05', year: '05/2025', img: poster10,
    title: 'HÂN HOAN TIẾP ĐÓN ĐOÀN TƯ VẤN THỰC CHIẾN DOANH NGHIỆP SẢN XUẤT',
    desc: 'HÂN HOAN TIẾP ĐÓN ĐOÀN TƯ VẤN THỰC CHIẾN DOANH NGHIỆP SẢN XUẤT Sáng ngày 25/0...'
  },
  {
    id: 3, day: '05', year: '05/2025', img: poster11,
    title: 'VIPEP đã chính thức có mặt tại Toronto, Canada – xứ sở lá phong mang theo tinh hoa...',
    desc: 'VIPEP đã chính thức có mặt tại Toronto, Canada – xứ sở lá phong mang theo tin...'
  },
]

</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');

/* ================= BIẾN MÀU CHÍNH ================= */
.text-main-brown { color: #4d3105 !important; }
.text-vipep-green { color: #7eb33d !important; }
.bg-brown-light { background-color: #f8f1e7; }
.btn-main-brown { background-color: #4d3105 !important; border: none; color: white; }
.btn-main-brown:hover { background-color: #7eb33d !important; transform: translateY(-2px); }

/* ================= FORCE FONT QUICKSAND TOÀN BỘ - FIX FONT SAI Ở HEADER & MENU ================= */
.main-logo { max-height: 55px; }
.cart-btn { background-color: #4d3105; padding: 8px 15px; border-radius: 10px; transition: 0.3s; }
.cart-btn:hover { background-color: #7eb33d; }
.main-menu { background-color: #4d3105; }
.nav-link { color: #fff !important; font-size: 13px !important; font-weight: 700; padding: 14px 18px !important; }
.nav-link:hover, .nav-link.active { color: #7eb33d !important; }


/* Đặc biệt force weight bold cho menu (giống screenshot & contact) */
.nav-link {
  font-weight: 700 !important;
  text-transform: uppercase !important; /* Đảm bảo uppercase giống screenshot */
}

/* Card chính */
.vipep-cat-card {
  border-radius: 12px;
  background: linear-gradient(135deg, #3d2b26 0%, #1a110f 100%);
  border: none;
  transition: all 0.3s ease;
  min-height: 130px;
  display: flex; /* Đảm bảo layout cân đối */
  align-items: center;
  justify-content: space-between;
}

.vipep-cat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.5) !important;
}

/* Typography - Tiêu đề lớn (Gia Vị, Muối...) */
.vipep-cat-card h5 {
  font-size: 1.1rem;
  letter-spacing: 0.5px;
  color: #ffffff; /* Trắng hoàn toàn */
  font-weight: 700;
  margin-bottom: 8px;
}

/* Typography - CÁC TIÊU ĐỀ CON (Chỉnh trắng lên ở đây) */
.vipep-cat-card ul li {
  font-size: 0.85rem;
  margin-bottom: 4px;
  color: #ffffff; /* CHỈNH TRẮNG LÊN TẠI ĐÂY */
  opacity: 0.85;   /* Hơi mờ một chút để tạo chiều sâu so với h5 */
  transition: all 0.3s ease;
  list-style: none; /* Bỏ dấu chấm mặc định nếu cần */
}

/* HIỆU ỨNG KHI RÊ CHUỘT VÀO: Chữ nhỏ sáng rực lên */
.vipep-cat-card:hover ul li {
  opacity: 1; /* Sáng trắng rõ rệt */
  color: #ffffff;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5); /* Tạo hiệu ứng phát sáng nhẹ */
}

/* Xử lý hình ảnh */
.cat-img-wrapper {
  width: 85px;
  height: 85px;
  flex-shrink: 0;
  margin-left: 10px;
}

.cat-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 2px solid #b2d652; /* Màu xanh cốm sáng */
  box-shadow: 0 0 10px rgba(178, 214, 82, 0.4);
  transition: transform 0.5s ease;
}

/* Hiệu ứng ảnh xoay nhẹ khi hover cho sinh động */
.vipep-cat-card:hover .cat-img-wrapper img {
  transform: scale(1.05) rotate(5deg);
}
/* ================= CƠ BẢN ================= */
.home-page {
  color: #333;
  background-color: #f8f9fa;
}

.section-divider { border-bottom: 1px dashed #e0e0e0; padding-bottom: 3rem; }
.section-title { color: #7eb33d; font-weight: 700; border-left: 5px solid #ffc107; padding-left: 15px; }
.border-bottom-green { border-bottom: 2px solid #7eb33d; }
.banner-img { height: 500px; object-fit: cover; }
.object-fit-cover { object-fit: cover; }
.hover-zoom { transition: transform 0.3s ease; }
.hover-zoom:hover { transform: scale(1.05); }

/* ================= DANH MỤC & CARD ================= */
.category-card {
  background: linear-gradient(135deg, #1e5631 0%, #198754 100%);
  color: white;
  transition: 0.3s;
  cursor: pointer;
}
.category-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.15) !important; }
.bg-overlay { position: absolute; top: 0; right: 0; width: 100px; height: 100%; background: rgba(255,255,255,0.1); transform: skewX(-20deg); }

.badge-sale {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #dc3545;
  color: #fff;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.8rem;
  z-index: 2;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}
.animate-flicker { animation: flicker 1.5s infinite alternate; }
@keyframes flicker { 0% { opacity: 1; } 100% { opacity: 0.5; } }

.product-item-card {
  transition: 0.3s;
  border-color: #e9ecef !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}
.product-item-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.08);
  border-color: #ffc107 !important;
}
.border-gold { border: 1px solid #ffc107 !important; }
.badge-discount {
  position: absolute;
  top: 0;
  left: 0;
  background: #ffc107;
  color: #333;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 4px 12px;
  border-radius: 3px 0 10px 0;
  z-index: 2;
}
.product-name-small { font-size: 0.95rem; font-weight: 600; min-height: 44px; color: #333; line-height: 1.4; }
.add-cart-btn:hover { background-color: #7eb33d; color: white; border-color: #7eb33d; }

.banner-side {
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  min-height: 420px;
  border: 1px solid #dee2e6;
}
.banner-overlay { background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%); }
.text-shadow { text-shadow: 1px 1px 3px rgba(0,0,0,0.5); }

.line-center { position: absolute; top: 50%; left: 0; width: 100%; height: 1px; background: #dee2e6; z-index: 1; }
.btn-more {
  position: relative;
  z-index: 2;
  background-color: #4d3105;
  color: white;
  border: none;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}
.btn-more:hover { background-color: #7eb33d; }
.hover-underline:hover { text-decoration: underline !important; color: #7eb33d !important; }
.divider-small { width: 60px; height: 3px; border-radius: 2px; }
.korean-title {
  border: 2px solid #4d3105;
  color: #4d3105;
  background-color: white;
  border-radius: 50px;
}

/* ================= HEADER - GIỐNG HỆT ABOUT & CONTACT (KHÔNG BORDER, FONT FORCE) ================= */
.header-wrapper { z-index: 1030; }
.main-logo { max-height: 55px; }
.cart-btn {
  background-color: #4d3105;
  padding: 8px 15px;
  border-radius: 10px;
  transition: 0.3s;
}
.cart-btn:hover { background-color: #7eb33d; }
.main-menu { background-color: #4d3105; }
.nav-link {
  color: #fff !important;
  font-size: 13px !important;
  font-weight: 700 !important;
  padding: 14px 18px !important;
  border-right: none !important; /* Không border giữa các item - giống screenshot & contact */
}
.nav-link:hover,
.nav-link.active { color: #7eb33d !important; }

/* Dropdown giống contact */
.custom-dropdown .dropdown-menu {
  border: none;
  border-radius: 0;
  margin-top: 0;
  padding: 10px 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.dropdown-item {
  font-size: 13px;
  font-weight: 600;
  padding: 8px 20px;
  color: #333;
}
.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #7eb33d;
}

/* Animation rung hotline */
@keyframes shake {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(10deg); }
  75% { transform: rotate(-10deg); }
  100% { transform: rotate(0deg); }
}
.shake-animation { animation: shake 1.5s infinite ease-in-out; }

.hover-green:hover { color: #7eb33d !important; }

/* Căn chỉnh menu hoàn hảo */
.nav.me-auto {
  margin-right: auto !important;
}

/* ================= SÓNG & FOOTER ================= */
.wave-separator {
  width: 100%;
  height: 120px;
  background: #f8f9fa;
  position: relative;
  overflow: hidden;
}
.wave-svg {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 120px;
}

.footer-custom { background: #212529; }
.footer-heading { font-weight: 700; font-size: 1.1rem; }
.hover-white:hover { color: #fff !important; text-decoration: underline !important; }
.pointer { cursor: pointer; transition: transform 0.3s ease; }
.pointer:hover { transform: scale(1.1); }

/* ================= RESPONSIVE ================= */
@media (max-width: 991px) {
  .nav {
    overflow-x: auto;
    white-space: nowrap;
    flex-wrap: nowrap;
  }
  .nav-link {
    border-right: none !important;
  }
}

@media (max-width: 768px) {
  .wave-separator { height: 80px; }
  .wave-svg { height: 80px; }
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
/* Hiển thị menu con khi di chuột vào menu cha */
.dropdown-menu li:hover > .dropdown-menu {
  display: block;
  top: 0;
  left: 100%; /* Đẩy menu con sang bên phải */
  margin-top: -1px;
}
/* --- CSS CHO MENU DỌC (SIDEBAR) --- */

/* Định dạng khung Sidebar */
.offcanvas {
  width: 300px !important; /* Độ rộng menu */
  border-right: 3px solid #7eb33d; /* Viền xanh bên phải cho đẹp */
}

/* Định dạng link cấp 1 (Trang chủ, Về chúng tôi...) */
.v-nav-link {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  color: #333 !important;
  text-decoration: none;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 14px;
  border-left: 4px solid transparent;
  transition: all 0.3s ease;
}

/* Hiệu ứng khi di chuột hoặc đang active */
.v-nav-link:hover,
.v-nav-link.router-link-active {
  background-color: #f4f9ed; /* Màu nền xanh rất nhạt */
  color: #7eb33d !important;
  border-left-color: #7eb33d; /* Viền trái màu xanh */
  padding-left: 25px; /* Đẩy chữ sang phải một chút */
}

/* Định dạng nút Accordion (Sản phẩm, Catalogue) khi chưa mở */
.accordion-button {
  font-size: 14px;
  padding: 16px 20px;
}
/* Khi mở accordion */
.accordion-button:not(.collapsed) {
  background-color: #f4f9ed;
  color: #7eb33d !important;
  box-shadow: none;
}
.accordion-button:focus {
  box-shadow: none;
}

/* Định dạng link con (Cấp 2: Gia vị, Muối...) */
.v-sub-link {
  display: block;
  padding: 12px 20px 12px 50px; /* Thụt đầu dòng sâu hơn */
  color: #555;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  border-bottom: 1px dashed #eee;
  transition: all 0.2s;
}

.v-sub-link:hover {
  color: #7eb33d;
  background-color: white;
  padding-left: 55px; /* Hiệu ứng trượt nhẹ */
}

/* Nút 3 gạch */
.main-menu button {
  transition: opacity 0.3s;
}
.main-menu button:hover {
  opacity: 0.8;
}
</style>