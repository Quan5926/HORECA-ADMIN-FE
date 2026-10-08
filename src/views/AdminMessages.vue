<template>
  <div class="font-general p-3 p-md-4">
    <h4 class="fw-bold mb-4">Hộp Thư Góp Ý</h4>
    
    <div class="bg-white rounded-4 shadow-sm">
      <div class="row g-0">
        <div class="col-md-4 border-end">
          <div class="p-3 border-bottom">
            <input type="text" class="form-control bg-light border-0 shadow-none rounded-pill" placeholder="Tìm kiếm thư...">
          </div>
          <div class="list-group list-group-flush" style="max-height: 500px; overflow-y: auto;">
            <button class="list-group-item list-group-item-action p-3 active border-0" style="background-color: rgba(91, 142, 29, 0.1); color: #4A3018;">
              <div class="d-flex justify-content-between mb-1">
                <h6 class="mb-0 fw-bold">Trần Thị B</h6>
                <small>09:30</small>
              </div>
              <p class="mb-0 small text-truncate">Cho mình hỏi về chính sách chiết khấu đại lý...</p>
            </button>
            <button class="list-group-item list-group-item-action p-3 border-0">
              <div class="d-flex justify-content-between mb-1">
                <h6 class="mb-0 fw-medium">Lê Văn C</h6>
                <small class="text-muted">Hôm qua</small>
              </div>
              <p class="mb-0 small text-muted text-truncate">Sản phẩm trà xanh đợt này bao bì hơi khác...</p>
            </button>
          </div>
        </div>
        
        <div class="col-md-8 p-4 d-flex flex-column" style="min-height: 500px;">
          <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
            <div>
              <h5 class="fw-bold mb-1">Hỏi về chính sách đại lý</h5>
              <p class="mb-0 small text-muted">Từ: <strong>Trần Thị B</strong> (tranthib@email.com)</p>
            </div>
            <button class="btn btn-sm btn-outline-danger shadow-none"><i class="bi bi-trash"></i> Xóa</button>
          </div>
          
          <div class="flex-grow-1 mb-4">
            <p>Chào admin,</p>
            <p>Mình muốn hỏi về mức chiết khấu nếu mình nhập hàng số lượng lớn (trên 50tr/đơn) thì hệ thống có chính sách hỗ trợ vận chuyển và công nợ như thế nào ạ?</p>
            <p>Cảm ơn bạn.</p>
          </div>
          
          <div class="mt-auto">
            <textarea class="form-control bg-light border-0 shadow-none mb-2 rounded-3" rows="3" placeholder="Nhập nội dung trả lời..."></textarea>
            <button class="btn text-white px-4 rounded-pill shadow-none" style="background-color: #5b8e1d;"><i class="bi bi-send me-2"></i>Gửi phản hồi</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-general { font-family: 'Quicksand', sans-serif !important; }
</style>