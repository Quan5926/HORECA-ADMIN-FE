<template>
  <div class="lector-reports font-general p-3 p-md-4" style="min-height: 100vh;">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
      <div>
        <h4 class="fw-bold mb-1">Báo Cáo & Thống Kê</h4>
        <p class="text-muted small mb-0">Phân tích dữ liệu kinh doanh và xu hướng</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-secondary rounded-pill px-3 shadow-none bg-white"><i class="bi bi-calendar3 me-2"></i>Tháng này</button>
        <button class="btn btn-dark rounded-pill px-4 shadow-none"><i class="bi bi-download me-2"></i>Xuất BC</button>
      </div>
    </div>

    <div class="row g-3 mb-4">
      <div v-for="(metric, i) in metrics" :key="i" class="col-6 col-xl-3">
        <div class="bg-white rounded-4 p-4 shadow-sm h-100">
          <div class="d-flex justify-content-between mb-3">
            <span class="text-muted fw-medium">{{ metric.title }}</span>
            <div class="icon-box text-white rounded-circle d-flex align-items-center justify-content-center" :class="metric.bg" style="width: 35px; height: 35px;">
              <i class="bi" :class="metric.icon"></i>
            </div>
          </div>
          <h3 class="fw-bold mb-2">{{ metric.value }}</h3>
          <div class="small fw-medium" :class="metric.trend > 0 ? 'text-success' : 'text-danger'">
            <i class="bi" :class="metric.trend > 0 ? 'bi-arrow-up-right' : 'bi-arrow-down-right'"></i>
            {{ Math.abs(metric.trend) }}% <span class="text-muted fw-normal ms-1">so với tháng trước</span>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-3">
      <div class="col-lg-7">
        <div class="bg-white rounded-4 shadow-sm p-4 h-100">
          <h6 class="fw-bold mb-4">Top Sản Phẩm Bán Chạy</h6>
          <div class="d-flex flex-column gap-3">
            <div v-for="(item, index) in topProducts" :key="index">
              <div class="d-flex justify-content-between small mb-1">
                <span class="fw-medium text-dark">{{ item.name }}</span>
                <span class="fw-bold">{{ item.sales }} Lượt bán</span>
              </div>
              <div class="progress" style="height: 8px;">
                <div class="progress-bar rounded-pill" :class="item.color" role="progressbar" :style="{ width: item.percent + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-5">
        <div class="bg-white rounded-4 shadow-sm p-4 h-100 d-flex flex-column">
          <h6 class="fw-bold mb-4">Doanh thu theo khu vực</h6>
          <div class="flex-grow-1 d-flex flex-column justify-content-center gap-4">
            <div class="d-flex align-items-center gap-3">
              <div class="bg-primary rounded-circle" style="width: 12px; height: 12px;"></div>
              <div class="flex-grow-1"><span class="fw-medium">Hà Nội</span></div>
              <div class="fw-bold">45%</div>
            </div>
            <div class="d-flex align-items-center gap-3">
              <div class="bg-success rounded-circle" style="width: 12px; height: 12px;"></div>
              <div class="flex-grow-1"><span class="fw-medium">TP. Hồ Chí Minh</span></div>
              <div class="fw-bold">35%</div>
            </div>
            <div class="d-flex align-items-center gap-3">
              <div class="bg-warning rounded-circle" style="width: 12px; height: 12px;"></div>
              <div class="flex-grow-1"><span class="fw-medium">Đà Nẵng & Khác</span></div>
              <div class="fw-bold">20%</div>
            </div>
            <div class="progress mt-2 rounded-pill" style="height: 12px;">
              <div class="progress-bar bg-primary" style="width: 45%"></div>
              <div class="progress-bar bg-success" style="width: 35%"></div>
              <div class="progress-bar bg-warning" style="width: 20%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const metrics = [
  { title: 'Tổng Doanh Thu', value: '145.5Tr', trend: 12.5, icon: 'bi-currency-dollar', bg: 'bg-primary' },
  { title: 'Đơn Hàng Mới', value: '452', trend: 8.2, icon: 'bi-bag-check', bg: 'bg-success' },
  { title: 'Khách Hàng Mới', value: '86', trend: -2.4, icon: 'bi-people', bg: 'bg-warning' },
  { title: 'Tỉ Lệ Chuyển Đổi', value: '3.8%', trend: 1.2, icon: 'bi-graph-up-arrow', bg: 'bg-info' }
];

const topProducts = [
  { name: 'Cà phê hạt rang Arabica', sales: 450, percent: 90, color: 'bg-primary' },
  { name: 'Sữa tươi thanh trùng 1L', sales: 380, percent: 75, color: 'bg-success' },
  { name: 'Trà xanh Thái Nguyên', sales: 290, percent: 60, color: 'bg-info' },
  { name: 'Nước mắm cá cơm than', sales: 210, percent: 45, color: 'bg-warning' },
  { name: 'Đường phèn tinh luyện', sales: 150, percent: 30, color: 'bg-secondary' }
];
</script>

<style scoped>
.font-general { font-family: 'Quicksand', sans-serif !important; }
.progress { background-color: #f1f5f9; }
</style>