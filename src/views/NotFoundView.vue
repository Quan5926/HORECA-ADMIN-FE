<template>
  <div class="not-found-container d-flex align-items-center justify-content-center">
    <div class="text-center p-5 shadow-lg rounded-5 bg-white border-0 animate-pop-in">
      <h1 class="display-1 fw-bold text-gradient-brown">404</h1>
      <div class="mb-4">
        <i class="bi bi-exclamation-triangle-fill text-warning fs-1"></i>
      </div>
      <h3 class="fw-bold text-dark mb-3">Ối! Trang không tồn tại</h3>
      <p class="text-muted mb-4">
        Có vẻ như đường dẫn bạn đang truy cập không tồn tại hoặc đã bị di dời.
      </p>
      <router-link to="/orders" class="btn btn-vipep-green text-white px-5 py-3 rounded-pill fw-bold shadow-soft">
        <i class="bi bi-house-door me-2"></i>Quay về trang chủ
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  min-height: 100vh;
  background-color: #f4f7f6;
}

.text-gradient-brown {
  background: linear-gradient(135deg, #4d3105, #7eb33d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 120px;
}

.btn-vipep-green {
  background-color: #7eb33d !important;
  border: none;
  transition: 0.3s;
}

.btn-vipep-green:hover {
  background-color: #6a9a32 !important;
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(126, 179, 61, 0.3) !important;
}

.animate-pop-in {
  animation: popIn 0.5s ease-out;
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>