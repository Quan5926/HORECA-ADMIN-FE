<template>
  <div class="font-general p-3 p-md-4">
    <!-- HEADER -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
      <div>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb mb-1 small">
            <li class="breadcrumb-item"><router-link to="/" class="text-muted text-decoration-none">Tổng quan</router-link></li>
            <li class="breadcrumb-item"><router-link to="/products" class="text-muted text-decoration-none">Sản phẩm</router-link></li>
            <li class="breadcrumb-item active fw-bold" aria-current="page">Chi tiết</li>
          </ol>
        </nav>
        <h4 class="fw-bold mb-0 text-main-brown">Chi Tiết Sản Phẩm</h4>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-light border shadow-sm px-4 rounded-pill fw-medium" @click="$router.push('/products')">
          <i class="bi bi-arrow-left me-1"></i> Quay lại
        </button>
        <button class="btn btn-vipep-green text-white px-4 rounded-pill shadow-sm fw-medium d-flex align-items-center gap-2"
          @click="$router.push(`/products/edit/${product.id}`)">
          <i class="bi bi-pencil"></i> Sửa sản phẩm
        </button>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="!product" class="text-center py-5">
      <div class="spinner-border text-success" role="status"></div>
      <p class="mt-2 text-muted">Đang tải thông tin sản phẩm...</p>
    </div>

    <template v-else>
      <!-- BLOCK 1: ẢNH + THÔNG TIN CHÍNH -->
      <div class="card-section mb-4">
        <div class="row g-4 g-md-5">

          <!-- ẢNH -->
          <div class="col-md-5">
            <div class="main-img-wrap rounded-4 bg-light d-flex align-items-center justify-content-center mb-3">
              <img v-if="selectedImage" :src="selectedImage"
                class="img-fluid rounded-3 object-fit-cover" style="max-height:400px;width:100%;" alt="Ảnh sản phẩm">
              <i v-else class="bi bi-image text-muted" style="font-size:5rem;"></i>
            </div>
            <!-- Thumbnails -->
            <div v-if="allImages.length > 1" class="d-flex gap-2 overflow-auto py-1 px-1 custom-scrollbar">
              <div v-for="(img, idx) in allImages" :key="idx"
                class="thumb-item rounded-3 overflow-hidden flex-shrink-0"
                :class="selectedImage === img ? 'thumb-active' : ''"
                @click="selectedImage = img">
                <img :src="img" class="w-100 h-100 object-fit-cover" alt="thumb">
              </div>
            </div>
          </div>

          <!-- THÔNG TIN CHÍNH -->
          <div class="col-md-7">
            <!-- Badges -->
            <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
              <span class="badge rounded-pill px-3 py-2"
                :class="isActive ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'">
                {{ isActive ? 'Đang kinh doanh' : 'Ngừng kinh doanh' }}
              </span>
              <span v-if="product.laCombo" class="badge rounded-pill px-3 py-2 bg-warning-subtle text-warning">
                <i class="bi bi-box-seam me-1"></i>Combo
              </span>
              <span v-if="product.lienHe" class="badge rounded-pill px-3 py-2 bg-warning text-dark">
                <i class="bi bi-telephone-fill me-1"></i>Liên hệ
              </span>
              <!-- Flash sale badge tổng -->
              <span v-if="hasAnyFlash || singleFlash" class="badge rounded-pill px-3 py-2 bg-danger text-white flash-pulse">
                🔥 Flash Sale
              </span>
              <span class="text-muted small"><i class="bi bi-tag-fill me-1"></i>{{ product.danhMuc || 'Chưa phân loại' }}</span>
            </div>

            <h2 class="fw-bold text-main-brown mb-1">{{ product.tenSanPham }}</h2>

            <!-- Thông tin phụ dạng pill -->
            <div class="d-flex flex-wrap gap-2 mb-3 mt-2">
              <span v-if="product.thuongHieu" class="info-pill"><i class="bi bi-building me-1"></i>{{ product.thuongHieu }}</span>
              <span v-if="product.xuatXu"     class="info-pill"><i class="bi bi-geo-alt me-1"></i>{{ product.xuatXu }}</span>
              <span v-if="product.chatLuong"  class="info-pill"><i class="bi bi-patch-check me-1"></i>{{ product.chatLuong }}</span>
            </div>

            <!-- ── Chế độ LIÊN HỆ (không có biến thể) ── -->
            <div v-if="product.lienHe && !hasVariants" class="price-block rounded-4 p-3 mb-3">
              <div v-if="singleVariant" class="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                <div class="rounded-3 overflow-hidden bg-light d-flex align-items-center justify-content-center flex-shrink-0"
                  style="width:64px;height:64px;border:1px solid #e9ecef;">
                  <img v-if="singleVariant.anhSanPham" :src="getImageUrl(singleVariant.anhSanPham)"
                    class="w-100 h-100 object-fit-cover" alt="">
                  <i v-else class="bi bi-image text-muted"></i>
                </div>
                <div class="d-flex flex-wrap gap-2">
                  <span v-if="singleVariant.mauSac" class="info-pill">
                    <span class="color-swatch me-1" :style="getSwatchStyle(singleVariant.mauSac)"></span>
                    {{ singleVariant.mauSac }}
                  </span>
                  <span v-if="singleVariant.kichThuoc" class="info-pill">
                    <i class="bi bi-rulers me-1"></i>{{ singleVariant.kichThuoc }}
                  </span>
                </div>
              </div>
              <div class="mb-3">
                <span class="text-muted small d-block mb-1">Giá hiển thị</span>
                <span class="badge bg-warning text-dark px-3 py-2 fs-6">
                  <i class="bi bi-telephone-fill me-1"></i>Liên hệ để được báo giá
                </span>
              </div>
              <div class="row g-2 mb-3">
                <div class="col-6" v-if="product.maSku">
                  <span class="text-muted small d-block mb-1">SKU</span>
                  <span class="fw-medium font-monospace">{{ product.maSku }}</span>
                </div>
                <div class="col-6">
                  <span class="text-muted small d-block mb-1">Tồn kho</span>
                  <span class="fw-bold" :class="stockColor(product.tonKho)">
                    {{ product.tonKho }} sản phẩm
                    <small class="d-block fw-medium" style="font-size:0.78rem;">{{ stockLabel(product.tonKho) }}</small>
                  </span>
                </div>
                <div class="col-6" v-if="product.trongLuong">
                  <span class="text-muted small d-block mb-1">Trọng lượng</span>
                  <span class="fw-medium">{{ product.trongLuong }}</span>
                </div>
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
                    <div style="font-size:11px; opacity:.8;">{{ product.soDienThoai }}</div>
                  </div>
                  <i class="bi bi-chevron-right ms-auto"></i>
                </a>
                <a :href="'https://zalo.me/' + (product.zaloLink || product.soDienThoai)"
                  target="_blank" class="preview-btn preview-btn--zalo">
                  <i class="bi bi-chat-dots-fill"></i>
                  <div>
                    <div class="fw-semibold" style="font-size:13px;">Chat qua Zalo</div>
                    <div style="font-size:11px; opacity:.8;">Phản hồi trong vài phút</div>
                  </div>
                  <i class="bi bi-chevron-right ms-auto"></i>
                </a>
              </div>
            </div>

            <!-- ── Chế độ NHẬP GIÁ (không có biến thể) ── -->
            <div v-else-if="!product.lienHe && !hasVariants" class="price-block rounded-4 p-3 mb-3">
              <div v-if="singleVariant" class="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                <div class="rounded-3 overflow-hidden bg-light d-flex align-items-center justify-content-center flex-shrink-0"
                  style="width:64px;height:64px;border:1px solid #e9ecef;">
                  <img v-if="singleVariant.anhSanPham" :src="getImageUrl(singleVariant.anhSanPham)"
                    class="w-100 h-100 object-fit-cover" alt="">
                  <i v-else class="bi bi-image text-muted"></i>
                </div>
                <div class="d-flex flex-wrap gap-2">
                  <span v-if="singleVariant.mauSac" class="info-pill">
                    <span class="color-swatch me-1" :style="getSwatchStyle(singleVariant.mauSac)"></span>
                    {{ singleVariant.mauSac }}
                  </span>
                  <span v-if="singleVariant.kichThuoc" class="info-pill">
                    <i class="bi bi-rulers me-1"></i>{{ singleVariant.kichThuoc }}
                  </span>
                </div>
              </div>
              <div class="row g-3">
                <div class="col-6">
                  <span class="text-muted small d-block mb-1">Giá bán</span>
                  <!-- CÓ flash sale -->
                  <template v-if="singleFlash">
                    <span class="text-muted text-decoration-line-through d-block" style="font-size:0.82rem;">
                      {{ formatPrice(singleFlash.giaGoc) }}đ
                    </span>
                    <span class="fw-bold fs-4 text-danger">{{ formatPrice(singleFlash.giaSale) }}đ</span>
                    <span class="badge bg-danger ms-2" style="font-size:0.72rem;">🔥 -{{ singleFlash.percent }}%</span>
                  </template>
                  <!-- KHÔNG flash -->
                  <span v-else class="fw-bold fs-4 text-danger">{{ formatPrice(product.giaBan) }}đ</span>
                </div>
                <div class="col-6">
                  <span class="text-muted small d-block mb-1">Giá nhập</span>
                  <span class="fw-medium fs-5">{{ formatPrice(product.giaNhap) }}đ</span>
                </div>
                <div class="col-6">
                  <span class="text-muted small d-block mb-1">Tồn kho</span>
                  <span class="fw-bold fs-5" :class="stockColor(product.tonKho)">
                    {{ product.tonKho }} sản phẩm
                    <small class="d-block fw-medium" style="font-size:0.78rem;">{{ stockLabel(product.tonKho) }}</small>
                  </span>
                </div>
                <div class="col-6">
                  <span class="text-muted small d-block mb-1">SKU</span>
                  <span class="fw-medium font-monospace">{{ product.maSku || '---' }}</span>
                </div>
                <div class="col-6" v-if="product.trongLuong">
                  <span class="text-muted small d-block mb-1">Trọng lượng</span>
                  <span class="fw-medium">{{ product.trongLuong }}</span>
                </div>
              </div>
            </div>

            <!-- ── Tổng quan biến thể (có biến thể & LIÊN HỆ) ── -->
            <div v-else-if="product.lienHe && hasVariants" class="price-block rounded-4 p-3 mb-3">
              <div class="row g-3 mb-3">
                <div class="col-6">
                  <span class="text-muted small d-block mb-1">Tổng biến thể</span>
                  <span class="fw-bold fs-5">{{ variants.length }}</span>
                </div>
                <div class="col-6">
                  <span class="text-muted small d-block mb-1">Tổng tồn kho</span>
                  <span class="fw-bold fs-5 text-success">{{ totalStock }}</span>
                </div>
                <div class="col-12">
                  <span class="text-muted small d-block mb-1">Giá hiển thị</span>
                  <span class="badge bg-warning text-dark px-3 py-2">
                    <i class="bi bi-telephone-fill me-1"></i>Liên hệ để được báo giá
                  </span>
                </div>
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
                    <div style="font-size:11px; opacity:.8;">{{ product.soDienThoai }}</div>
                  </div>
                  <i class="bi bi-chevron-right ms-auto"></i>
                </a>
                <a :href="'https://zalo.me/' + (product.zaloLink || product.soDienThoai)"
                  target="_blank" class="preview-btn preview-btn--zalo">
                  <i class="bi bi-chat-dots-fill"></i>
                  <div>
                    <div class="fw-semibold" style="font-size:13px;">Chat qua Zalo</div>
                    <div style="font-size:11px; opacity:.8;">Phản hồi trong vài phút</div>
                  </div>
                  <i class="bi bi-chevron-right ms-auto"></i>
                </a>
              </div>
            </div>

            <!-- ── Tổng quan biến thể (có biến thể & NHẬP GIÁ) ── -->
            <div v-else class="price-block rounded-4 p-3 mb-3">
              <div class="row g-3">
                <div class="col-6">
                  <span class="text-muted small d-block mb-1">Tổng biến thể</span>
                  <span class="fw-bold fs-5">{{ variants.length }}</span>
                </div>
                <div class="col-6">
                  <span class="text-muted small d-block mb-1">Tổng tồn kho</span>
                  <span class="fw-bold fs-5 text-success">{{ totalStock }}</span>
                </div>
                <div class="col-6">
                  <span class="text-muted small d-block mb-1">Giá thấp nhất</span>
                  <!-- Có flash: giá flash + gốc gạch ngang -->
                  <template v-if="hasAnyFlash && minPriceFlash < minPrice">
                    <span class="text-muted text-decoration-line-through d-block" style="font-size:0.78rem;">
                      {{ formatPrice(minPrice) }}đ
                    </span>
                    <span class="fw-bold text-danger">{{ formatPrice(minPriceFlash) }}đ</span>
                  </template>
                  <span v-else class="fw-bold text-danger">{{ formatPrice(minPrice) }}đ</span>
                </div>
                <div class="col-6">
                  <span class="text-muted small d-block mb-1">Giá cao nhất</span>
                  <span class="fw-bold text-danger">{{ formatPrice(maxPrice) }}đ</span>
                </div>
                <!-- Badge flash summary -->
                <div class="col-12" v-if="hasAnyFlash">
                  <span class="badge bg-danger px-3 py-2 flash-pulse" style="font-size:0.8rem;">
                    🔥 {{ variantFlashes.size }}/{{ variants.length }} biến thể đang Flash Sale
                  </span>
                </div>
              </div>
            </div>

            <!-- Mô tả ngắn -->
            <div v-if="product.moTaNgan">
              <h6 class="fw-bold border-bottom pb-2 mb-2">Mô tả ngắn</h6>
              <p class="text-secondary lh-lg mb-0">{{ product.moTaNgan }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- BLOCK 2: THÔNG TIN CHI TIẾT SẢN PHẨM -->
      <div class="card-section mb-4">
        <h6 class="section-title"><i class="bi bi-list-ul me-2"></i>Thông tin sản phẩm</h6>
        <div class="row g-0">
          <template v-for="(item, idx) in productInfoRows" :key="idx">
            <div v-if="item.value" class="col-12 info-row" :class="{ 'info-row--alt': idx % 2 !== 0 }">
              <div class="info-row__label">{{ item.label }}</div>
              <div class="info-row__value">{{ item.value }}</div>
            </div>
          </template>
          <div v-if="product.lienHe && product.soDienThoai"
            class="col-12 info-row" :class="{ 'info-row--alt': productInfoRows.filter(r => r.value).length % 2 !== 0 }">
            <div class="info-row__label">Số điện thoại</div>
            <div class="info-row__value">
              <a :href="'tel:' + product.soDienThoai" class="text-decoration-none text-success fw-bold">
                <i class="bi bi-telephone-fill me-1"></i>{{ product.soDienThoai }}
              </a>
            </div>
          </div>
          <div v-if="product.lienHe && product.zaloLink"
            class="col-12 info-row" :class="{ 'info-row--alt': (productInfoRows.filter(r => r.value).length + 1) % 2 !== 0 }">
            <div class="info-row__label">Zalo</div>
            <div class="info-row__value">
              <a :href="'https://zalo.me/' + product.zaloLink" target="_blank"
                class="text-decoration-none fw-bold" style="color:#0068ff;">
                <i class="bi bi-chat-dots-fill me-1"></i>{{ product.zaloLink }}
              </a>
            </div>
          </div>
          <div v-if="productInfoRows.every(r => !r.value) && !product.lienHe"
            class="col-12 text-center text-muted small py-3">
            Chưa có thông tin chi tiết.
          </div>
        </div>
      </div>

      <!-- BLOCK 3: BIẾN THỂ SẢN PHẨM -->
      <div class="card-section mb-4" v-if="hasVariants">
        <div class="d-flex align-items-center justify-content-between mb-3">
          <h6 class="section-title mb-0">
            <i class="bi bi-sliders me-2"></i>Biến thể sản phẩm ({{ variants.length }})
          </h6>
          <!-- Flash summary nhỏ bên cạnh title -->
          <span v-if="hasAnyFlash" class="badge bg-danger px-3 py-2 flash-pulse" style="font-size:0.78rem;">
            🔥 {{ variantFlashes.size }} biến thể đang flash sale
          </span>
        </div>

        <div class="variant-header d-none d-md-grid" :class="product.lienHe ? 'variant-header--no-price' : ''">
          <span>Ảnh</span>
          <span>SKU</span>
          <span>Màu sắc</span>
          <span>Kích thước</span>
          <span>Trọng lượng</span>
          <span>Giá nhập</span>
          <span v-if="!product.lienHe">Giá bán</span>
          <span v-else class="text-warning"><i class="bi bi-telephone-fill me-1"></i>Liên hệ</span>
          <span>Tồn kho</span>
          <span>Trạng thái</span>
        </div>

        <div v-for="(v, idx) in variants" :key="idx"
          class="variant-row"
          :class="[
            product.lienHe ? 'variant-row--no-price' : '',
            variantFlashes.get(v.id) ? 'variant-row--flash' : ''
          ]">
          <!-- Ảnh -->
          <div>
            <div class="variant-thumb rounded-2 overflow-hidden bg-light d-flex align-items-center justify-content-center">
              <img v-if="v.anhSanPham" :src="getImageUrl(v.anhSanPham)" class="w-100 h-100 object-fit-cover" alt="">
              <i v-else class="bi bi-image text-muted small"></i>
            </div>
          </div>
          <!-- SKU -->
          <div>
            <span class="d-md-none text-muted small fw-bold me-1">SKU:</span>
            <span class="font-monospace small">{{ v.maSku || '---' }}</span>
          </div>
          <!-- Màu -->
          <div class="d-flex align-items-center gap-2">
            <span v-if="v.mauSac" class="color-swatch" :style="getSwatchStyle(v.mauSac)"></span>
            <span>{{ v.mauSac || '---' }}</span>
          </div>
          <!-- Kích thước -->
          <div>{{ v.kichThuoc || '---' }}</div>
          <!-- Trọng lượng -->
          <div>{{ v.trongLuong || '---' }}</div>
          <!-- Giá nhập -->
          <div class="text-muted small">{{ formatPrice(v.giaNhap) }}đ</div>
          <!-- Giá bán / Liên hệ -->
          <div>
            <span v-if="product.lienHe" class="lien-he-badge-sm">
              <i class="bi bi-telephone-fill me-1"></i>Liên hệ
            </span>
            <template v-else>
              <!-- Biến thể đang flash sale -->
              <template v-if="variantFlashes.get(v.id)">
                <span class="text-muted text-decoration-line-through d-block" style="font-size:0.72rem; line-height:1.2;">
                  {{ formatPrice(v.giaBan) }}đ
                </span>
                <span class="fw-bold text-danger">
                  {{ formatPrice(Math.round(v.giaBan * (1 - variantFlashes.get(v.id) / 100))) }}đ
                </span>
                <span class="badge bg-danger d-block mt-1" style="font-size:0.6rem; width:fit-content;">
                  🔥 -{{ variantFlashes.get(v.id) }}%
                </span>
              </template>
              <!-- Biến thể thường -->
              <span v-else class="fw-bold text-danger">{{ formatPrice(v.giaBan) }}đ</span>
            </template>
          </div>
          <!-- Tồn kho -->
          <div :class="stockColor(v.tonKho)" class="fw-bold">
            {{ v.tonKho }}
            <small class="d-block fw-normal" style="font-size:0.72rem;">{{ stockLabel(v.tonKho) }}</small>
          </div>
          <!-- Trạng thái -->
          <div>
            <span class="badge rounded-pill"
              :class="v.trangThai ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'">
              {{ v.trangThai ? 'Hoạt động' : 'Ẩn' }}
            </span>
          </div>
        </div>
      </div>

      <!-- BLOCK 3B: COMBO ITEMS -->
      <div class="card-section mb-4" v-if="hasCombo">
        <h6 class="section-title"><i class="bi bi-box-seam me-2"></i>Sản phẩm trong combo ({{ comboItems.length }})</h6>
        <div class="d-flex flex-column gap-2">
          <div v-for="(ci, idx) in comboItems" :key="idx"
            class="combo-item-row d-flex align-items-center gap-3 p-2 rounded-3 border bg-light">
            <div class="combo-thumb rounded-2 overflow-hidden bg-white d-flex align-items-center justify-content-center flex-shrink-0">
              <img v-if="ci.anhSanPham" :src="getImageUrl(ci.anhSanPham)"
                class="w-100 h-100 object-fit-cover" alt="">
              <i v-else class="bi bi-image text-muted small"></i>
            </div>
            <span class="text-muted flex-shrink-0" style="font-size:0.78rem;min-width:20px;">{{ idx + 1 }}.</span>
            <span class="fw-medium flex-grow-1">{{ ci.tenSanPham || '---' }}</span>
            <div class="d-flex align-items-center gap-1 flex-shrink-0">
              <span v-if="ci.mauSac" class="info-pill-sm">{{ ci.mauSac }}</span>
              <span v-if="ci.kichThuoc" class="info-pill-sm">{{ ci.kichThuoc }}</span>
            </div>
            <span class="badge bg-success-subtle text-success rounded-pill px-3 py-2 flex-shrink-0">
              x{{ ci.soLuong }}
            </span>
          </div>
        </div>
      </div>

      <!-- BLOCK 4: MÔ TẢ CHI TIẾT -->
      <div class="card-section mb-4" v-if="product.moTaChiTiet">
        <h6 class="section-title"><i class="bi bi-file-text me-2"></i>Mô tả chi tiết</h6>
        <div class="text-secondary lh-lg bg-light p-3 rounded-3" style="white-space:pre-line;">
          {{ product.moTaChiTiet }}
        </div>
      </div>

    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { adminProductService } from '@/services/productService';
import { API_BASE } from '@/config/api';

const route  = useRoute();
const router = useRouter();

const product       = ref(null);
const categories    = ref([]);
const selectedImage = ref('');
const flashMap      = ref(new Map()); // chiTietId → phanTramGiamGia

// ── Computed ──
const isActive = computed(() => product.value?.trangThai === true || product.value?.trangThai === 1);

const variants = computed(() =>
  (product.value?.chiTietSanPhams || []).filter(
    v => !v.maSku?.startsWith('COMBO-') && (v.mauSac || v.kichThuoc)
  )
);
const hasVariants = computed(() => variants.value.length > 0);

const singleVariant = computed(() => {
  const list = (product.value?.chiTietSanPhams || []).filter(
    v => !v.maSku?.startsWith('COMBO-')
  );
  if (list.length === 1) return list[0];
  return null;
});

const comboItems = computed(() => product.value?.chiTietCombos || []);
const hasCombo   = computed(() => Boolean(product.value?.laCombo) && comboItems.value.length > 0);

const totalStock = computed(() => variants.value.reduce((s, v) => s + (Number(v.tonKho) || 0), 0));
const minPrice   = computed(() => hasVariants.value ? Math.min(...variants.value.map(v => Number(v.giaBan) || 0)) : 0);
const maxPrice   = computed(() => hasVariants.value ? Math.max(...variants.value.map(v => Number(v.giaBan) || 0)) : 0);

const allImages = computed(() => {
  if (!product.value) return [];
  const list = product.value.danhSachAnh?.length
    ? product.value.danhSachAnh
    : product.value.anhChinh ? [product.value.anhChinh]
    : product.value.anhSanPham ? [product.value.anhSanPham] : [];
  return list.map(getImageUrl).filter(Boolean);
});

const productInfoRows = computed(() => {
  if (!product.value) return [];
  return [
    { label: 'Thương hiệu',     value: product.value.thuongHieu },
    { label: 'Xuất xứ',         value: product.value.xuatXu },
    { label: 'Chất liệu',       value: product.value.chatLieu },
    { label: 'Chất lượng',      value: product.value.chatLuong },
    { label: 'Kiểu dáng',       value: product.value.kieuDang },
    { label: 'Phù hợp cho',     value: product.value.phuHopCho },
    { label: 'Trọn bộ bao gồm', value: product.value.tronBo },
  ];
});

// ── Flash sale computed ──
const singleFlash = computed(() => {
  if (!singleVariant.value) return null;
  const pct = flashMap.value.get(Number(singleVariant.value.id)) || 0;
  if (!pct) return null;
  return {
    percent: pct,
    giaGoc: singleVariant.value.giaBan,
    giaSale: Math.round(singleVariant.value.giaBan * (1 - pct / 100)),
  };
});

const variantFlashes = computed(() => {
  const result = new Map();
  variants.value.forEach(v => {
    const pct = flashMap.value.get(Number(v.id)) || 0;
    if (pct > 0) result.set(v.id, pct);
  });
  return result;
});

const hasAnyFlash = computed(() => variantFlashes.value.size > 0);

const minPriceFlash = computed(() => {
  if (!hasVariants.value) return 0;
  return Math.min(...variants.value.map(v => {
    const pct = variantFlashes.value.get(v.id) || 0;
    return pct > 0 ? Math.round(v.giaBan * (1 - pct / 100)) : v.giaBan;
  }));
});

// ── Helpers ──
const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('blob:')) return url;
  if (url.startsWith('/uploads/')) return `${API_BASE}${url}`;
  return `${API_BASE}/uploads/${url}`;
};

const formatPrice = (n) => Number(n || 0).toLocaleString('vi-VN');

const stockColor = (n) => {
  if (n <= 0)  return 'text-danger';
  if (n <= 10) return 'text-warning';
  return 'text-success';
};
const stockLabel = (n) => {
  if (n <= 0)  return 'Hết hàng';
  if (n <= 10) return 'Sắp hết hàng';
  return 'Còn hàng';
};

const colorMap = {
  'trắng': '#ffffff', 'đen': '#222222', 'đỏ': '#e53935',
  'xanh': '#1e88e5', 'vàng': '#fdd835', 'nâu': '#795548',
  'hồng': '#e91e96', 'cam': '#fb8c00', 'xám': '#9e9e9e', 'tím': '#8e24aa',
};
const getSwatchStyle = (mauSac) => {
  const key = (mauSac || '').toLowerCase().trim();
  const bg  = colorMap[key] || '#cccccc';
  return {
    background: bg,
    width: '14px', height: '14px',
    borderRadius: '50%',
    border: '1px solid rgba(0,0,0,0.15)',
    display: 'inline-block', flexShrink: '0',
  };
};

// ── Fetch ──
const fetchCategories = async () => {
  try { categories.value = await adminProductService.getCategories(); }
  catch { /* silent */ }
};

const fetchProductDetails = async () => {
  try {
    const id = route.params.id;
    const [data, flashRes] = await Promise.allSettled([
      adminProductService.getProductById(id),
      axios.get(`${API_BASE}/api/khuyen-mai-flash`)
    ]);

    const productData = data.value;

    if (flashRes.status === 'fulfilled') {
      (flashRes.value.data || [])
        .filter(f => f.trangThaiHienThi === 'Đang diễn ra')
        .forEach(f => flashMap.value.set(Number(f.chiTietSanPhamId), f.phanTramGiamGia || 0));
    }

    if (productData.danhMucId && categories.value.length > 0) {
      const match = categories.value.find(c => c.id == productData.danhMucId);
      if (match) productData.danhMuc = match.name;
    }

    product.value = productData;

    const imgs = productData.danhSachAnh?.length
      ? productData.danhSachAnh
      : productData.anhChinh ? [productData.anhChinh]
      : productData.anhSanPham ? [productData.anhSanPham] : [];
    selectedImage.value = imgs.length ? getImageUrl(imgs[0]) : '';
  } catch (err) {
    console.error('Lỗi tải chi tiết sản phẩm:', err);
    alert('Không tìm thấy sản phẩm!');
    router.push('/products');
  }
};

onMounted(async () => {
  await fetchCategories();
  await fetchProductDetails();
});
</script>

<style scoped>
.font-general { font-family: 'Quicksand', sans-serif !important; }
.text-main-brown { color: #4A3018 !important; }
.btn-vipep-green { background-color: #5b8e1d; border-color: #5b8e1d; }
.btn-vipep-green:hover { background-color: #4a7516; }

/* Flash pulse animation */
@keyframes flash-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.75; }
}
.flash-pulse { animation: flash-pulse 1.6s ease-in-out infinite; }

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

/* Main image */
.main-img-wrap {
  min-height: 320px;
  border: 1px solid #e9ecef;
  overflow: hidden;
}

/* Thumbnails */
.thumb-item {
  width: 72px; height: 72px;
  cursor: pointer;
  border: 2px solid #e9ecef;
  opacity: 0.6;
  transition: all 0.2s;
}
.thumb-item:hover { opacity: 1; border-color: #aaa; }
.thumb-active     { opacity: 1 !important; border-color: #5b8e1d !important; }

/* Info pills */
.info-pill {
  background: #f0f4eb;
  color: #4a6620;
  border-radius: 20px;
  padding: 3px 10px;
  font-size: 0.78rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
}
.info-pill-sm {
  background: #f0f4eb;
  color: #4a6620;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 0.72rem;
  font-weight: 600;
}

/* Color swatch */
.color-swatch {
  width: 12px; height: 12px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.15);
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}

/* Price block */
.price-block { background: #f8f9fa; border: 1px solid #e9ecef; }

/* Preview popup */
.preview-popup {
  background: #fff;
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
.preview-btn--call { background: linear-gradient(135deg, #28a745, #20c997); color: #fff; }
.preview-btn--zalo { background: linear-gradient(135deg, #0068ff, #00a8ff); color: #fff; }

/* Badge Liên hệ trong bảng biến thể */
.lien-he-badge-sm {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #92400e;
  white-space: nowrap;
  display: inline-block;
}

/* Info rows */
.info-row {
  display: flex;
  align-items: flex-start;
  padding: 10px 12px;
  font-size: 0.88rem;
}
.info-row--alt { background: #f8f9fa; border-radius: 6px; }
.info-row__label {
  min-width: 180px;
  font-weight: 700;
  color: #6c757d;
  flex-shrink: 0;
}
.info-row__value { color: #2d2d2d; }
@media (max-width: 576px) {
  .info-row { flex-direction: column; gap: 2px; }
  .info-row__label { min-width: unset; }
}

/* Variant table */
.variant-header {
  display: grid;
  grid-template-columns: 52px 100px 120px 90px 90px 100px 110px 90px 90px;
  gap: 8px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #999;
  text-transform: uppercase;
  padding: 0 4px 8px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 6px;
}
.variant-row {
  display: grid;
  grid-template-columns: 52px 100px 120px 90px 90px 100px 110px 90px 90px;
  gap: 8px;
  align-items: center;
  padding: 8px 4px;
  font-size: 0.85rem;
  border-bottom: 1px solid #f8f8f8;
  transition: background 0.15s;
}
.variant-row:hover { background: #fafffe; border-radius: 8px; }

/* Highlight row đang flash sale */
.variant-row--flash {
  background: #fff5f5;
  border-left: 3px solid #dc3545;
  border-radius: 0 8px 8px 0;
}
.variant-row--flash:hover { background: #ffe8e8; }

@media (max-width: 991px) {
  .variant-header { display: none; }
  .variant-row,
  .variant-row--no-price {
    grid-template-columns: 52px 1fr 1fr;
    border: 1px solid #f0f0f0;
    border-radius: 10px;
    margin-bottom: 8px;
    padding: 10px;
    gap: 6px;
  }
  .variant-row--flash {
    border-left: 3px solid #dc3545 !important;
  }
}

.variant-thumb {
  width: 48px; height: 48px;
  font-size: 1rem;
  flex-shrink: 0;
}

/* Combo items */
.combo-item-row { transition: background 0.15s; }
.combo-item-row:hover { background: #f2faeb !important; }
.combo-thumb {
  width: 44px; height: 44px;
  border: 1px solid #e9ecef;
  flex-shrink: 0;
}

/* Scrollbar thumbnails */
.custom-scrollbar::-webkit-scrollbar { height: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #888; }
</style>