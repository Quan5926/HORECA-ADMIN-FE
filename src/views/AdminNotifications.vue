<template>
  <div class="font-general p-3 p-md-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold mb-0">Thông Báo Hệ Thống</h4>
      <button class="btn btn-sm btn-outline-secondary rounded-pill shadow-none">Đánh dấu đã đọc tất cả</button>
    </div>
    
    <div class="bg-white rounded-4 shadow-sm p-2">
      <div class="list-group list-group-flush">
        <div class="list-group-item list-group-item-action p-3 border-0 rounded-3 mb-1 bg-light">
          <div class="d-flex gap-3">
            <div class="text-warning fs-3"><i class="bi bi-box-seam-fill"></i></div>
            <div>
              <div class="d-flex justify-content-between align-items-center mb-1">
                <h6 class="mb-0 fw-bold">Cảnh báo tồn kho</h6>
                <small class="text-muted">10 phút trước</small>
              </div>
              <p class="mb-0 text-muted small">Sản phẩm <strong>Nước mắm cá cơm than</strong> đã sắp hết hàng (Chỉ còn 15 sản phẩm).</p>
            </div>
          </div>
        </div>
        
        <div class="list-group-item list-group-item-action p-3 border-0 rounded-3 mb-1">
          <div class="d-flex gap-3">
            <div class="text-success fs-3"><i class="bi bi-cart-check-fill"></i></div>
            <div>
              <div class="d-flex justify-content-between align-items-center mb-1">
                <h6 class="mb-0 fw-medium">Đơn hàng mới #DH0982</h6>
                <small class="text-muted">2 giờ trước</small>
              </div>
              <p class="mb-0 text-muted small">Khách hàng Nguyễn Văn A vừa đặt một đơn hàng trị giá 2,500,000đ.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-general { font-family: 'Quicksand', sans-serif !important; }
</style>