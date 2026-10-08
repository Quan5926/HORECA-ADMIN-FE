<template>
  <div class="lector-dashboard-content font-general bg-light-gray p-3 p-md-4">
    
    <div class="row g-4 mb-4">
      <div class="col-xl-8 col-lg-12">
        <div class="bg-white rounded-4 shadow-sm p-4 h-100 d-flex flex-column">
          <div class="row flex-grow-1">
            <div class="col-md-3 d-flex flex-column justify-content-between">
              <div>
                <h5 class="fw-bold mb-0">Tổng Quan</h5>
                <p class="text-muted small">Thống kê tháng gần nhất</p>
                <h2 class="fw-bold mt-4 mb-0 text-success">124,500K</h2>
                <p class="text-muted small">Doanh thu tháng này</p>
                <h3 class="fw-bold mt-3 mb-0">2,840</h3>
                <p class="text-muted small">Đơn hàng tháng này</p>
              </div>
              <button class="btn bg-pink text-white rounded-pill px-4 py-2 w-100 mt-4 fw-medium shadow-sm hover-lift">
                Xuất Báo Cáo
              </button>
            </div>
            <div class="col-md-9 position-relative">
              <div class="d-flex justify-content-center gap-4 mb-3 text-muted small fw-medium text-uppercase tracking-widest">
                <span class="cursor-pointer hover-text-dark">Hàng ngày</span>
                <span class="cursor-pointer hover-text-dark">Hàng tuần</span>
                <span class="text-dark border-bottom border-dark border-2 pb-1">Hàng tháng</span>
                <span class="cursor-pointer hover-text-dark">Hàng năm</span>
              </div>
              <div class="d-flex justify-content-end gap-3 small mb-2">
                <span><i class="bi bi-circle-fill text-purple me-1" style="font-size: 8px;"></i> Doanh thu</span>
                <span><i class="bi bi-circle-fill text-pink me-1" style="font-size: 8px;"></i> Chi phí Ads</span>
              </div>
              <div style="height: 220px; width: 100%;">
                <canvas id="overviewChart"></canvas>
              </div>
            </div>
          </div>
          
          <hr class="my-4 text-muted opacity-25">
          
          <div class="row g-3 text-center">
            <div class="col-md-3 col-6 d-flex align-items-center justify-content-center">
              <div class="icon-box bg-pink-subtle text-pink rounded-circle me-3"><i class="bi bi-wallet2"></i></div>
              <div class="text-start">
                <p class="text-muted small mb-0">Số Dư Ví</p>
                <h6 class="fw-bold mb-0">12,500,000₫</h6>
              </div>
            </div>
            <div class="col-md-3 col-6 d-flex align-items-center justify-content-center">
              <div class="icon-box bg-purple-subtle text-purple rounded-circle me-3"><i class="bi bi-heart-fill"></i></div>
              <div class="text-start">
                <p class="text-muted small mb-0">Khách Hàng Cũ</p>
                <h6 class="fw-bold mb-0">42%</h6>
              </div>
            </div>
            <div class="col-md-3 col-6 d-flex align-items-center justify-content-center">
              <div class="icon-box bg-blue-subtle text-blue rounded-circle me-3"><i class="bi bi-bag-check-fill"></i></div>
              <div class="text-start">
                <p class="text-muted small mb-0">Ước Tính Bán</p>
                <h6 class="fw-bold mb-0">168,000,000₫</h6>
              </div>
            </div>
            <div class="col-md-3 col-6 d-flex align-items-center justify-content-center">
              <div class="icon-box bg-orange-subtle text-orange rounded-circle me-3"><i class="bi bi-graph-up-arrow"></i></div>
              <div class="text-start">
                <p class="text-muted small mb-0">Lợi Nhuận Ròng</p>
                <h6 class="fw-bold mb-0">52,150,000₫</h6>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-4 col-lg-12">
        <div class="bg-white rounded-4 shadow-sm p-4 h-100 d-flex flex-column">
          <h6 class="fw-bold mb-4">Lưu Lượng Truy Cập</h6>
          <div class="flex-grow-1 d-flex justify-content-center align-items-center position-relative" style="min-height: 200px;">
            <canvas id="trafficChart"></canvas>
            <div class="position-absolute text-center" style="top: 50%; left: 50%; transform: translate(-50%, -50%);">
              <h5 class="fw-bold mb-0">452K</h5>
              <span class="text-muted small" style="font-size: 10px;">Lượt xem</span>
            </div>
          </div>
          <div class="d-flex justify-content-between mt-4">
            <div class="text-center">
              <h4 class="fw-bold mb-1">45%</h4>
              <p class="text-muted small mb-0"><i class="bi bi-circle-fill text-primary me-1" style="font-size: 8px;"></i> Facebook</p>
            </div>
            <div class="text-center">
              <h4 class="fw-bold mb-1">35%</h4>
              <p class="text-muted small mb-0"><i class="bi bi-circle-fill text-dark me-1" style="font-size: 8px;"></i> Tiktok</p>
            </div>
            <div class="text-center">
              <h4 class="fw-bold mb-1">20%</h4>
              <p class="text-muted small mb-0"><i class="bi bi-circle-fill text-danger me-1" style="font-size: 8px;"></i> Google</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-lg-3 col-md-6" v-for="(card, index) in statCards" :key="index">
        <div class="rounded-4 p-4 text-white shadow-sm position-relative overflow-hidden h-100 d-flex flex-column justify-content-between hover-lift-card" :class="card.bgClass">
          <p class="mb-1 opacity-75 fw-medium">{{ card.title }}</p>
          <h3 class="fw-bold mb-3">{{ card.value }}</h3>
          
          <div class="d-flex justify-content-between align-items-end mt-auto">
            <div style="height: 40px; width: 60px;">
                <div class="sparkline-placeholder" :class="'spark-' + index"></div>
            </div>
            <span v-if="card.date" class="small opacity-75">{{ card.date }}</span>
            <select v-if="card.select" class="form-select form-select-sm w-auto bg-white bg-opacity-25 text-white border-0 shadow-none outline-none fw-medium">
              <option class="text-dark">Tháng này</option>
              <option class="text-dark">Tuần này</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-lg-4">
        <div class="bg-white p-4 rounded-4 shadow-sm h-100">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h6 class="fw-bold mb-0">Top Hàng Bán Chạy</h6>
            <a href="#" class="text-pink small text-decoration-none fw-medium">Xem tất cả</a>
          </div>
          <div class="d-flex flex-column gap-3">
            <div v-for="(product, index) in topProducts" :key="index" class="d-flex align-items-center p-2 rounded-3 hover-bg-light transition-all">
              <div class="bg-light rounded-3 d-flex align-items-center justify-content-center me-3" style="width: 50px; height: 50px;">
                <span class="fs-4 fw-bold" :class="index === 0 ? 'text-warning' : (index === 1 ? 'text-secondary' : 'text-orange')">#{{ index + 1 }}</span>
              </div>
              <div class="flex-grow-1">
                <h6 class="fw-bold mb-1 text-truncate" style="max-width: 150px;">{{ product.name }}</h6>
                <p class="text-muted small mb-0">Đã bán: <span class="fw-bold text-dark">{{ product.sold }}</span></p>
              </div>
              <div class="text-end">
                <span class="badge bg-success-subtle text-success rounded-pill">{{ product.revenue }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="bg-white p-4 rounded-4 shadow-sm h-100">
          <h6 class="fw-bold mb-4">Hiệu Quả Chuyển Đổi (Ads)</h6>
          <div class="d-flex flex-column gap-4">
            <div v-for="(ad, index) in adStats" :key="index">
              <div class="d-flex justify-content-between mb-1">
                <span class="fw-bold text-dark d-flex align-items-center gap-2">
                  <i class="bi fs-5" :class="ad.icon + ' ' + ad.textColor"></i> {{ ad.platform }}
                </span>
                <span class="fw-bold">{{ ad.views }} <span class="text-muted small fw-normal">lượt xem</span></span>
              </div>
              <div class="progress" style="height: 8px;">
                <div class="progress-bar rounded-pill" :class="ad.bgClass" role="progressbar" :style="{ width: ad.percent + '%' }"></div>
              </div>
              <div class="d-flex justify-content-between mt-1 text-muted small">
                <span>Chuyển đổi: <strong class="text-dark">{{ ad.conversion }}</strong></span>
                <span>Chi phí: <strong class="text-dark">{{ ad.cost }}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="bg-white p-4 rounded-4 shadow-sm h-100">
          <h6 class="fw-bold mb-4">Hoạt Động Gần Đây</h6>
          <div class="timeline position-relative ms-2">
            <div v-for="(activity, index) in activities" :key="index" class="timeline-item d-flex position-relative mb-4">
              <div class="me-3 text-muted small text-end" style="min-width: 65px;">{{ activity.time }}</div>
              <div class="timeline-icon rounded-circle d-flex justify-content-center align-items-center z-1 text-white shadow-sm" :class="activity.colorClass" style="width: 32px; height: 32px;">
                <i class="bi" :class="activity.icon"></i>
              </div>
              <div class="ps-3 border-start position-absolute h-100 z-0" style="left: 96px; top: 16px; border-color: #f0f0f0 !important;" v-if="index !== activities.length - 1"></div>
              <div class="ps-3">
                <h6 class="fw-bold mb-1 fs-6">{{ activity.title }}</h6>
                <p class="text-muted small mb-0">{{ activity.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-12">
        <div class="bg-white p-4 rounded-4 shadow-sm h-100 d-flex flex-column">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h6 class="fw-bold mb-0">Trạng Thái Đơn Hàng</h6>
              <p class="text-muted small mb-0">Danh sách đơn hàng mới nhất từ các nguồn</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-sm bg-pink text-white rounded-circle hover-lift"><i class="bi bi-plus"></i></button>
              <button class="btn btn-sm btn-light rounded-circle"><i class="bi bi-arrow-clockwise"></i></button>
              <button class="btn btn-sm btn-light rounded-circle"><i class="bi bi-printer"></i></button>
            </div>
          </div>
          
          <div class="table-responsive flex-grow-1">
            <table class="table align-middle text-nowrap mb-0 table-hover">
              <thead class="bg-dark text-white text-uppercase" style="font-size: 0.75rem; letter-spacing: 1px;">
                <tr>
                  <th class="py-3 px-3 rounded-start border-0">Mã Đơn</th>
                  <th class="py-3 border-0">Khách Hàng</th>
                  <th class="py-3 border-0">Nguồn Traffic</th>
                  <th class="py-3 border-0">Tổng Tiền</th>
                  <th class="py-3 px-3 rounded-end border-0">Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(order, index) in orders" :key="index">
                  <td class="px-3 py-3 text-muted fw-medium">#{{ order.invoice }}</td>
                  <td class="fw-bold text-dark">{{ order.customer }}</td>
                  <td>
                    <span class="badge bg-light text-dark border"><i class="bi me-1" :class="order.sourceIcon + ' ' + order.sourceColor"></i> {{ order.source }}</span>
                  </td>
                  <td class="fw-bold text-success">{{ order.price }}</td>
                  <td class="px-3">
                    <span class="badge rounded-pill fw-medium px-3 py-2 text-white shadow-sm" :class="order.statusColor">
                      {{ order.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-3 pt-3 border-top gap-3">
            <span class="text-muted small">Hiển thị 1 đến 5 trong số 240 mục</span>
            <nav>
              <ul class="pagination pagination-sm mb-0 gap-1">
                <li class="page-item"><a class="page-link border-0 text-muted rounded-circle" href="#">&lsaquo;</a></li>
                <li class="page-item"><a class="page-link border-0 bg-pink text-white shadow-sm rounded-circle" href="#">1</a></li>
                <li class="page-item"><a class="page-link border-0 text-muted rounded-circle" href="#">2</a></li>
                <li class="page-item"><a class="page-link border-0 text-muted rounded-circle" href="#">3</a></li>
                <li class="page-item"><a class="page-link border-0 text-muted rounded-circle" href="#">...</a></li>
                <li class="page-item"><a class="page-link border-0 text-muted rounded-circle" href="#">&rsaquo;</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import Chart from 'chart.js/auto';

// ================= DỮ LIỆU MẪU (MOCK DATA) =================

const statCards = [
  { title: 'Tổng Doanh Thu', value: '124,500,000₫', date: '01 Thg 3 - 13 Thg 3', bgClass: 'bg-gradient-pink' },
  { title: 'Chi Phí Quảng Cáo', value: '32,100,000₫', date: 'Tháng này', bgClass: 'bg-gradient-orange' },
  { title: 'Tỷ Lệ Chuyển Đổi', value: '4.2%', select: true, bgClass: 'bg-gradient-blue' },
  { title: 'ROAS (Lợi Nhuận/Chi Phí)', value: '3.88', date: 'So với tháng trước (+0.5)', bgClass: 'bg-gradient-purple' }
];

const topProducts = [
  { name: 'Sản phẩm Hot Trend 1', sold: 1245, revenue: '45.2M' },
  { name: 'Sản phẩm Hot Trend 2', sold: 980, revenue: '28.5M' },
  { name: 'Sản phẩm Bán Chạy 3', sold: 854, revenue: '19.8M' },
  { name: 'Sản phẩm Bán Chạy 4', sold: 630, revenue: '15.1M' }
];

const adStats = [
  { platform: 'Facebook Ads', views: '203,400', percent: 45, conversion: '3.5%', cost: '14.5M', icon: 'bi-facebook', textColor: 'text-primary', bgClass: 'bg-primary' },
  { platform: 'TikTok Ads', views: '158,200', percent: 35, conversion: '5.2%', cost: '12.0M', icon: 'bi-tiktok', textColor: 'text-dark', bgClass: 'bg-dark' },
  { platform: 'Google Search Ads', views: '90,400', percent: 20, conversion: '4.8%', cost: '5.6M', icon: 'bi-google', textColor: 'text-danger', bgClass: 'bg-danger' }
];

const activities = [
  { time: '15 Phút trước', title: 'Tăng ngân sách', desc: 'Camp Tiktok x2 ngân sách', icon: 'bi-rocket-takeoff', colorClass: 'bg-dark' },
  { time: '2 Giờ trước', title: 'Đơn sỉ mới', desc: 'Khách VIP chốt 50 đơn hàng', icon: 'bi-lightning-fill', colorClass: 'bg-purple' },
  { time: 'Hôm qua', title: 'Xuất bản bài viết', desc: 'Bài viết "Sale Tháng 3" đã lên FB', icon: 'bi-journal-text', colorClass: 'bg-blue' },
  { time: 'Hôm qua', title: 'Dừng Camp kém', desc: 'Tắt 3 nhóm QC Facebook', icon: 'bi-pause-circle', colorClass: 'bg-danger' },
  { time: '2 Ngày trước', title: 'Đăng Video', desc: 'Video unbox đạt 10k views', icon: 'bi-play-circle', colorClass: 'bg-success' }
];

const orders = [
  { invoice: '12386', customer: 'Nhà Hàng Biển Đông', source: 'TikTok Shop', sourceIcon: 'bi-tiktok', sourceColor: 'text-dark', price: '2,450,000₫', status: 'Đang Xử Lý', statusColor: 'bg-pink' },
  { invoice: '12385', customer: 'Trần Minh Quân', source: 'Facebook', sourceIcon: 'bi-facebook', sourceColor: 'text-primary', price: '640,000₫', status: 'Mở', statusColor: 'bg-purple' },
  { invoice: '12384', customer: 'Khách Sạn Rex', source: 'Google', sourceIcon: 'bi-google', sourceColor: 'text-danger', price: '12,500,000₫', status: 'Tạm Giữ', statusColor: 'bg-blue' },
  { invoice: '12383', customer: 'Lê Thị Hà', source: 'Zalo', sourceIcon: 'bi-chat-fill', sourceColor: 'text-info', price: '320,000₫', status: 'Đang Xử Lý', statusColor: 'bg-warning' },
  { invoice: '12382', customer: 'Cửa hàng tiện lợi 24h', source: 'TikTok Shop', sourceIcon: 'bi-tiktok', sourceColor: 'text-dark', price: '4,100,000₫', status: 'Hoàn Thành', statusColor: 'bg-success' }
];

onMounted(() => {
  // Biểu đồ 1: Đường cong doanh thu (Line Chart)
  const ctxOverview = document.getElementById('overviewChart');
  if (ctxOverview) {
    const gradientPurple = ctxOverview.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradientPurple.addColorStop(0, 'rgba(123, 81, 211, 0.4)');
    gradientPurple.addColorStop(1, 'rgba(123, 81, 211, 0)');

    const gradientPink = ctxOverview.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradientPink.addColorStop(0, 'rgba(247, 75, 132, 0.4)');
    gradientPink.addColorStop(1, 'rgba(247, 75, 132, 0)');

    new Chart(ctxOverview, {
      type: 'line',
      data: {
        labels: ['Thg 1', 'Thg 2', 'Thg 3', 'Thg 4', 'Thg 5', 'Thg 6'],
        datasets: [
          {
            label: 'Doanh thu',
            data: [15, 25, 20, 35, 25, 45],
            borderColor: '#7b51d3',
            backgroundColor: gradientPurple,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#7b51d3',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: 'Chi phí Ads',
            data: [5, 12, 8, 15, 10, 12],
            borderColor: '#f74b84',
            backgroundColor: gradientPink,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#f74b84',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, max: 50, grid: { color: '#f0f0f0' }, border: { display: false } },
          x: { grid: { display: false }, border: { display: false } }
        },
        interaction: { mode: 'index', intersect: false }
      }
    });
  }

  // Biểu đồ 2: Doughnut Traffic
  const ctxTraffic = document.getElementById('trafficChart');
  if (ctxTraffic) {
    new Chart(ctxTraffic, {
      type: 'doughnut',
      data: {
        labels: ['Facebook', 'Tiktok', 'Google'],
        datasets: [{
          data: [45, 35, 20],
          backgroundColor: ['#0d6efd', '#212529', '#dc3545'],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: { legend: { display: false }, tooltip: { padding: 10 } }
      }
    });
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700;900&display=swap');

/* ================= THEME VÀ CƠ BẢN ================= */
.font-general { font-family: 'Quicksand', sans-serif !important; }
.bg-light-gray { background-color: #f4f6fa; }
.tracking-widest { letter-spacing: 1px; }
.cursor-pointer { cursor: pointer; }
.hover-text-dark:hover { color: #212529 !important; transition: 0.2s; }
.transition-all { transition: all 0.2s ease; }
.hover-bg-light:hover { background-color: #f8f9fa !important; }

/* Hiệu ứng Hover */
.hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
.hover-lift:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; }
.hover-lift-card { transition: transform 0.3s ease; }
.hover-lift-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; }

/* ================= BẢNG MÀU PASTEL & GRADIENT ================= */
.text-pink { color: #f74b84 !important; }
.bg-pink { background-color: #f74b84 !important; }
.bg-pink-subtle { background-color: #ffe6ef !important; }
.bg-gradient-pink { background: linear-gradient(135deg, #f74b84 0%, #fa729c 100%); }

.text-purple { color: #7b51d3 !important; }
.bg-purple { background-color: #7b51d3 !important; }
.bg-purple-subtle { background-color: #eee8f9 !important; }
.bg-gradient-purple { background: linear-gradient(135deg, #7b51d3 0%, #9b7de0 100%); }

.text-blue { color: #3ab1e1 !important; }
.bg-blue { background-color: #3ab1e1 !important; }
.bg-blue-subtle { background-color: #e3f4fc !important; }
.bg-gradient-blue { background: linear-gradient(135deg, #3ab1e1 0%, #68c7ec 100%); }

.text-orange { color: #fa8b33 !important; }
.bg-orange { background-color: #fa8b33 !important; }
.bg-orange-subtle { background-color: #ffeee0 !important; }
.bg-gradient-orange { background: linear-gradient(135deg, #fa8b33 0%, #fbad64 100%); }

/* ================= COMPONENTS ================= */
.icon-box { width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; }
.progress { background-color: #f0f0f0; box-shadow: inset 0 1px 2px rgba(0,0,0,0.05); }

/* Biểu đồ giả (Faux Sparklines) dùng CSS thuần để nhẹ trang */
.sparkline-placeholder { width: 100%; height: 100%; }
.spark-0 { background: linear-gradient(to top, rgba(255,255,255,0.2) 50%, transparent 50%), linear-gradient(to right, rgba(255,255,255,0.4) 20%, transparent 20%); background-size: 8px 100%, 100% 100%; }
.spark-1 { border-bottom: 2px solid rgba(255,255,255,0.8); position: relative; }
.spark-1::after { content:''; position:absolute; bottom:0; left:0; width:100%; height:80%; background:rgba(255,255,255,0.15); clip-path: polygon(0 100%, 20% 40%, 40% 60%, 80% 10%, 100% 30%, 100% 100%); }
.spark-2 { border-bottom: 2px solid rgba(255,255,255,0.8); position: relative; }
.spark-2::after { content:''; position:absolute; top: 20%; left: 0; width: 100%; height: 2px; background: transparent; box-shadow: 10px 10px 0 rgba(255,255,255,0.8), 20px 5px 0 rgba(255,255,255,0.8), 30px 15px 0 rgba(255,255,255,0.8), 40px 0px 0 rgba(255,255,255,0.8); }
.spark-3 { background: linear-gradient(to top, rgba(255,255,255,0.3) 60%, transparent 60%); background-size: 10px 100%; background-repeat: space; }

/* Phân trang (Pagination) */
.page-link { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: 600; }
.page-link:hover { background-color: #f0f0f0; color: #f74b84 !important; }
</style>