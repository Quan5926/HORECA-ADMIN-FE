<template>
  <div class="font-general p-3 p-md-4">
    <!-- HEADER -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
      <div>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb mb-1 small">
            <li class="breadcrumb-item"><router-link to="/" class="text-muted text-decoration-none">Tổng quan</router-link></li>
            <li class="breadcrumb-item"><router-link to="/products" class="text-muted text-decoration-none">Sản phẩm</router-link></li>
            <li class="breadcrumb-item active fw-bold">{{ isEdit ? 'Cập nhật' : 'Thêm mới' }}</li>
          </ol>
        </nav>
        <h4 class="fw-bold mb-0 text-main-brown">{{ isEdit ? 'Cập Nhật Sản Phẩm' : 'Đăng Sản Phẩm Mới' }}</h4>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-light border shadow-sm px-4 rounded-pill fw-medium" @click="$router.push('/products')">Hủy bỏ</button>
        <button @click="saveProduct" class="btn btn-vipep-green text-white px-4 rounded-pill shadow-sm fw-medium d-flex align-items-center gap-2">
          <i class="bi bi-floppy"></i> Lưu sản phẩm
        </button>
      </div>
    </div>

    <div class="row g-4">
      <!-- CỘT TRÁI -->
      <div class="col-lg-8">

        <!-- THÔNG TIN CƠ BẢN -->
        <div class="card-section mb-4">
          <h6 class="section-title"><i class="bi bi-info-circle me-2"></i>Thông tin cơ bản</h6>
          <div class="mb-3">
            <label class="form-label field-label">Tên sản phẩm <span class="text-danger">*</span></label>
            <input type="text" class="form-control fc" v-model="product.tenSanPham" placeholder="VD: Bát Sứ Long Phương 18cm">
          </div>
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label field-label">Thương hiệu</label>
              <input type="text" class="form-control fc" v-model="product.thuongHieu" placeholder="VD: Long Phương">
            </div>
            <div class="col-md-6">
              <label class="form-label field-label">Xuất xứ</label>
              <input type="text" class="form-control fc" v-model="product.xuatXu" placeholder="VD: Việt Nam">
            </div>
            <div class="col-md-6">
              <label class="form-label field-label">Chất liệu</label>
              <input type="text" class="form-control fc" v-model="product.chatLieu" placeholder="VD: Sứ cao cấp">
            </div>
            <div class="col-md-6">
              <label class="form-label field-label">Chất lượng</label>
              <input type="text" class="form-control fc" v-model="product.chatLuong" placeholder="VD: Chuẩn xuất khẩu EU">
            </div>
            <div class="col-md-6">
              <label class="form-label field-label">Kiểu dáng</label>
              <input type="text" class="form-control fc" v-model="product.kieuDang" placeholder="VD: Tròn, oval...">
            </div>
            <div class="col-md-6">
              <label class="form-label field-label">Phù hợp cho</label>
              <input type="text" class="form-control fc" v-model="product.phuHopCho" placeholder="VD: Nhà hàng, khách sạn 3-5 sao">
            </div>
          </div>
         <div v-if="product.laCombo" class="mt-3">
  <label class="form-label field-label">Trọn bộ sản phẩm bao gồm</label>
  <textarea class="form-control fc" v-model="product.tronBo" rows="2" placeholder="VD: 6 bát + 6 đĩa + hộp quà tặng cao cấp"></textarea>

  <!-- BẢNG SẢN PHẨM COMBO -->
  <div class="mt-3">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <span class="field-label mb-0">Danh sách sản phẩm trong combo</span>
      <button type="button" @click="addComboItem" class="btn btn-sm btn-outline-success rounded-pill px-3">
        <i class="bi bi-plus-lg me-1"></i>Thêm sản phẩm
      </button>
    </div>

    <div v-if="comboItems.length === 0" class="text-center py-3 rounded-2 border border-dashed text-muted small" style="border-style:dashed!important;">
      <i class="bi bi-box-seam fs-4 d-block mb-1 opacity-25"></i>
      Chưa có sản phẩm nào trong combo
    </div>

    <div v-for="(ci, idx) in comboItems" :key="idx" 
  class="combo-item-row d-flex align-items-center gap-2 mb-2 p-2 rounded-2 border bg-white">
  
  <!-- Ảnh nhỏ -->
  <div class="combo-img-box flex-shrink-0" @click="triggerComboImg(idx)">
    <img v-if="ci.previewUrl" :src="ci.previewUrl" class="w-100 h-100 object-fit-cover rounded-2">
    <i v-else class="bi bi-camera text-muted" style="font-size:0.9rem;"></i>
    <input type="file" :ref="el => comboFileInputs[idx] = el" 
      @change="handleComboImg($event, idx)" accept="image/*" class="d-none">
  </div>

  <!-- STT -->
  <span class="text-muted flex-shrink-0" style="font-size:0.78rem;min-width:18px;">{{ idx + 1 }}.</span>

  <!-- Tên -->
  <input type="text" class="form-control fc fc-sm flex-grow-1" 
    v-model="ci.tenSanPham" placeholder="Tên sản phẩm trong combo...">

  <!-- SL -->
  <div class="d-flex align-items-center gap-1 flex-shrink-0">
    <span class="text-muted" style="font-size:0.75rem;">SL:</span>
    <input type="number" class="form-control fc fc-sm text-center" 
      style="width:52px;" v-model="ci.soLuong" min="1">
  </div>

  <!-- Xóa -->
  <button type="button" @click="removeComboItem(idx)" 
    class="btn btn-sm btn-outline-danger rounded-circle flex-shrink-0" 
    style="width:26px;height:26px;padding:0;">
    <i class="bi bi-x" style="font-size:13px;"></i>
  </button>
</div>
  </div>
</div>
          <div class="mt-3">
            <label class="form-label field-label">Mô tả ngắn</label>
            <textarea class="form-control fc" v-model="product.moTaNgan" rows="2" placeholder="Nhập mô tả ngắn hiển thị trên danh sách sản phẩm..."></textarea>
          </div>
          <div class="mt-3">
            <label class="form-label field-label">Mô tả chi tiết</label>
            <textarea class="form-control fc" v-model="product.moTaChiTiet" rows="5" placeholder="Nhập mô tả chi tiết về thành phần, công dụng, hướng dẫn sử dụng..."></textarea>
          </div>
        </div>

        <!-- BIẾN THỂ SẢN PHẨM -->
        <div class="card-section mb-4">
          <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
            <h6 class="section-title mb-0"><i class="bi bi-sliders me-2"></i>Biến thể sản phẩm</h6>
            <button @click="addVariant" class="btn btn-sm btn-outline-success rounded-pill px-3">
              <i class="bi bi-plus-lg me-1"></i>Thêm biến thể
            </button>
          </div>

          <div v-if="variants.length === 0" class="empty-variant-hint text-center py-4">
            <i class="bi bi-grid-3x3-gap fs-1 text-muted opacity-25 d-block mb-2"></i>
            <p class="text-muted small mb-0">Chưa có biến thể nào. Nhấn <strong>Thêm biến thể</strong> để thêm màu sắc, kích thước...</p>
          </div>

          <div v-else>
            <!-- HEADER bảng -->
            <div class="variant-header d-none d-md-grid">
              <span>Ảnh</span>
              <span>Màu sắc</span>
              <span>Kích thước</span>
              <span>Trọng lượng</span>
              <span>Giá nhập</span>
              <span v-if="!product.lienHe">Giá bán <span class="text-danger">*</span></span>
              <span v-else class="text-warning"><i class="bi bi-telephone-fill me-1"></i>Liên hệ</span>
              <span>Tồn kho</span>
              <span>SKU <span class="text-danger">*</span></span>
              <span></span>
            </div>

            <div v-for="(v, idx) in variants" :key="idx" class="variant-row">
              <!-- Ảnh biến thể -->
              <div class="variant-img-cell">
                <div class="variant-img-box" @click="triggerVariantImg(idx)">
                  <img v-if="v.previewUrl" :src="v.previewUrl" class="w-100 h-100 object-fit-cover rounded-2">
                  <i v-else class="bi bi-camera text-muted"></i>
                  <input type="file" :ref="el => variantFileInputs[idx] = el" @change="handleVariantImg($event, idx)" accept="image/*" class="d-none">
                </div>
              </div>

              <!-- Màu sắc -->
              <div class="variant-field">
                <label class="d-md-none field-label-sm">Màu sắc</label>
                <div class="d-flex align-items-center gap-2">
                  <input type="color" class="color-picker" v-model="v.mauSacHex" :title="v.mauSac">
                  <input type="text" class="form-control fc fc-sm" v-model="v.mauSac" placeholder="Trắng, Đỏ...">
                </div>
              </div>

              <!-- Kích thước -->
              <div class="variant-field">
                <label class="d-md-none field-label-sm">Kích thước</label>
                <input type="text" class="form-control fc fc-sm" v-model="v.kichThuoc" placeholder="18cm, L, XL...">
              </div>

              <!-- Trọng lượng -->
              <div class="variant-field">
                <label class="d-md-none field-label-sm">Trọng lượng</label>
                <input type="text" class="form-control fc fc-sm" v-model="v.trongLuong" placeholder="500g">
              </div>

              <!-- Giá nhập -->
              <div class="variant-field">
                <label class="d-md-none field-label-sm">Giá nhập</label>
                <input type="number" class="form-control fc fc-sm" v-model="v.giaNhap" placeholder="0">
              </div>

              <!-- Giá bán / Liên hệ -->
              <div class="variant-field">
                <label class="d-md-none field-label-sm">{{ product.lienHe ? 'Liên hệ' : 'Giá bán' }}</label>
                <div v-if="product.lienHe" class="lien-he-badge-sm">
                  <i class="bi bi-telephone-fill me-1"></i>Liên hệ
                </div>
                <input v-else type="number" class="form-control fc fc-sm" v-model="v.giaBan" placeholder="0">
              </div>

              <!-- Tồn kho -->
              <div class="variant-field">
                <label class="d-md-none field-label-sm">Tồn kho</label>
                <input type="number" class="form-control fc fc-sm" v-model="v.tonKho" placeholder="0">
              </div>

              <!-- SKU -->
              <div class="variant-field">
                <label class="d-md-none field-label-sm">SKU</label>
                <input type="text" class="form-control fc fc-sm" v-model="v.maSku" placeholder="SKU-001">
              </div>

              <!-- Xóa -->
              <div class="variant-del">
                <button @click="removeVariant(idx)" class="btn btn-sm btn-outline-danger rounded-circle" style="width:30px;height:30px;padding:0;">
                  <i class="bi bi-trash3" style="font-size:12px;"></i>
                </button>
              </div>
            </div>

            <!-- THÊM NHANH -->
            <div class="quick-add-wrap mt-3 pt-3 border-top">
              <p class="small text-muted fw-bold mb-2"><i class="bi bi-lightning-charge me-1 text-warning"></i>Thêm nhanh</p>
              <div class="d-flex flex-wrap gap-2">
                <button v-for="color in quickColors" :key="color.label"
                  @click="quickAddVariant('mauSac', color)"
                  class="btn btn-sm rounded-pill quick-btn">
                  <span class="color-dot" :style="{ background: color.hex }"></span>{{ color.label }}
                </button>
                <div class="vr mx-1"></div>
                <button v-for="size in quickSizes" :key="size"
                  @click="quickAddVariant('kichThuoc', { label: size })"
                  class="btn btn-sm rounded-pill quick-btn">
                  {{ size }}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- CỘT PHẢI -->
      <div class="col-lg-4">

        <!-- TRẠNG THÁI -->
        <div class="card-section mb-4">
          <h6 class="section-title"><i class="bi bi-toggle-on me-2"></i>Trạng thái</h6>
          <select v-model="product.trangThai" class="form-select fc">
            <option :value="true">✅ Đang kinh doanh</option>
            <option :value="false">🔴 Ngừng kinh doanh</option>
          </select>
          <div class="mt-2">
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" v-model="product.laCombo" id="isCombo">
              <label class="form-check-label small text-muted" for="isCombo">Đây là sản phẩm <strong>Combo</strong></label>
            </div>
          </div>
        </div>

        <!-- PHÂN LOẠI -->
        <div class="card-section mb-4">
          <h6 class="section-title"><i class="bi bi-tag me-2"></i>Phân loại</h6>
          <label class="form-label field-label">Danh mục <span class="text-danger">*</span></label>
          <select class="form-select fc" v-model="product.danhMucId">
            <option value="">-- Chọn danh mục --</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>

        <!-- GIÁ & LIÊN HỆ -->
        <div class="card-section mb-4">
          <h6 class="section-title"><i class="bi bi-currency-dollar me-2"></i>Giá & Liên hệ</h6>

          <!-- Toggle chế độ giá -->
          <div class="price-mode-toggle mb-3">
            <button
              @click="product.lienHe = false"
              :class="['price-mode-btn', !product.lienHe ? 'price-mode-btn--active' : '']">
              <i class="bi bi-tag-fill me-1"></i>Nhập giá
            </button>
            <button
              @click="product.lienHe = true"
              :class="['price-mode-btn', product.lienHe ? 'price-mode-btn--contact' : '']">
              <i class="bi bi-telephone-fill me-1"></i>Liên hệ
            </button>
          </div>

          <!-- Mô tả trạng thái -->
          <div v-if="product.lienHe" class="lien-he-info-box mb-3">
            <i class="bi bi-info-circle-fill me-2 text-warning"></i>
            <span class="small">Ẩn giá — khách hàng sẽ thấy nút <strong>Liên hệ</strong> thay vì giá tiền.</span>
          </div>

          <!-- ── Chế độ LIÊN HỆ ── -->
          <div v-if="product.lienHe">
            <div class="mb-3">
              <label class="form-label field-label">Số điện thoại <span class="text-danger">*</span></label>
              <div class="input-group">
                <span class="input-group-text ig-green"><i class="bi bi-telephone-fill text-success"></i></span>
                <input type="tel" class="form-control fc" v-model="product.soDienThoai" placeholder="VD: 0901234567">
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label field-label">Số Zalo</label>
              <div class="input-group">
                <span class="input-group-text ig-blue"><i class="bi bi-chat-dots-fill" style="color:#0068ff;"></i></span>
                <input type="text" class="form-control fc" v-model="product.zaloLink" placeholder="Để trống → dùng SĐT">
              </div>
              <small class="text-muted d-block mt-1">
                <i class="bi bi-info-circle me-1"></i>Để trống sẽ tự dùng Số điện thoại cho Zalo.
              </small>
            </div>

            <!-- Preview popup -->
            <div class="preview-label">
              <i class="bi bi-eye me-1"></i>Preview nút khách thấy
            </div>
            <div class="preview-popup">
              <div class="preview-popup__header">
                <div class="preview-popup__icon"><i class="bi bi-headset"></i></div>
                <div>
                  <div class="fw-bold small">Liên hệ tư vấn</div>
                  <div style="font-size:11px; color:#888;">Chọn hình thức liên hệ</div>
                </div>
              </div>
              <a :href="'tel:' + product.soDienThoai" class="preview-btn preview-btn--call">
                <i class="bi bi-telephone-fill"></i>
                <div>
                  <div class="fw-semibold" style="font-size:13px;">Gọi điện ngay</div>
                  <div style="font-size:11px; opacity:.8;">{{ product.soDienThoai || '0901234567' }}</div>
                </div>
                <i class="bi bi-chevron-right ms-auto"></i>
              </a>
              <a :href="'https://zalo.me/' + (product.zaloLink || product.soDienThoai || '0901234567')"
                target="_blank" class="preview-btn preview-btn--zalo">
                <i class="bi bi-chat-dots-fill"></i>
                <div>
                  <div class="fw-semibold" style="font-size:13px;">Chat qua Zalo</div>
                  <div style="font-size:11px; opacity:.8;">Phản hồi trong vài phút</div>
                </div>
                <i class="bi bi-chevron-right ms-auto"></i>
              </a>
            </div>

            <!-- SKU & Tồn kho vẫn giữ khi không có biến thể -->
            <div v-if="variants.length === 0" class="mt-3 pt-3 border-top">
              <div class="row g-2">
                <div class="col-6">
                  <label class="form-label field-label">SKU <span class="text-danger">*</span></label>
                  <input type="text" class="form-control fc" v-model="product.maSku" placeholder="VD: SP-001">
                </div>
                <div class="col-6">
                  <label class="form-label field-label">Trọng lượng</label>
                  <input type="text" class="form-control fc" v-model="product.trongLuong" placeholder="500g">
                </div>
                <div class="col-12 mt-1">
              <label class="form-label field-label">Tồn kho</label>
              <input type="number" class="form-control fc" v-model="product.tonKho" placeholder="0">
              <small class="d-block mt-1 fw-bold"
                :class="product.tonKho <= 0 ? 'text-danger' : product.tonKho <= 10 ? 'text-warning' : 'text-success'">
                <i class="bi bi-circle-fill me-1" style="font-size:8px;"></i>
                {{ product.tonKho <= 0 ? 'Hết hàng' : product.tonKho <= 10 ? 'Sắp hết hàng' : 'Còn hàng' }}
              </small>
            </div>
            <!-- Giá nhập + Màu + Kích thước cho chế độ Liên hệ SP đơn -->
            <div class="col-6 mt-1">
              <label class="form-label field-label">Giá nhập</label>
              <input type="number" class="form-control fc" v-model="product.giaNhap" placeholder="0">
            </div>
            <div class="col-6 mt-1">
              <label class="form-label field-label">Màu sắc</label>
              <div class="d-flex align-items-center gap-2">
                <input type="color" class="color-picker" v-model="product.mauSacHex">
                <input type="text" class="form-control fc" v-model="product.mauSac" placeholder="Trắng...">
              </div>
            </div>
            <div class="col-12 mt-1">
              <label class="form-label field-label">Kích thước</label>
              <input type="text" class="form-control fc" v-model="product.kichThuoc" placeholder="18cm, L...">
            </div>
          </div>
        </div>

          <!-- ── Chế độ NHẬP GIÁ (không có biến thể) ── -->
          </div>

          <!-- ── Chế độ NHẬP GIÁ (không có biến thể) ── -->
          <div v-if="!product.lienHe && variants.length === 0" class="row g-2">
            <div class="col-6">
              <label class="form-label field-label">SKU <span class="text-danger">*</span></label>
              <input type="text" class="form-control fc" v-model="product.maSku" placeholder="VD: SP-001">
            </div>
            <div class="col-6">
              <label class="form-label field-label">Trọng lượng</label>
              <input type="text" class="form-control fc" v-model="product.trongLuong" placeholder="500g">
            </div>
            <div class="col-6 mt-1">
              <label class="form-label field-label">Giá nhập</label>
              <input type="number" class="form-control fc" v-model="product.giaNhap" placeholder="0">
            </div>
            <div class="col-6 mt-1">
              <label class="form-label field-label">Giá bán <span class="text-danger">*</span></label>
              <input type="number" class="form-control fc" v-model="product.giaBan" placeholder="0">
            </div>
            <div class="col-12 mt-1">
              <label class="form-label field-label">Tồn kho</label>
              <input type="number" class="form-control fc" v-model="product.tonKho" placeholder="0">
              <small class="d-block mt-1 fw-bold"
                :class="product.tonKho <= 0 ? 'text-danger' : product.tonKho <= 10 ? 'text-warning' : 'text-success'">
                <i class="bi bi-circle-fill me-1" style="font-size:8px;"></i>
                {{ product.tonKho <= 0 ? 'Hết hàng' : product.tonKho <= 10 ? 'Sắp hết hàng' : 'Còn hàng' }}
              </small>
            </div>
            <!-- Màu + Kích thước cho SP đơn nhập giá -->
            <div class="col-6 mt-1">
              <label class="form-label field-label">Màu sắc</label>
              <div class="d-flex align-items-center gap-2">
                <input type="color" class="color-picker" v-model="product.mauSacHex">
                <input type="text" class="form-control fc" v-model="product.mauSac" placeholder="Trắng...">
              </div>
            </div>
            <div class="col-6 mt-1">
              <label class="form-label field-label">Kích thước</label>
              <input type="text" class="form-control fc" v-model="product.kichThuoc" placeholder="18cm, L...">
            </div>
          </div>

          

          <!-- ── Tổng quan biến thể (khi có biến thể & nhập giá) ── -->
          <div v-if="!product.lienHe && variants.length > 0" class="d-flex flex-column gap-2">
            <div class="stat-row">
              <span class="text-muted small">Tổng biến thể</span>
              <strong>{{ variants.length }}</strong>
            </div>
            <div class="stat-row">
              <span class="text-muted small">Tổng tồn kho</span>
              <strong class="text-success">{{ totalStock }}</strong>
            </div>
            <div class="stat-row">
              <span class="text-muted small">Giá thấp nhất</span>
              <strong class="text-danger">{{ formatPrice(minPrice) }}đ</strong>
            </div>
            <div class="stat-row">
              <span class="text-muted small">Giá cao nhất</span>
              <strong class="text-danger">{{ formatPrice(maxPrice) }}đ</strong>
            </div>
          </div>

          <!-- ── Tổng quan biến thể khi Liên hệ ── -->
          <div v-if="product.lienHe && variants.length > 0" class="d-flex flex-column gap-2 mt-3 pt-3 border-top">
            <div class="stat-row">
              <span class="text-muted small">Tổng biến thể</span>
              <strong>{{ variants.length }}</strong>
            </div>
            <div class="stat-row">
              <span class="text-muted small">Tổng tồn kho</span>
              <strong class="text-success">{{ totalStock }}</strong>
            </div>
            <div class="stat-row">
              <span class="text-muted small">Giá hiển thị</span>
              <strong class="text-warning"><i class="bi bi-telephone-fill me-1"></i>Liên hệ</strong>
            </div>
          </div>
        </div>

        <!-- HÌNH ẢNH -->
        <div class="card-section mb-4">
          <h6 class="section-title"><i class="bi bi-images me-2"></i>Hình ảnh sản phẩm</h6>
          <div class="upload-zone text-center p-4 rounded-3 mb-3" @click="triggerFileInput">
            <i class="bi bi-cloud-arrow-up fs-1 text-vipep-green mb-2 d-block"></i>
            <span class="fw-bold text-main-brown d-block mb-1">Click để tải ảnh lên</span>
            <span class="small text-muted">PNG, JPG — Có thể chọn nhiều ảnh</span>
            <input type="file" class="d-none" ref="fileInput" @change="handleFileUpload" accept="image/*" multiple>
          </div>

          <div v-if="previewImages.length > 0" class="img-grid">
            <div v-for="(img, index) in previewImages" :key="index"
              class="img-thumb position-relative"
              :class="{ 'img-thumb--main': index === 0 }">
              <img :src="img.url" class="w-100 h-100 object-fit-cover rounded-2">
              <span v-if="index === 0" class="main-badge">Ảnh chính</span>
              <button @click="removeImage(index)" class="img-del-btn">
                <i class="bi bi-x"></i>
              </button>
            </div>
          </div>
          <p v-else class="text-center text-muted small mt-2 mb-0">Chưa có hình ảnh nào.</p>

          <p v-if="previewImages.length > 1" class="small text-muted mt-2 mb-0">
            <i class="bi bi-info-circle me-1"></i>Ảnh đầu tiên sẽ là ảnh đại diện sản phẩm.
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch  } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { adminProductService } from '@/services/productService';
import { API_BASE } from '@/config/api';

const route  = useRoute();
const router = useRouter();
const toast  = useToast();

const isEdit            = ref(false);
const categories        = ref([]);
const fileInput         = ref(null);
const selectedFiles     = ref([]);
const previewImages     = ref([]);
const variantFileInputs = ref([]);
const comboItems      = ref([]);
const comboFileInputs = ref([]);

const addComboItem = () => comboItems.value.push({ tenSanPham: '', soLuong: 1, previewUrl: null, file: null });
const removeComboItem = (idx) => comboItems.value.splice(idx, 1);

const triggerComboImg = (idx) => comboFileInputs.value[idx]?.click();
const handleComboImg = (e, idx) => {
  const file = e.target.files[0];
  if (!file) return;
  comboItems.value[idx].file       = file;
  comboItems.value[idx].previewUrl = URL.createObjectURL(file);
};

// ── Sản phẩm ──
const product = ref({
  id: null,
  tenSanPham: '',
  moTaNgan: '',
  moTaChiTiet: '',
  danhMucId: '',
  trangThai: true,
  laCombo: false,
  thuongHieu: '',
  chatLieu: '',
  kieuDang: '',
  chatLuong: '',
  xuatXu: '',
  tronBo: '',
  phuHopCho: '',
  // Dùng khi KHÔNG có biến thể
  maSku: '',
  trongLuong: '',
  giaNhap: 0,
  giaBan: 0,
  tonKho: 100,
 lienHe: false,
  soDienThoai: '',
  zaloLink: '',
  mauSac: '',
  kichThuoc: '',
  mauSacHex: '#ffffff',
});

watch(() => product.value.laCombo, (val) => {
  if (!val) comboItems.value = [];
});

// ── Biến thể ──
const variants = ref([]);

const newVariant = () => ({
  id: null,
  maSku: '',
  mauSac: '',
  mauSacHex: '#ffffff',
  kichThuoc: '',
  trongLuong: '',
  giaNhap: 0,
  giaBan: 0,
  tonKho: 0,
  previewUrl: null,
  file: null,
});

const addVariant    = () => variants.value.push(newVariant());
const removeVariant = (idx) => variants.value.splice(idx, 1);

const quickColors = [
  { label: 'Trắng', hex: '#ffffff' },
  { label: 'Đen',   hex: '#222222' },
  { label: 'Đỏ',    hex: '#e53935' },
  { label: 'Xanh',  hex: '#1e88e5' },
  { label: 'Vàng',  hex: '#fdd835' },
  { label: 'Nâu',   hex: '#795548' },
];
const quickSizes = ['S', 'M', 'L', 'XL', '16cm', '18cm', '20cm', '22cm', '24cm'];

const quickAddVariant = (field, val) => {
  const v = newVariant();
  if (field === 'mauSac') { v.mauSac = val.label; v.mauSacHex = val.hex || '#ffffff'; }
  if (field === 'kichThuoc') v.kichThuoc = val.label;
  variants.value.push(v);
};

const totalStock = computed(() => variants.value.reduce((s, v) => s + (Number(v.tonKho) || 0), 0));
const minPrice   = computed(() => Math.min(...variants.value.map(v => Number(v.giaBan) || 0)));
const maxPrice   = computed(() => Math.max(...variants.value.map(v => Number(v.giaBan) || 0)));

// ── Ảnh biến thể ──
const triggerVariantImg = (idx) => variantFileInputs.value[idx]?.click();
const handleVariantImg  = (e, idx) => {
  const file = e.target.files[0];
  if (!file) return;
  variants.value[idx].file       = file;
  variants.value[idx].previewUrl = URL.createObjectURL(file);
};

// ── Ảnh sản phẩm ──
const triggerFileInput = () => fileInput.value?.click();

const handleFileUpload = (e) => {
  Array.from(e.target.files).forEach(file => {
    selectedFiles.value.push(file);
    previewImages.value.push({ isOld: false, file, url: URL.createObjectURL(file) });
  });
  e.target.value = '';
};

const removeImage = (index) => {
  const img = previewImages.value[index];
  if (!img.isOld) {
    const fi = selectedFiles.value.indexOf(img.file);
    if (fi > -1) selectedFiles.value.splice(fi, 1);
  }
  previewImages.value.splice(index, 1);
};

const formatPrice = (n) => Number(n || 0).toLocaleString('vi-VN');

const formatImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return `${API_BASE}${path}`;
  return `${API_BASE}/uploads/${path}`;
};

// ── Fetch danh mục ──
const fetchCategories = async () => {
  try { categories.value = await adminProductService.getCategories(); }
  catch { toast.error('Không thể tải danh mục!'); }
};

// ── Fetch chi tiết sản phẩm khi Edit ──
const fetchProductDetails = async (id) => {
  try {
    const data = await adminProductService.getProductById(id);

    product.value = {
      ...product.value,
      ...data,
      danhMucId:    data.danhMucId    || '',
      lienHe:       data.lienHe       ?? false,
      soDienThoai:  data.soDienThoai  || '',
      zaloLink:     data.zaloLink     || '',
    };

    previewImages.value = [];
    const imgs = data.danhSachAnh?.length
      ? data.danhSachAnh
      : data.anhChinh
        ? [data.anhChinh]
        : [];
    imgs.forEach(url =>
      previewImages.value.push({ isOld: true, url: formatImageUrl(url), originalUrl: url })
    );

    if (data.chiTietSanPhams?.length) {
      variants.value = data.chiTietSanPhams.map(v => ({
        id:         v.id,
        maSku:      v.maSku      || '',
        mauSac:     v.mauSac     || '',
        mauSacHex:  v.mauSacHex  || '#ffffff',
        kichThuoc:  v.kichThuoc  || '',
        trongLuong: v.trongLuong || '',
        giaNhap:    v.giaNhap    || 0,
        giaBan:     v.giaBan     || 0,
        tonKho:     v.tonKho     || 0,
        previewUrl: v.anhSanPham ? formatImageUrl(v.anhSanPham) : null,
        file:       null,
      }));

      // Nếu SP đơn (1 biến thể, không có màu từ bảng biến thể nhiều)
      // load màu/kích thước lên form SP đơn để hiển thị đúng khi edit
      if (data.chiTietSanPhams.length === 1) {
        const ct = data.chiTietSanPhams[0];
        product.value.mauSac    = ct.mauSac    || '';
        product.value.kichThuoc = ct.kichThuoc || '';
        product.value.mauSacHex = ct.mauSacHex || '#ffffff';
        // Nếu chỉ có 1 biến thể đơn thì ẩn khỏi bảng biến thể
        // (chỉ hiện trong form SP đơn bên phải)
        variants.value = [];
      }
    } else {
      variants.value = [];
    }

    // Load combo items nếu là combo
    if (data.laCombo && data.chiTietCombos?.length) {
      comboItems.value = data.chiTietCombos.map(c => ({
        id:               c.id,
        chiTietSanPhamId: c.chiTietSanPhamId || null,
        tenSanPham:       c.tenSanPham  || '',
        soLuong:          c.soLuong     || 1,
        previewUrl:       c.anhSanPham  ? formatImageUrl(c.anhSanPham) : null,
        file:             null,
      }));
    } else {
      comboItems.value = [];
    }
  } catch {
    toast.error('Không tìm thấy sản phẩm!');
  }
};

// ── Lưu sản phẩm ──
const saveProduct = async () => {
  // Validate cơ bản
  if (!product.value.tenSanPham || !product.value.danhMucId) {
    toast.warning('Vui lòng điền đầy đủ các trường bắt buộc (*)');
    return;
  }

  // Validate liên hệ
  if (product.value.lienHe && !product.value.soDienThoai) {
    toast.warning('Vui lòng nhập Số điện thoại liên hệ!');
    return;
  }

  // Validate giá (chỉ khi không phải liên hệ)
  if (!product.value.lienHe) {
    if (variants.value.length === 0 && (!product.value.maSku || !product.value.giaBan)) {
      toast.warning('Vui lòng nhập SKU và Giá bán!');
      return;
    }
    if (variants.value.some(v => !v.maSku || !v.giaBan)) {
      toast.warning('Mỗi biến thể phải có SKU và Giá bán!');
      return;
    }
  } else {
    // Khi liên hệ, chỉ cần SKU
    if (variants.value.length === 0 && !product.value.maSku) {
      toast.warning('Vui lòng nhập SKU sản phẩm!');
      return;
    }
    if (variants.value.some(v => !v.maSku)) {
      toast.warning('Mỗi biến thể phải có SKU!');
      return;
    }
  }

  if (!product.value.lienHe && variants.value.length === 0 && product.value.tonKho <= 0) {
    product.value.trangThai = false;
    toast.info('Tồn kho = 0 → tự động Ngừng kinh doanh.');
  }

  try {
    const danhSachAnhCu = previewImages.value
      .filter(img => img.isOld)
      .map(img => img.originalUrl || img.url);

    const chiTietSanPhams = variants.value.map(v => ({
      id:        v.id || null,
      maSku:     v.maSku,
      mauSac:    v.mauSac,
      mauSacHex: v.mauSacHex,
      kichThuoc: v.kichThuoc,
      trongLuong:v.trongLuong,
      giaNhap:   Number(v.giaNhap) || 0,
      giaBan:    product.value.lienHe ? null : (Number(v.giaBan) || 0),
      tonKho:    Number(v.tonKho)  || 0,
      anhSanPham: v.file
        ? null
        : (v.previewUrl && !v.previewUrl.startsWith('blob:')
          ? v.previewUrl.replace(API_BASE, '')
          : null),
      trangThai: true,
    }));

    const payload = {
      tenSanPham:   product.value.tenSanPham,
      moTaNgan:     product.value.moTaNgan,
      moTaChiTiet:  product.value.moTaChiTiet,
      danhMucId:    product.value.danhMucId,
      trangThai:    product.value.trangThai,
      laCombo:      product.value.laCombo,
      thuongHieu:   product.value.thuongHieu,
      chatLieu:     product.value.chatLieu,
      kieuDang:     product.value.kieuDang,
      chatLuong:    product.value.chatLuong,
      xuatXu:       product.value.xuatXu,
      tronBo:       product.value.tronBo,
      phuHopCho:    product.value.phuHopCho,
      // Liên hệ
      lienHe:       product.value.lienHe,
      soDienThoai:  product.value.lienHe ? product.value.soDienThoai : null,
      zaloLink:     product.value.lienHe ? (product.value.zaloLink || product.value.soDienThoai) : null,
      // Giá & Kho — chỉ gửi khi không có biến thể
      maSku:        variants.value.length === 0 ? product.value.maSku      : null,
      trongLuong:   variants.value.length === 0 ? product.value.trongLuong : null,
      giaNhap:      variants.value.length === 0 ? Number(product.value.giaNhap) : null,
      giaBan:       (variants.value.length === 0 && !product.value.lienHe) ? Number(product.value.giaBan) : null,
      tonKho:       variants.value.length === 0 ? Number(product.value.tonKho)  : null,
      mauSac:       variants.value.length === 0 ? product.value.mauSac          : null,
      kichThuoc:    variants.value.length === 0 ? product.value.kichThuoc       : null,
      mauSacHex:    variants.value.length === 0 ? product.value.mauSacHex       : null,
      chiTietSanPhams,
         chiTietCombos: product.value.laCombo
        ? comboItems.value.map(c => ({
            id:               c.id || null,
            chiTietSanPhamId: c.chiTietSanPhamId || null,
            tenSanPham:       c.tenSanPham,
            soLuong:          c.soLuong || 1,
          }))
        : [],
      danhSachAnhCu,
    };

    console.log('isEdit:', isEdit.value);
    console.log('payload:', JSON.stringify(payload, null, 2));

    let savedId     = null;
    let savedResult = null;

    if (isEdit.value) {
      savedResult = await adminProductService.updateProduct(product.value.id, payload);
      savedId     = product.value.id;
    } else {
      savedResult = await adminProductService.createProduct(payload);
      savedId = savedResult?.id ?? savedResult?.data?.id ?? null;
    }

    if (!savedId) {
      console.error('Không lấy được savedId từ response:', savedResult);
      toast.error('Lưu thất bại: không lấy được ID sản phẩm!');
      return;
    }

    if (selectedFiles.value.length > 0) {
      const fd = new FormData();
      selectedFiles.value.forEach(f => fd.append('files', f));
      await adminProductService.uploadImages(savedId, fd);
    }

    const savedVariants = savedResult?.chiTietSanPhams || [];
    for (let i = 0; i < variants.value.length; i++) {
      const v = variants.value[i];
      if (!v.file) continue;
      const variantId = v.id || savedVariants[i]?.id;
      if (!variantId) { console.warn(`Biến thể index ${i} không có id, bỏ qua upload ảnh`); continue; }
      const fd = new FormData();
      fd.append('file', v.file);
      await adminProductService.uploadVariantImage(variantId, fd);
    }

    // Upload ảnh combo items
   // Upload ảnh combo items
    const savedCombos = savedResult?.chiTietCombos || [];
    console.log('savedCombos from response:', savedCombos);
    for (let i = 0; i < comboItems.value.length; i++) {
      const ci = comboItems.value[i];
      if (!ci.file) continue;
      const comboId = savedCombos[i]?.id; // luôn lấy từ response, không dùng ci.id cũ
      if (!comboId) {
        console.warn(`Combo item index ${i} không có id trong response`);
        continue;
      }
      const fd = new FormData();
      fd.append('file', ci.file);
      await adminProductService.uploadComboItemImage(comboId, fd);
    }

    toast.success('Lưu sản phẩm thành công!');
    router.push('/products');

  } catch (err) {
    console.error('saveProduct error:', err);
    const msg = err?.response?.data?.message || err?.message || 'Lỗi không xác định';
    toast.error(`Lỗi: ${msg}`);
  }
};

onMounted(async () => {
  await fetchCategories();
  if (route.params.id) {
    isEdit.value = true;
    await fetchProductDetails(route.params.id);
  }
});
</script>

<style scoped>
.font-general { font-family: 'Quicksand', sans-serif !important; }
.text-main-brown { color: #4A3018 !important; }
.btn-vipep-green { background-color: #5b8e1d; border-color: #5b8e1d; }
.btn-vipep-green:hover { background-color: #4a7516; }
.text-vipep-green { color: #5b8e1d !important; }

/* Card section */
.card-section {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 8px rgba(0,0,0,0.06);
  padding: 1.25rem 1.5rem;
}
.section-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #2d2d2d;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f0f0f0;
}

/* Form controls */
.fc {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: none;
  font-size: 0.88rem;
  padding: 0.5rem 0.75rem;
  transition: all 0.2s;
}
.fc:focus {
  background: #fff !important;
  border-color: #5b8e1d !important;
  box-shadow: 0 0 0 3px rgba(91,142,29,0.12) !important;
}
.fc-sm { font-size: 0.82rem; padding: 0.4rem 0.6rem; }
.field-label { font-size: 0.8rem; font-weight: 700; color: #6c757d; margin-bottom: 4px; }
.field-label-sm { font-size: 0.75rem; font-weight: 600; color: #999; display: block; margin-bottom: 2px; }

/* Input group icons */
.ig-green { background: #f0fdf4; border-color: #e9ecef; }
.ig-blue  { background: #e8f4fd; border-color: #e9ecef; }

/* ── Price mode toggle ── */
.price-mode-toggle {
  display: flex;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e9ecef;
  background: #f8f9fa;
  padding: 3px;
  gap: 3px;
}
.price-mode-btn {
  flex: 1;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
  color: #888;
}
.price-mode-btn:hover { background: #eee; color: #555; }
.price-mode-btn--active {
  background: #5b8e1d;
  color: #fff;
  box-shadow: 0 2px 8px rgba(91,142,29,0.3);
}
.price-mode-btn--contact {
  background: #f59e0b;
  color: #fff;
  box-shadow: 0 2px 8px rgba(245,158,11,0.3);
}

/* Liên hệ info box */
.lien-he-info-box {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  align-items: flex-start;
  gap: 4px;
  font-size: 0.83rem;
  color: #78350f;
}

/* Badge nhỏ trong variant table */
.lien-he-badge-sm {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #92400e;
  white-space: nowrap;
}

/* ── Preview popup ── */
.preview-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 8px;
}
.preview-popup {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 14px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.preview-popup__header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 2px;
}
.preview-popup__icon {
  width: 38px; height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f2faeb, #d4edda);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; color: #5b8e1d;
  flex-shrink: 0;
}
.preview-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  text-decoration: none;
  font-size: 0.85rem;
  transition: transform 0.15s, box-shadow 0.15s;
}
.preview-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,0,0,0.15); }
.preview-btn i:first-child { font-size: 1.1rem; flex-shrink: 0; }
.preview-btn--call {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: #fff;
}
.preview-btn--zalo {
  background: linear-gradient(135deg, #0068ff, #00a8ff);
  color: #fff;
}

/* Variant table */
.variant-header {
  display: grid;
  grid-template-columns: 56px 160px 100px 90px 100px 100px 80px 100px 40px;
  gap: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #999;
  text-transform: uppercase;
  padding: 0 4px 8px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 8px;
}
.variant-row {
  display: grid;
  grid-template-columns: 56px 160px 100px 90px 100px 100px 80px 100px 40px;
  gap: 8px;
  align-items: center;
  padding: 8px 4px;
  border-bottom: 1px solid #f8f8f8;
  transition: background 0.15s;
}
.variant-row:hover { background: #fafffe; border-radius: 8px; }
@media (max-width: 991px) {
  .variant-header { display: none; }
  .variant-row {
    grid-template-columns: 56px 1fr 40px;
    grid-template-rows: auto;
    gap: 6px;
    padding: 12px 8px;
    border: 1px solid #f0f0f0;
    border-radius: 10px;
    margin-bottom: 8px;
  }
  .variant-img-cell { grid-row: 1 / 3; }
  .variant-field { grid-column: 2; }
  .variant-del { grid-column: 3; grid-row: 1; }
}

.variant-img-box {
  width: 52px; height: 52px;
  border: 1.5px dashed #ccc;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; overflow: hidden;
  transition: border-color 0.2s;
  font-size: 1.1rem;
}
.variant-img-box:hover { border-color: #5b8e1d; }

.color-picker {
  width: 32px; height: 32px;
  border: none; border-radius: 6px;
  padding: 2px; cursor: pointer;
  flex-shrink: 0;
}

/* Quick add */
.quick-add-wrap {}
.quick-btn {
  font-size: 0.75rem;
  border: 1px solid #e0e0e0;
  background: #f8f8f8;
  color: #555;
  display: flex; align-items: center; gap: 5px;
  transition: all 0.15s;
}
.quick-btn:hover { border-color: #5b8e1d; color: #5b8e1d; background: #f2faeb; }
.color-dot {
  width: 12px; height: 12px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.15);
  flex-shrink: 0;
}

/* Stat rows */
.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px dashed #f0f0f0;
  font-size: 0.88rem;
}
.stat-row:last-child { border-bottom: none; }

/* Image grid */
.img-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.img-thumb {
  aspect-ratio: 1;
  border: 1.5px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}
.img-thumb--main { border-color: #5b8e1d; border-width: 2px; }
.main-badge {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: rgba(91,142,29,0.85);
  color: #fff; font-size: 10px; font-weight: 700;
  text-align: center; padding: 2px 0;
}
.img-del-btn {
  position: absolute; top: 3px; right: 3px;
  width: 20px; height: 20px;
  background: rgba(220,53,69,0.9);
  border: none; border-radius: 50%;
  color: #fff; font-size: 13px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; padding: 0; line-height: 1;
  transition: background 0.15s;
}
.img-del-btn:hover { background: #dc3545; }

/* Upload zone */
.upload-zone {
  border: 2px dashed #cbd5e1;
  cursor: pointer;
  transition: all 0.2s;
}
.upload-zone:hover { border-color: #5b8e1d; background: #f2faeb !important; }

.empty-variant-hint { background: #fafafa; border-radius: 10px; border: 1px dashed #e0e0e0; }


.combo-img-box {
  width: 36px; height: 36px;
  border: 1.5px dashed #ccc;
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; overflow: hidden;
  background: #f8f9fa;
  flex-shrink: 0;
  transition: border-color 0.2s;
}
.combo-img-box:hover { border-color: #5b8e1d; }
</style>