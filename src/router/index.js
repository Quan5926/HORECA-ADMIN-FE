import { createRouter, createWebHistory } from 'vue-router'
import AdminDashboard from '../views/AdminDashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0, behavior: 'smooth' }
  },
  routes: [
    /* ── PUBLIC ── */
    {
      path: '/dang-nhap',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/views/TestConnection.vue')
    },

    /* ── ADMIN (yêu cầu đăng nhập) ── */
    {
      path: '/',
      name: 'admin-dashboard',
      component: AdminDashboard,
      meta: { requiresAuth: true, title: 'Dashboard' }
    },
    {
      path: '/orders',
      name: 'admin-orders',
      component: () => import('@/views/AdminOrders.vue'),
      meta: { requiresAuth: true, title: 'Quản lý Đơn Hàng' }
    },
    {
      path: '/products',
      name: 'admin-products',
      component: () => import('@/views/AdminProducts.vue'),
      meta: { requiresAuth: true, title: 'Quản lý Sản Phẩm' }
    },
    {
      path: '/products/add',
      name: 'admin-product-add',
      component: () => import('@/views/AdminProductAdd.vue'),
      meta: { requiresAuth: true, title: 'Thêm Sản Phẩm' }
    },
    {
      path: '/products/edit/:id',
      name: 'admin-product-edit',
      component: () => import('@/views/AdminProductEdit.vue'),
      meta: { requiresAuth: true, title: 'Cập nhật Sản Phẩm' }
    },
    {
      path: '/products/detail/:id',
      name: 'admin-product-detail',
      component: () => import('@/views/AdminProductDetail.vue'),
      meta: { requiresAuth: true, title: 'Chi tiết Sản Phẩm' }
    },
    {
      path: '/categories',
      name: 'admin-categories',
      component: () => import('@/views/AdminCategories.vue'),
      meta: { requiresAuth: true, title: 'Quản lý Danh Mục' }
    },
    {
      path: '/inventory',
      name: 'admin-inventory',
      component: () => import('@/views/AdminInventory.vue'),
      meta: { requiresAuth: true, title: 'Quản lý Kho' }
    },
    {
      path: '/reports',
      name: 'admin-reports',
      component: () => import('@/views/AdminReports.vue'),
      meta: { requiresAuth: true, title: 'Báo cáo' }
    },
    {
      path: '/settings',
      name: 'admin-settings',
      component: () => import('@/views/AdminSettings.vue'),
      meta: { requiresAuth: true, title: 'Cài đặt' }
    },
    {
      path: '/profile',
      name: 'admin-profile',
      component: () => import('@/views/AdminProfile.vue'),
      meta: { requiresAuth: true, title: 'Hồ sơ' }
    },
    {
      path: '/notifications',
      name: 'admin-notifications',
      component: () => import('@/views/AdminNotifications.vue'),
      meta: { requiresAuth: true, title: 'Thông báo' }
    },
    {
      path: '/messages',
      name: 'admin-messages',
      component: () => import('@/views/AdminMessages.vue'),
      meta: { requiresAuth: true, title: 'Tin nhắn' }
    },
    {
      path: '/news',
      name: 'admin-news',
      component: () => import('@/views/AdminNews.vue'),
      meta: { requiresAuth: true, title: 'Quản lý Tin Tức' }
    },
    {
      path: '/banners',
      name: 'admin-banners',
      component: () => import('@/views/AdminBanners.vue'),
      meta: { requiresAuth: true, title: 'Quản lý Banner' }
    },
    {
      path: '/contacts',
      name: 'admin-contacts',
      component: () => import('@/views/AdminContacts.vue'),
      meta: { requiresAuth: true, title: 'Quản lý Liên Hệ' }
    },
    {
      path: '/returns',
      name: 'admin-returns',
      component: () => import('@/views/ReturnOrders.vue'),
      meta: { requiresAuth: true, title: 'Quản lý Đổi Trả' }
    },
    {
      path: '/customers',
      name: 'admin-customers',
      component: () => import('@/views/CustomerManagement.vue'),
      meta: { requiresAuth: true, title: 'Quản lý Khách Hàng' }
    },
    {
      path: '/staff',
      name: 'admin-staff',
      component: () => import('@/views/StaffManagement.vue'),
      meta: { requiresAuth: true, title: 'Quản lý Nhân Viên' }
    },
    {
      path: '/coupons',
      name: 'admin-coupons',
      component: () => import('@/views/CouponsManagement.vue'),
      meta: { requiresAuth: true, title: 'Quản lý Phiếu Giảm Giá' }
    },
    {
      path: '/sales',
      name: 'admin-sales',
      component: () => import('@/views/SalesManagement.vue'),
      meta: { requiresAuth: true, title: 'Quản lý Đợt Giảm Giá' }
    },
    {
      path: '/reviews',
      name: 'admin-reviews',
      component: () => import('@/views/AdminReviews.vue'),
      meta: { requiresAuth: true, title: 'Quản lý Đánh Giá' }
    },

    /* ── 404 (luôn để cuối) ── */
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isAuth = sessionStorage.getItem('admin_is_auth') === 'true'
  const role   = sessionStorage.getItem('admin_role')

  // ✅ Thêm hàm check role cho gọn
  const isAdmin = role === 'QUAN_TRI' || role === 'ROLE_QUAN_TRI'

  document.title = to.meta.title
    ? `${to.meta.title} | HORECA ONE Admin`
    : 'HORECA ONE Admin'

  if (to.meta.requiresAuth) {
    if (!isAuth || !isAdmin) {  // ← sửa
      return next({ path: '/dang-nhap', query: { redirect: to.fullPath } })
    }
  }

  if (to.path === '/dang-nhap' && isAuth && isAdmin) {  // ← sửa
    return next({ path: '/' })
  }

  next()
})

export default router