<template>
  <div class="lector-products font-general p-3 p-md-4" style="min-height: 100vh; background-color: #f8f9fa;">
    <!-- HEADER -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
      <div>
        <h4 class="fw-bold mb-1 text-dark">Kho Hàng & Sản Phẩm</h4>
        <p class="text-muted small mb-0">Quản lý danh sách sản phẩm và theo dõi tồn kho</p>
      </div>
      <div class="d-flex gap-2">
        <button v-if="selectedProducts.length > 0" @click="bulkDelete"
          class="btn btn-danger text-white rounded-pill px-4 py-2 fw-medium shadow-sm hover-lift d-flex align-items-center gap-2">
          <i class="bi bi-trash"></i> Xóa ({{ selectedProducts.length }})
        </button>
        <router-link to="/products/add"
          class="btn add-btn text-white rounded-pill px-4 py-2 fw-medium shadow-sm hover-lift d-flex align-items-center gap-2 text-decoration-none">
          <i class="bi bi-plus-lg"></i> Thêm sản phẩm
        </router-link>
      </div>
    </div>

    <div class="bg-white rounded-4 shadow-sm p-4">
      <!-- FILTER ROW -->
      <div class="d-flex flex-column flex-md-row gap-3 justify-content-between mb-4">
        <div class="input-group" style="max-width: 350px;">
          <span class="input-group-text bg-light border-end-0 rounded-start-pill text-muted"><i class="bi bi-search"></i></span>
          <input type="text" class="form-control bg-light border-start-0 rounded-end-pill shadow-none"
            v-model="searchQuery" @keyup.enter="handleSearch" placeholder="Tìm tên, SKU sản phẩm...">
        </div>
        <div class="d-flex gap-2 flex-wrap">
          <select class="form-select bg-light border-0 rounded-pill shadow-none fw-medium text-muted w-auto px-3"
            v-model="selectedStatus" @change="handleFilter">
            <option value="">Tất cả trạng thái</option>
            <option value="true">Đang kinh doanh</option>
            <option value="false">Ngừng kinh doanh</option>
          </select>
          <select class="form-select bg-light border-0 rounded-pill shadow-none fw-medium text-muted w-auto px-3"
            v-model="selectedCategory" @change="handleFilter">
            <option value="">Tất cả danh mục</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
      </div>

      <!-- TABLE -->
      <div class="table-responsive">
        <table class="table align-middle table-hover mb-0">
          <thead class="bg-light text-muted text-uppercase" style="font-size: 0.75rem; letter-spacing: 0.5px;">
            <tr>
              <th class="py-3 px-3 border-0" style="width:40px;">
                <input class="form-check-input" type="checkbox" @change="toggleAll" :checked="isAllSelected">
              </th>
              <th class="py-3 border-0" style="width:44px;">STT</th>
              <th class="py-3 border-0">Sản Phẩm</th>
              <th class="py-3 border-0">SKU / Biến thể</th>
              <th class="py-3 border-0">Giá bán / Liên hệ</th>
              <th class="py-3 border-0 text-center">Tồn kho</th>
              <th class="py-3 border-0 text-center">Trạng thái</th>
              <th class="py-3 px-3 border-0 text-end">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <!-- Loading -->
            <tr v-if="isLoading">
              <td colspan="8" class="text-center py-5">
                <div class="spinner-border text-success" role="status"></div>
                <div class="mt-2 text-muted small">Đang tải dữ liệu...</div>
              </td>
            </tr>
            <!-- Empty -->
            <tr v-else-if="products.length === 0">
              <td colspan="8" class="text-center py-5 text-muted">
                <i class="bi bi-box-seam fs-2 d-block mb-2 opacity-50"></i>
                Không tìm thấy sản phẩm nào.
              </td>
            </tr>
            <!-- Rows -->
            <tr v-else v-for="(product, index) in products" :key="product.id">
              <!-- Checkbox -->
              <td class="px-3">
                <input class="form-check-input" type="checkbox" :value="product.id" v-model="selectedProducts">
              </td>
              <!-- STT -->
              <td class="fw-medium text-muted">{{ (currentPage - 1) * pageSize + index + 1 }}</td>

              <!-- Sản phẩm -->
              <td class="px-2 py-3">
                <div class="d-flex align-items-center gap-3">
                  <div class="product-img-box border bg-white rounded-3 d-flex align-items-center justify-content-center overflow-hidden shadow-sm flex-shrink-0"
                    style="width:52px;height:52px;">
                    <img v-if="getProductImage(product)" :src="getProductImage(product)" style="width:100%;height:100%;object-fit:cover;">
                    <i v-else class="bi bi-image fs-4 text-muted opacity-50"></i>
                  </div>
                  <div style="min-width:0;">
                    <div class="d-flex align-items-center gap-1 flex-wrap mb-1">
                      <h6 class="mb-0 fw-bold text-dark text-truncate" style="font-size:0.88rem;max-width:220px;">
                        {{ product.tenSanPham }}
                      </h6>
                      <span v-if="product.laCombo" class="badge bg-warning-subtle text-warning rounded-pill" style="font-size:0.7rem;">
                        <i class="bi bi-box-seam me-1"></i>Combo
                      </span>
                      <!-- Badge Liên hệ đã bỏ — cột giá đã hiển thị rồi -->
                    </div>
                    <div class="d-flex align-items-center gap-2 flex-wrap">
                      <span class="text-muted" style="font-size:0.78rem;">{{ getCategoryName(product) }}</span>
                      <span v-if="product.thuongHieu" class="text-muted" style="font-size:0.78rem;">
                        · {{ product.thuongHieu }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- SKU / Biến thể -->
              <td style="min-width:110px;">
                <template v-if="hasVariants(product)">
                  <span class="variant-chip">
                    <i class="bi bi-sliders me-1"></i>{{ getRealVariantCount(product) }} biến thể
                  </span>
                </template>
                <template v-else>
                  <span class="font-monospace text-muted small">{{ product.maSku || '---' }}</span>
                </template>
              </td>

              <!-- Giá bán / Liên hệ -->
              <td style="white-space:nowrap;">
                <template v-if="product.lienHe">
                  <span class="lien-he-chip">
                    <i class="bi bi-telephone-fill me-1"></i>Liên hệ
                  </span>
                </template>
             <!-- Multi variant -->
<template v-else-if="hasVariants(product)">
  <div class="d-flex flex-column">
    <div>
      <span class="fw-bold text-danger">{{ formatPrice(getMinPrice(product)) }}</span>
      <span v-if="getMaxPrice(product) !== getMinPrice(product)" class="text-muted small">
        &nbsp;–&nbsp;{{ formatPrice(getMaxPrice(product)) }}
      </span>
      <span class="text-muted small">đ</span>
    </div>
    <span v-if="product.flashPercent" class="badge bg-danger mt-1 w-auto" style="font-size:0.65rem;">
      🔥 Flash -{{ product.flashPercent }}%
    </span>
  </div>
</template>

<!-- Single variant -->
<template v-else>
  <div class="d-flex flex-column">
    <span v-if="product.giaGoc && product.giaGoc > product.giaBan"
          class="text-muted text-decoration-line-through"
          style="font-size:0.75rem; line-height:1.2;">
      {{ formatPrice(product.giaGoc) }}đ
    </span>
    <span class="fw-bold"
          :class="product.giaGoc && product.giaGoc > product.giaBan ? 'text-danger' : 'text-dark'">
      {{ formatPrice(product.giaBan) }}đ
    </span>
    <span v-if="product.flashPercent" class="badge bg-danger mt-1 w-auto" style="font-size:0.65rem;">
      🔥 Flash -{{ product.flashPercent }}%
    </span>
  </div>
</template>
              </td>
              <!-- Tồn kho -->
              <td class="text-center">
                <span class="fw-bold" :class="stockColor(getTotalStock(product))">
                  {{ getTotalStock(product) }}
                </span>
              </td>

              <!-- Trạng thái -->
              <td class="text-center">
                <span class="badge rounded-pill fw-medium px-3 py-2"
                  :class="getStatusInfo(product).class">
                  {{ getStatusInfo(product).text }}
                </span>
              </td>

              <!-- Thao tác -->
              <td class="px-3 text-end">
                <div class="d-flex justify-content-end gap-1">
                  <button @click="$router.push(`/products/detail/${product.id}`)"
                    class="btn btn-sm btn-light rounded-circle text-info" title="Xem chi tiết">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button @click="$router.push(`/products/edit/${product.id}`)"
                    class="btn btn-sm btn-light rounded-circle text-primary" title="Sửa">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button @click="deleteProduct(product.id)"
                    class="btn btn-sm btn-light rounded-circle text-danger" title="Xóa">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINATION -->
      <nav v-if="totalPages > 1" class="mt-4 d-flex justify-content-between align-items-center border-top pt-4">
        <div class="text-muted small fw-medium">
          Trang <span class="text-dark">{{ currentPage }}</span> / {{ totalPages }}
        </div>
        <ul class="pagination custom-pagination mb-0">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link prev-next" @click="changePage(currentPage - 1)">
              <i class="bi bi-chevron-left"></i>
            </button>
          </li>
          <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
            <button class="page-link page-number" @click="changePage(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link prev-next" @click="changePage(currentPage + 1)">
              <i class="bi bi-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated } from 'vue';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import { adminProductService } from '@/services/productService';
import { API_BASE } from '@/config/api';

const toast = useToast();

const products         = ref([]);
const categories       = ref([]);
const isLoading        = ref(false);
const searchQuery      = ref('');
const selectedCategory = ref('');
const selectedStatus   = ref('');
const currentPage      = ref(1);
const totalPages       = ref(1);
const pageSize         = ref(10);
const selectedProducts = ref([]);

// ── Checkbox all ──
const isAllSelected = computed(() =>
  products.value.length > 0 && selectedProducts.value.length === products.value.length
);
const toggleAll = (e) => {
  selectedProducts.value = e.target.checked ? products.value.map(p => p.id) : [];
};

// ── Helpers biến thể ──
// Biến thể thực = soLuongBienThe - số placeholder combo (soLuongComboItem)
const getRealVariantCount = (p) => {
  const total = p.soLuongBienThe || 0;
  const comboItems = p.laCombo ? (p.soLuongComboItem || 0) : 0;
  return Math.max(0, total - comboItems);
};
const hasVariants   = (p) => getRealVariantCount(p) > 1;
const getTotalStock = (p) => Number(p.tonKho) || 0;
const getMinPrice = (p) => Number(p.giaBan) || 0;
const getMaxPrice = (p) => Number(p.giaBanMax) || Number(p.giaBan) || 0;
// ── Helpers hiển thị ──
const getCategoryName = (p) => p.danhMuc || 'Chưa phân loại';

const getProductImage = (p) => {
  const path = p.anhSanPham || p.anhChinh || p.danhSachAnh?.[0] || null;
  if (!path) return null;
  if (path.startsWith('http') || path.startsWith('blob:')) return path;
  if (path.startsWith('/uploads/')) return `${API_BASE}${path}`;
  return `${API_BASE}/uploads/${path}`;
};

const getStatusInfo = (p) => {
  const trangThai = p.trangThai;
  if (trangThai === false || trangThai === 'false')
    return { text: 'Ngừng kinh doanh', class: 'bg-secondary-subtle text-secondary' };

  const stock = getTotalStock(p);

  if (p.lienHe)
    return { text: 'Đang kinh doanh', class: 'bg-success-subtle text-success' };

  if (stock <= 0)  return { text: 'Hết hàng',     class: 'bg-danger-subtle text-danger' };
  if (stock <= 10) return { text: 'Sắp hết hàng', class: 'bg-warning-subtle text-warning' };
  return { text: 'Đang kinh doanh', class: 'bg-success-subtle text-success' };
};

const formatPrice = (n) => Number(n || 0).toLocaleString('vi-VN');
const stockColor  = (n) => n <= 0 ? 'text-danger' : n <= 15 ? 'text-warning' : 'text-success';

// ── Fetch ──
const fetchCategories = async () => {
  try { categories.value = await adminProductService.getCategories(); }
  catch (e) { console.error('Lỗi tải danh mục:', e); }
};

const fetchProducts = async (isFilter = false) => {
  isLoading.value = true;
  try {
    const [data, flashRes] = await Promise.allSettled([
      adminProductService.getProducts(
        currentPage.value, pageSize.value,
        searchQuery.value, selectedCategory.value, selectedStatus.value
      ),
      axios.get(`${API_BASE}/api/khuyen-mai-flash`)
    ]);

    // Build flash map: chiTietSanPhamId → phanTramGiamGia
    const flashMap = new Map();
    if (flashRes.status === 'fulfilled') {
      (flashRes.value.data || [])
        .filter(f => f.trangThaiHienThi === 'Đang diễn ra')
        .forEach(f => flashMap.set(Number(f.chiTietSanPhamId), f.phanTramGiamGia || 0));
    }

    const content = data.status === 'fulfilled' ? (data.value.content || []) : [];
    totalPages.value = data.status === 'fulfilled' ? (data.value.totalPages || 1) : 1;

   products.value = content.map(p => {
  const realVariantCount = (() => {
    const total = p.soLuongBienThe || 0;
    const comboItems = p.laCombo ? (p.soLuongComboItem || 0) : 0;
    return Math.max(0, total - comboItems);
  })();
  const isMultiVariant = realVariantCount > 1;

if (isMultiVariant) {
  const chiTietIds = p.chiTietSanPhams?.map(ct => ct.id) || [];
  const flashPercents = chiTietIds
    .map(id => flashMap.get(Number(id)) || 0)
    .filter(v => v > 0);
  const maxFlash = flashPercents.length ? Math.max(...flashPercents) : 0;
  return maxFlash > 0 ? { ...p, flashPercent: maxFlash } : p;
}

// Single variant
const chiTietId = p.chiTietId ||
  (p.chiTietSanPhams?.length ? p.chiTietSanPhams[0].id : null);
const flashPercent = chiTietId ? (flashMap.get(Number(chiTietId)) || 0) : 0;
if (flashPercent > 0) {
  const giaGoc = p.giaBan || 0;
  return {
    ...p,
    giaBan: Math.round(giaGoc * (1 - flashPercent / 100)),
    giaGoc,
    flashPercent,
  };
}
return p;
});

    if (isFilter && products.value.length === 0) toast.warning('Không tìm thấy sản phẩm phù hợp!');
  } catch {
    toast.error('Lỗi kết nối Server!');
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = () => { currentPage.value = 1; fetchProducts(true); };
const handleFilter = () => { currentPage.value = 1; fetchProducts(true); };

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const deleteProduct = async (id) => {
  if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
  try {
    await adminProductService.deleteProduct(id);
    toast.success('Xóa thành công!');
    fetchProducts();
  } catch { toast.error('Không thể xóa sản phẩm này!'); }
};

const bulkDelete = async () => {
  if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedProducts.value.length} sản phẩm?`)) return;
  try {
    await adminProductService.bulkDeleteProducts(selectedProducts.value);
    toast.success('Đã xóa các sản phẩm được chọn!');
    selectedProducts.value = [];
    fetchProducts();
  } catch { toast.error('Lỗi khi xóa hàng loạt!'); }
};

onMounted(() => { fetchCategories(); fetchProducts(); });
onActivated(() => { fetchProducts(); });
</script>

<style scoped>
.font-general { font-family: 'Quicksand', sans-serif !important; }

.add-btn { background-color: #5b8e1d; border: none; }
.add-btn:hover { background-color: #4a7516; transform: translateY(-1px); }
.hover-lift { transition: all 0.2s ease; }
.hover-lift:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }

.table thead th { font-weight: 700; color: #6c757d; }
.form-check-input:checked { background-color: #5b8e1d; border-color: #5b8e1d; }

.variant-chip {
  display: inline-flex;
  align-items: center;
  background: #f0f4eb;
  color: #4a6620;
  border-radius: 20px;
  padding: 2px 10px;
  font-size: 0.75rem;
  font-weight: 600;
}

.lien-he-chip {
  display: inline-flex;
  align-items: center;
  background: #fffbeb;
  color: #92400e;
  border: 1px solid #fde68a;
  border-radius: 20px;
  padding: 2px 10px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.custom-pagination { gap: 6px; }
.custom-pagination .page-link {
  border: none;
  background-color: #f1f3f5;
  color: #5b8e1d;
  font-weight: 700;
  width: 38px; height: 38px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 10px !important;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}
.custom-pagination .page-item.active .page-link {
  background-color: #5b8e1d;
  color: white;
  box-shadow: 0 4px 10px rgba(91, 142, 29, 0.3);
}
.custom-pagination .page-link:hover:not(.active) { background-color: #e9ecef; transform: translateY(-2px); }
.custom-pagination .prev-next { background-color: white; border: 1px solid #dee2e6 !important; }
</style>