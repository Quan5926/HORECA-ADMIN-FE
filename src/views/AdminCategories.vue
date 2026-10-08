<template>
  <div class="cat-page">

    <!-- ══ TOAST ══ -->
    <div class="toast-wrap">
      <transition-group name="toast-slide">
        <div v-for="t in toasts" :key="t.id" class="toast-item" :class="t.type">
          <i class="bi" :class="t.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'"></i>
          <span>{{ t.message }}</span>
          <button @click="removeToast(t.id)"><i class="bi bi-x"></i></button>
        </div>
      </transition-group>
    </div>

    <!-- ══ HEADER ══ -->
    <div class="page-header">
      <div>
        <div class="breadcrumb-row">
          <router-link to="/">Tổng quan</router-link>
          <i class="bi bi-chevron-right"></i>
          <span>Danh mục</span>
        </div>
        <h4 class="page-title">Quản lý Danh mục</h4>
      </div>
      <div class="header-stats">
        <div class="stat-pill"><i class="bi bi-grid-3x3-gap-fill"></i> {{ categories.length }} danh mục</div>
        <div class="stat-pill accent"><i class="bi bi-diagram-3-fill"></i> {{ rootCategories.length }} gốc · {{ categories.length - rootCategories.length }} con</div>
      </div>
    </div>

    <div class="main-grid">

      <!-- ══ LEFT: TABLE ══ -->
      <div class="card-panel">

        <div class="table-toolbar">
          <div class="toolbar-left">
            <div class="search-box">
              <i class="bi bi-search"></i>
              <input v-model="searchQuery" placeholder="Tìm tên danh mục..." />
              <button v-if="searchQuery" @click="searchQuery = ''"><i class="bi bi-x-circle-fill"></i></button>
            </div>
            <div class="view-toggle">
              <button :class="{ active: viewMode === 'flat' }" @click="viewMode = 'flat'" title="Danh sách phẳng">
                <i class="bi bi-list-ul"></i>
              </button>
              <button :class="{ active: viewMode === 'tree' }" @click="viewMode = 'tree'" title="Dạng cây">
                <i class="bi bi-diagram-3"></i>
              </button>
            </div>
          </div>
          <transition name="fade">
            <button v-if="selectedIds.length > 0" @click="confirmBulkDelete" class="btn-bulk-delete">
              <i class="bi bi-trash3-fill"></i> Xóa {{ selectedIds.length }} mục
            </button>
          </transition>
        </div>

        <!-- FLAT VIEW -->
        <div v-if="viewMode === 'flat'" class="table-wrap">
          <table class="cat-table">
            <thead>
              <tr>
                <th style="width:40px">
                  <input type="checkbox" class="chk" v-model="selectAll">
                </th>
                <th>Danh mục</th>
                <th class="tc">Cấp / Cha</th>
                <th class="tc">Số SP</th>
                <th class="tc">Trạng thái</th>
                <th class="tr">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="paginatedCategories.length === 0">
                <td colspan="6" class="empty-row">
                  <i class="bi bi-inbox-fill"></i>
                  <span>Không tìm thấy danh mục nào</span>
                </td>
              </tr>
              <tr v-for="cat in paginatedCategories" :key="cat.id" :class="{ selected: selectedIds.includes(cat.id), 'is-child': !!cat.parentId }">
                <td><input type="checkbox" class="chk" :value="cat.id" v-model="selectedIds"></td>
                <td>
                  <div class="cat-cell">
                    <!-- Level indicator -->
                    <div v-if="cat.parentId" class="level-indent">
                      <span class="level-line"></span>
                    </div>
                    <div class="cat-thumb">
                      <img v-if="cat.image" :src="cat.image" alt="" />
                      <i v-else class="bi bi-grid-fill"></i>
                    </div>
                    <div class="cat-info">
                      <span class="cat-name">
                        <span v-if="cat.parentId" class="child-tag">Cấp 2</span>
                        {{ cat.name }}
                      </span>
                      <span class="cat-desc">{{ cat.desc || '—' }}</span>
                    </div>
                  </div>
                </td>
                <td class="tc">
                  <span v-if="cat.parentId" class="parent-badge">
                    <i class="bi bi-arrow-return-right"></i>
                    {{ getParentName(cat.parentId) }}
                  </span>
                  <span v-else class="root-badge"><i class="bi bi-star-fill"></i> Gốc</span>
                </td>
                <td class="tc"><span class="count-badge">{{ cat.count }}</span></td>
                <td class="tc">
                  <span class="status-dot" :class="cat.status ? 'on' : 'off'">
                    {{ cat.status ? 'Hiển thị' : 'Ẩn' }}
                  </span>
                </td>
                <td class="tr">
                  <div class="action-btns">
                    <button @click="editCategory(cat)" class="btn-edit" title="Sửa"><i class="bi bi-pencil-fill"></i></button>
                    <button @click="deleteCategory(cat.id)" class="btn-del" title="Xóa"><i class="bi bi-trash3-fill"></i></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- TREE VIEW -->
        <div v-else class="tree-view">
          <div v-if="filteredTreeCategories.length === 0" class="empty-row">
            <i class="bi bi-inbox-fill"></i><span>Không có dữ liệu</span>
          </div>
          <div v-for="root in filteredTreeCategories" :key="root.id" class="tree-root">
            <div class="tree-node root-node" :class="{ selected: selectedIds.includes(root.id) }">
              <input type="checkbox" class="chk" :value="root.id" v-model="selectedIds">
              <div class="tree-thumb">
                <img v-if="root.image" :src="root.image" alt="" />
                <i v-else class="bi bi-grid-fill"></i>
              </div>
              <div class="tree-info">
                <span class="tree-name">{{ root.name }}</span>
                <span class="tree-meta">{{ root.count }} sản phẩm · {{ root.desc || 'Không mô tả' }}</span>
              </div>
              <span class="status-dot" :class="root.status ? 'on' : 'off'">{{ root.status ? 'Hiển thị' : 'Ẩn' }}</span>
              <div class="action-btns">
                <button @click="editCategory(root)" class="btn-edit"><i class="bi bi-pencil-fill"></i></button>
                <button @click="deleteCategory(root.id)" class="btn-del"><i class="bi bi-trash3-fill"></i></button>
              </div>
            </div>

            <!-- Children -->
            <div v-if="getChildren(root.id).length > 0" class="tree-children">
              <div v-for="child in getChildren(root.id)" :key="child.id" class="tree-node child-node" :class="{ selected: selectedIds.includes(child.id) }">
                <div class="tree-connector"><span></span></div>
                <input type="checkbox" class="chk" :value="child.id" v-model="selectedIds">
                <div class="tree-thumb small">
                  <img v-if="child.image" :src="child.image" alt="" />
                  <i v-else class="bi bi-tag-fill"></i>
                </div>
                <div class="tree-info">
                  <span class="tree-name">{{ child.name }}</span>
                  <span class="tree-meta">{{ child.count }} sản phẩm · {{ child.desc || 'Không mô tả' }}</span>
                </div>
                <span class="status-dot" :class="child.status ? 'on' : 'off'">{{ child.status ? 'Hiển thị' : 'Ẩn' }}</span>
                <div class="action-btns">
                  <button @click="editCategory(child)" class="btn-edit"><i class="bi bi-pencil-fill"></i></button>
                  <button @click="deleteCategory(child.id)" class="btn-del"><i class="bi bi-trash3-fill"></i></button>
                </div>

                <!-- Grandchildren (cấp 3) -->
                <div v-if="getChildren(child.id).length > 0" class="tree-children grand">
                  <div v-for="grand in getChildren(child.id)" :key="grand.id" class="tree-node grand-node" :class="{ selected: selectedIds.includes(grand.id) }">
                    <div class="tree-connector grand-c"><span></span></div>
                    <input type="checkbox" class="chk" :value="grand.id" v-model="selectedIds">
                    <div class="tree-thumb xsmall">
                      <img v-if="grand.image" :src="grand.image" alt="" />
                      <i v-else class="bi bi-tag"></i>
                    </div>
                    <div class="tree-info">
                      <span class="tree-name small">{{ grand.name }}</span>
                      <span class="tree-meta">{{ grand.count }} SP</span>
                    </div>
                    <span class="status-dot" :class="grand.status ? 'on' : 'off'">{{ grand.status ? 'Hiển thị' : 'Ẩn' }}</span>
                    <div class="action-btns">
                      <button @click="editCategory(grand)" class="btn-edit"><i class="bi bi-pencil-fill"></i></button>
                      <button @click="deleteCategory(grand.id)" class="btn-del"><i class="bi bi-trash3-fill"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- PAGINATION (only flat view) -->
        <div v-if="viewMode === 'flat' && totalPages > 1" class="pagination-row">
          <span class="page-info">{{ startIndex + 1 }}–{{ Math.min(endIndex, filteredCategories.length) }} / {{ filteredCategories.length }}</span>
          <div class="page-btns">
            <button :disabled="currentPage === 1" @click="currentPage--"><i class="bi bi-chevron-left"></i></button>
            <button v-for="p in totalPages" :key="p" :class="{ active: currentPage === p }" @click="currentPage = p">{{ p }}</button>
            <button :disabled="currentPage === totalPages" @click="currentPage++"><i class="bi bi-chevron-right"></i></button>
          </div>
        </div>
      </div>

      <!-- ══ RIGHT: FORM ══ -->
      <div class="form-panel">
        <div class="form-header">
          <div class="form-icon" :class="isEditing ? 'edit' : 'add'">
            <i class="bi" :class="isEditing ? 'bi-pencil-fill' : 'bi-plus-lg'"></i>
          </div>
          <div>
            <div class="form-title">{{ isEditing ? 'Cập nhật danh mục' : 'Thêm danh mục mới' }}</div>
            <div class="form-sub">{{ isEditing ? 'Chỉnh sửa thông tin' : 'Điền đầy đủ thông tin bên dưới' }}</div>
          </div>
        </div>

        <form @submit.prevent="saveCategory" class="cat-form">

          <!-- Tên -->
          <div class="field">
            <label>Tên danh mục <span class="req">*</span></label>
            <input type="text" v-model="form.name" placeholder="VD: Ly Cốc" required />
          </div>

          <!-- Danh mục cha -->
          <div class="field">
            <label>Danh mục cha</label>
            <select v-model="form.parentId">
              <option :value="null">— Không có (Danh mục gốc) —</option>
              <optgroup label="Danh mục gốc">
                <option v-for="p in rootParentOptions" :key="p.id" :value="p.id">{{ p.name }}</option>
              </optgroup>
              <optgroup label="Danh mục cấp 2" v-if="level2ParentOptions.length > 0">
                <option v-for="p in level2ParentOptions" :key="p.id" :value="p.id">↳ {{ p.name }}</option>
              </optgroup>
            </select>
            <div class="field-hint" v-if="form.parentId">
              <i class="bi bi-info-circle"></i>
              Danh mục này sẽ là con của <strong>{{ getParentName(form.parentId) }}</strong>
            </div>
          </div>

          <!-- Mô tả ngắn -->
          <div class="field">
            <label>Mô tả ngắn</label>
            <textarea v-model="form.desc" rows="2" placeholder="Mô tả ngắn gọn..." maxlength="150"></textarea>
            <div class="char-count">{{ (form.desc || '').length }}/150</div>
          </div>

          <!-- Ảnh -->
          <div class="field">
            <label>Ảnh đại diện</label>
            <div class="upload-zone" :class="{ 'has-img': form.imagePreview }" @click="!form.imagePreview && fileInput.click()">
              <template v-if="!form.imagePreview">
                <i class="bi bi-cloud-arrow-up-fill upload-icon"></i>
                <span class="upload-text">Click để chọn ảnh</span>
                <span class="upload-hint">PNG, JPG, WEBP · Tối đa 5MB</span>
              </template>
              <template v-else>
                <img :src="form.imagePreview" class="preview-img" alt="preview" />
                <div class="preview-overlay">
                  <button type="button" @click.stop="triggerFileChange" class="btn-change-img">
                    <i class="bi bi-arrow-repeat"></i> Đổi ảnh
                  </button>
                  <button type="button" @click.stop="removeImage" class="btn-remove-img">
                    <i class="bi bi-trash3-fill"></i> Xóa
                  </button>
                </div>
              </template>
            </div>
            <input type="file" ref="fileInput" style="display:none" @change="handleFileUpload" accept="image/*">
          </div>

          <!-- Trạng thái -->
          <div class="field">
            <label>Trạng thái</label>
            <div class="toggle-row">
              <button type="button" class="toggle-btn" :class="{ active: form.status }" @click="form.status = true">
                <i class="bi bi-eye-fill"></i> Hiển thị
              </button>
              <button type="button" class="toggle-btn" :class="{ active: !form.status }" @click="form.status = false">
                <i class="bi bi-eye-slash-fill"></i> Ẩn
              </button>
            </div>
          </div>

          <div class="form-actions">
            <button v-if="isEditing" type="button" @click="resetForm" class="btn-cancel">
              <i class="bi bi-x-circle"></i> Hủy
            </button>
            <button type="submit" class="btn-save" :disabled="saving">
              <span v-if="saving"><i class="bi bi-hourglass-split"></i> Đang lưu...</span>
              <span v-else><i class="bi" :class="isEditing ? 'bi-check2-circle' : 'bi-plus-circle-fill'"></i> {{ isEditing ? 'Cập nhật' : 'Thêm mới' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { categoryServiceAdmin as categoryService } from '@/services/categoryServiceAdmin';

// ══ TOAST ══
const toasts = ref([]);
const showToast = (message, type = 'success') => {
  const id = Date.now();
  toasts.value.push({ id, message, type });
  setTimeout(() => removeToast(id), 3500);
};
const removeToast = (id) => { toasts.value = toasts.value.filter(t => t.id !== id); };

// ══ STATE ══
const categories  = ref([]);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 8;
const selectedIds = ref([]);
const viewMode    = ref('flat');
const saving      = ref(false);
const fileInput   = ref(null);
const isEditing   = ref(false);
const editingId   = ref(null);

const form = ref({
  name: '', desc: '', status: true,
  parentId: null, imagePreview: null, rawFile: null, imageUrl: ''
});

// ══ FETCH ══
const fetchCategories = async () => {
  try {
    const data = await categoryService.getAllCategories();
    categories.value = data.map(cat => ({
      id:       cat.id,
      name:     cat.tenDanhMuc || cat.name,
      desc:     cat.moTa || cat.desc || '',
      image:    cat.anhDaiDien || cat.hinhAnh || cat.image || '',
      status:   cat.trangThai !== undefined ? cat.trangThai : (cat.status ?? true),
      count:    cat.soLuongSanPham || cat.count || 0,
      parentId: cat.danhMucChaId || cat.parentId || null,
    }));
  } catch {
    showToast('Lỗi tải dữ liệu danh mục!', 'danger');
  }
};

onMounted(fetchCategories);

// ══ HELPERS ══
const getParentName = (pid) => categories.value.find(c => c.id === pid)?.name || '?';
const getChildren   = (pid) => categories.value.filter(c => c.parentId === pid);
const rootCategories = computed(() => categories.value.filter(c => !c.parentId));

// ══ FILTER / PAGINATION ══
const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value;
  const q = searchQuery.value.toLowerCase();
  return categories.value.filter(c => c.name.toLowerCase().includes(q));
});

const filteredTreeCategories = computed(() => {
  if (!searchQuery.value) return rootCategories.value;
  const q = searchQuery.value.toLowerCase();
  return rootCategories.value.filter(root =>
    root.name.toLowerCase().includes(q) ||
    getChildren(root.id).some(c => c.name.toLowerCase().includes(q))
  );
});

watch(searchQuery, () => { currentPage.value = 1; });

const totalPages  = computed(() => Math.ceil(filteredCategories.value.length / itemsPerPage));
const startIndex  = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex    = computed(() => startIndex.value + itemsPerPage);
const paginatedCategories = computed(() => filteredCategories.value.slice(startIndex.value, endIndex.value));

// ══ SELECT ALL ══
const selectAll = computed({
  get: () => paginatedCategories.value.length > 0 && selectedIds.value.length === paginatedCategories.value.length,
  set: (v) => { selectedIds.value = v ? paginatedCategories.value.map(c => c.id) : []; }
});

// ══ PARENT OPTIONS (phân cấp rõ ràng) ══
const rootParentOptions = computed(() => {
  const roots = categories.value.filter(c => !c.parentId);
  return isEditing.value ? roots.filter(c => c.id !== editingId.value) : roots;
});

const level2ParentOptions = computed(() => {
  const level2 = categories.value.filter(c => {
    if (!c.parentId) return false;
    const parent = categories.value.find(p => p.id === c.parentId);
    return parent && !parent.parentId; // cha của c là gốc → c là cấp 2
  });
  return isEditing.value ? level2.filter(c => c.id !== editingId.value) : level2;
});

// ══ CRUD ══
const deleteCategory = async (id) => {
  if (!confirm('Xóa danh mục này?')) return;
  try {
    await categoryService.deleteCategory(id);
    showToast('Đã xóa danh mục!');
    selectedIds.value = selectedIds.value.filter(i => i !== id);
    fetchCategories();
  } catch (e) {
    showToast(e.response?.data || 'Lỗi khi xóa!', 'danger');
  }
};

const confirmBulkDelete = async () => {
  if (!confirm(`Xóa ${selectedIds.value.length} danh mục đã chọn?`)) return;
  try {
    await Promise.all(selectedIds.value.map(id => categoryService.deleteCategory(id)));
    showToast('Đã xóa các mục!');
    selectedIds.value = [];
    fetchCategories();
  } catch { showToast('Lỗi xóa nhiều!', 'danger'); }
};

const editCategory = (cat) => {
  isEditing.value  = true;
  editingId.value  = cat.id;
  form.value = { name: cat.name, desc: cat.desc, status: cat.status, parentId: cat.parentId || null, imagePreview: cat.image || null, rawFile: null, imageUrl: cat.image || '' };
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const resetForm = () => {
  isEditing.value = false; editingId.value = null;
  form.value = { name: '', desc: '', status: true, parentId: null, imagePreview: null, rawFile: null, imageUrl: '' };
  if (fileInput.value) fileInput.value.value = '';
};

const handleFileUpload = (e) => {
  const f = e.target.files[0];
  if (!f) return;
  if (f.size > 5 * 1024 * 1024) { showToast('Ảnh quá lớn (tối đa 5MB)!', 'danger'); return; }
  form.value.rawFile = f;
  form.value.imagePreview = URL.createObjectURL(f);
};

const triggerFileChange = () => { if (fileInput.value) fileInput.value.click(); };

const removeImage = () => {
  form.value.imagePreview = null; form.value.rawFile = null; form.value.imageUrl = '';
  if (fileInput.value) fileInput.value.value = '';
};

const saveCategory = async () => {
  saving.value = true;
  try {
    let imgUrl = form.value.imageUrl;
    if (form.value.rawFile) imgUrl = await categoryService.uploadImage(form.value.rawFile);

    const payload = {
      tenDanhMuc:  form.value.name,
      moTa:        form.value.desc,
      trangThai:   form.value.status,
      anhDaiDien:  imgUrl,
      danhMucChaId: form.value.parentId,
    };

    if (isEditing.value) {
      await categoryService.updateCategory(editingId.value, payload);
      showToast('Cập nhật thành công!');
    } else {
      await categoryService.createCategory(payload);
      showToast('Thêm danh mục thành công!');
    }
    resetForm();
    await fetchCategories();
  } catch { showToast('Lỗi khi lưu!', 'danger'); }
  finally { saving.value = false; }
};
</script>

<style scoped>
/* ══ BASE ══ */
.cat-page {
  font-family: 'Quicksand', sans-serif;
  padding: 24px;
  background: #f4f6f9;
  min-height: 100vh;
  color: #1e2433;
}

/* ══ TOAST ══ */
.toast-wrap { position: fixed; top: 16px; right: 16px; z-index: 9999; display: flex; flex-direction: column; gap: 8px; }
.toast-item {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px; border-radius: 12px; font-size: 13.5px; font-weight: 600;
  box-shadow: 0 4px 20px rgba(0,0,0,.15); min-width: 260px;
  animation: slideIn .3s ease;
}
.toast-item.success { background: #1a7f4b; color: #fff; }
.toast-item.danger  { background: #c0392b; color: #fff; }
.toast-item button  { margin-left: auto; background: none; border: none; color: inherit; cursor: pointer; font-size: 16px; }
.toast-slide-enter-active { animation: slideIn .3s ease; }
.toast-slide-leave-active { animation: slideIn .3s ease reverse; }
@keyframes slideIn { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }

/* ══ PAGE HEADER ══ */
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.breadcrumb-row { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #8a94a6; margin-bottom: 4px; }
.breadcrumb-row a { color: #8a94a6; text-decoration: none; }
.breadcrumb-row a:hover { color: #5b8e1d; }
.page-title { font-size: 22px; font-weight: 800; color: #1e2433; margin: 0; }
.header-stats { display: flex; gap: 8px; }
.stat-pill {
  display: flex; align-items: center; gap: 6px;
  background: #fff; border: 1px solid #e5e9f0;
  padding: 6px 14px; border-radius: 20px; font-size: 12.5px; font-weight: 700; color: #5a6377;
}
.stat-pill.accent { background: #eef5e6; border-color: #c3dda0; color: #4a7516; }

/* ══ LAYOUT ══ */
.main-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 20px;
  align-items: start;
}
@media (max-width: 1100px) { .main-grid { grid-template-columns: 1fr; } }

/* ══ CARD PANEL ══ */
.card-panel {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,.06);
  overflow: hidden;
}

/* ══ TOOLBAR ══ */
.table-toolbar {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 20px; border-bottom: 1px solid #f0f2f7; gap: 12px; flex-wrap: wrap;
}
.toolbar-left { display: flex; align-items: center; gap: 10px; flex: 1; }
.search-box {
  display: flex; align-items: center; gap: 8px;
  background: #f4f6f9; border-radius: 10px; padding: 8px 14px;
  flex: 1; max-width: 320px;
}
.search-box i { color: #aab0bf; font-size: 14px; }
.search-box input { border: none; background: none; outline: none; font-size: 13.5px; width: 100%; color: #1e2433; font-family: inherit; }
.search-box button { border: none; background: none; cursor: pointer; color: #aab0bf; padding: 0; }
.search-box button:hover { color: #c0392b; }

.view-toggle { display: flex; background: #f4f6f9; border-radius: 8px; overflow: hidden; }
.view-toggle button {
  border: none; background: none; padding: 7px 11px; cursor: pointer;
  color: #8a94a6; font-size: 15px; transition: .2s;
}
.view-toggle button.active { background: #5b8e1d; color: #fff; }

.btn-bulk-delete {
  display: flex; align-items: center; gap: 6px;
  background: #fef2f2; color: #c0392b; border: 1.5px solid #fca5a5;
  padding: 7px 16px; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer;
  transition: .2s;
}
.btn-bulk-delete:hover { background: #c0392b; color: #fff; border-color: #c0392b; }

/* ══ TABLE ══ */
.table-wrap { overflow-x: auto; }
.cat-table { width: 100%; border-collapse: collapse; }
.cat-table thead tr { background: #f8f9fc; }
.cat-table th { padding: 11px 16px; font-size: 11.5px; font-weight: 800; text-transform: uppercase; letter-spacing: .5px; color: #8a94a6; border-bottom: 1px solid #f0f2f7; }
.cat-table td { padding: 12px 16px; border-bottom: 1px solid #f6f8fb; vertical-align: middle; }
.cat-table tr:last-child td { border-bottom: none; }
.cat-table tr.selected td { background: #f6faf0; }
.cat-table tr.is-child td:first-child ~ td { padding-left: 12px; }
.tc { text-align: center; }
.tr { text-align: right; }

.chk { width: 16px; height: 16px; accent-color: #5b8e1d; cursor: pointer; }

.empty-row { text-align: center; padding: 48px; color: #bcc3d0; }
.empty-row i { font-size: 36px; display: block; margin-bottom: 8px; }
.empty-row span { font-size: 14px; }

/* ══ CAT CELL ══ */
.cat-cell { display: flex; align-items: center; gap: 10px; }
.level-indent { display: flex; align-items: center; padding-left: 12px; }
.level-line { display: inline-block; width: 14px; height: 2px; background: #d0d7e6; border-radius: 2px; margin-right: 4px; }
.cat-thumb {
  width: 40px; height: 40px; border-radius: 10px; overflow: hidden;
  background: #f0f2f7; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; font-size: 16px; color: #aab0bf; border: 1px solid #e8ebf2;
}
.cat-thumb img { width: 100%; height: 100%; object-fit: cover; }
.cat-info { min-width: 0; }
.cat-name { display: flex; align-items: center; gap: 6px; font-weight: 700; font-size: 13.5px; color: #1e2433; }
.cat-desc { display: block; font-size: 12px; color: #9aa3b5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; margin-top: 2px; }

.child-tag {
  font-size: 10px; font-weight: 800; background: #e8f0fe; color: #3b6de8;
  padding: 2px 6px; border-radius: 4px; text-transform: uppercase; letter-spacing: .4px;
}
.parent-badge { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #5a6377; background: #f0f2f7; padding: 3px 10px; border-radius: 6px; white-space: nowrap; }
.root-badge { font-size: 12px; color: #a07c30; background: #fdf6e3; padding: 3px 10px; border-radius: 6px; font-weight: 700; }
.count-badge { display: inline-block; background: #f0f2f7; color: #5a6377; font-size: 12.5px; font-weight: 700; padding: 3px 10px; border-radius: 6px; }

.status-dot {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 20px;
}
.status-dot::before { content: ''; width: 6px; height: 6px; border-radius: 50%; }
.status-dot.on  { background: #e6f9ef; color: #1a7f4b; }
.status-dot.on::before  { background: #1a7f4b; }
.status-dot.off { background: #fef2f2; color: #c0392b; }
.status-dot.off::before { background: #c0392b; }

.action-btns { display: flex; align-items: center; gap: 6px; justify-content: flex-end; }
.btn-edit, .btn-del {
  width: 32px; height: 32px; border-radius: 8px; border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 13px; transition: .2s;
}
.btn-edit { background: #eef5e6; color: #4a7516; }
.btn-edit:hover { background: #5b8e1d; color: #fff; }
.btn-del  { background: #fef2f2; color: #c0392b; }
.btn-del:hover  { background: #c0392b; color: #fff; }

/* ══ TREE VIEW ══ */
.tree-view { padding: 16px 20px; display: flex; flex-direction: column; gap: 10px; }
.tree-root { border: 1px solid #e8ebf2; border-radius: 12px; overflow: hidden; }
.tree-node {
  display: flex; align-items: center; gap: 10px; padding: 12px 14px;
  background: #fff; transition: background .15s;
}
.tree-node:hover { background: #f8f9fc; }
.tree-node.selected { background: #f6faf0; }
.root-node { background: #fafbff; border-bottom: 1px solid #f0f2f7; font-weight: 700; }
.tree-children { background: #f8f9fc; }
.child-node { padding-left: 24px; border-bottom: 1px solid #f0f2f7; }
.child-node:last-child { border-bottom: none; }
.tree-children.grand { background: #f4f5f8; }
.grand-node { padding-left: 48px; border-bottom: 1px solid #ececec; font-size: 13px; }
.grand-node:last-child { border-bottom: none; }

.tree-connector { display: flex; align-items: center; }
.tree-connector span { display: inline-block; width: 16px; height: 2px; background: #d0d7e6; border-radius: 2px; }
.tree-thumb { width: 36px; height: 36px; border-radius: 8px; overflow: hidden; background: #f0f2f7; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 14px; color: #aab0bf; border: 1px solid #e8ebf2; }
.tree-thumb.small { width: 30px; height: 30px; border-radius: 7px; font-size: 12px; }
.tree-thumb.xsmall { width: 26px; height: 26px; border-radius: 6px; font-size: 11px; }
.tree-thumb img { width: 100%; height: 100%; object-fit: cover; }
.tree-info { flex: 1; min-width: 0; }
.tree-name { display: block; font-weight: 700; font-size: 13.5px; color: #1e2433; }
.tree-name.small { font-size: 13px; }
.tree-meta { display: block; font-size: 11.5px; color: #9aa3b5; margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; }

/* ══ PAGINATION ══ */
.pagination-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; border-top: 1px solid #f0f2f7; }
.page-info { font-size: 12.5px; color: #8a94a6; }
.page-btns { display: flex; gap: 4px; }
.page-btns button {
  width: 32px; height: 32px; border-radius: 8px; border: 1px solid #e5e9f0;
  background: #fff; color: #5a6377; font-size: 13px; cursor: pointer; transition: .15s;
  display: flex; align-items: center; justify-content: center;
}
.page-btns button:hover:not(:disabled) { border-color: #5b8e1d; color: #5b8e1d; }
.page-btns button.active { background: #5b8e1d; border-color: #5b8e1d; color: #fff; }
.page-btns button:disabled { opacity: .4; cursor: default; }

/* ══ FORM PANEL ══ */
.form-panel {
  background: #fff; border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,.06);
  position: sticky; top: 20px; overflow: hidden;
}
.form-header {
  display: flex; align-items: center; gap: 14px;
  padding: 20px 24px; border-bottom: 1px solid #f0f2f7;
  background: linear-gradient(135deg, #f8fbf4 0%, #fff 100%);
}
.form-icon {
  width: 42px; height: 42px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; font-size: 18px;
}
.form-icon.add  { background: #eef5e6; color: #5b8e1d; }
.form-icon.edit { background: #e8f0fe; color: #3b6de8; }
.form-title { font-weight: 800; font-size: 15px; color: #1e2433; }
.form-sub   { font-size: 12px; color: #9aa3b5; margin-top: 2px; }

.cat-form { padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }

.field label { display: block; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .5px; color: #8a94a6; margin-bottom: 6px; }
.req { color: #c0392b; }
.field input[type="text"],
.field select,
.field textarea {
  width: 100%; background: #f4f6f9; border: 1.5px solid transparent;
  border-radius: 10px; padding: 9px 12px; font-size: 13.5px; color: #1e2433;
  font-family: inherit; outline: none; transition: .2s; resize: none; box-sizing: border-box;
}
.field input[type="text"]:focus,
.field select:focus,
.field textarea:focus {
  background: #fff; border-color: #5b8e1d;
  box-shadow: 0 0 0 3px rgba(91,142,29,.12);
}
.field-hint { font-size: 12px; color: #5b8e1d; margin-top: 6px; display: flex; align-items: center; gap: 5px; }
.char-count { font-size: 11px; color: #b0b8c9; text-align: right; margin-top: 4px; }

/* Upload zone */
.upload-zone {
  border: 2px dashed #d5dce8; border-radius: 12px; padding: 24px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  cursor: pointer; transition: .2s; min-height: 100px; text-align: center; position: relative; overflow: hidden;
}
.upload-zone:hover:not(.has-img) { border-color: #5b8e1d; background: #f6faf0; }
.upload-zone.has-img { cursor: default; padding: 0; border-style: solid; border-color: #e0e8d0; }
.upload-icon { font-size: 28px; color: #b0b8c9; margin-bottom: 6px; }
.upload-text { font-size: 13px; font-weight: 700; color: #5a6377; }
.upload-hint { font-size: 11.5px; color: #b0b8c9; margin-top: 3px; }
.preview-img { width: 100%; height: 140px; object-fit: cover; display: block; }
.preview-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,.4);
  display: flex; align-items: center; justify-content: center; gap: 8px;
  opacity: 0; transition: .2s;
}
.upload-zone.has-img:hover .preview-overlay { opacity: 1; }
.btn-change-img, .btn-remove-img {
  display: flex; align-items: center; gap: 5px;
  padding: 7px 12px; border-radius: 8px; border: none; font-size: 12.5px; font-weight: 700; cursor: pointer;
}
.btn-change-img { background: #fff; color: #1e2433; }
.btn-remove-img { background: #c0392b; color: #fff; }

/* Toggle trạng thái */
.toggle-row { display: flex; gap: 8px; }
.toggle-btn {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
  padding: 9px; border-radius: 10px; border: 1.5px solid #e5e9f0;
  background: #f4f6f9; color: #8a94a6; font-size: 13px; font-weight: 700; cursor: pointer; transition: .2s;
  font-family: inherit;
}
.toggle-btn.active { background: #eef5e6; border-color: #5b8e1d; color: #4a7516; }
.toggle-btn:not(.active):last-child.active { background: #fef2f2; border-color: #c0392b; color: #c0392b; }

/* Form actions */
.form-actions { display: flex; gap: 8px; padding-top: 4px; }
.btn-cancel {
  display: flex; align-items: center; gap: 6px;
  padding: 10px 16px; border-radius: 10px; border: 1.5px solid #e5e9f0;
  background: #f4f6f9; color: #5a6377; font-size: 13.5px; font-weight: 700; cursor: pointer; transition: .2s;
}
.btn-cancel:hover { border-color: #c0392b; color: #c0392b; }
.btn-save {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
  padding: 10px 20px; border-radius: 10px; border: none;
  background: #5b8e1d; color: #fff; font-size: 13.5px; font-weight: 800; cursor: pointer; transition: .2s;
  font-family: inherit;
}
.btn-save:hover:not(:disabled) { background: #4a7516; }
.btn-save:disabled { opacity: .6; cursor: default; }

.fade-enter-active, .fade-leave-active { transition: opacity .25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>