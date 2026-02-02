import { createRouter, createWebHistory } from 'vue-router'

// Eager loading (Tải ngay lập tức)
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/ve-vipep',
      name: 'about',
      component: AboutView,
    },
    // --- KHU VỰC SẢN PHẨM ---
    {
      path: '/san-pham/gia-vi',
      name: 'gia-vi',
      component: () => import('../views/GiaViView.vue'),
    },
    {
      path: '/san-pham/muoi-himalaya',
      name: 'muoi-himalaya',
      component: () => import('../views/MuoiHimalayaView.vue'),
    },
    {
      path: '/san-pham/nguyen-lieu',
      name: 'nguyen-lieu',
      component: () => import('../views/NguyenLieuView.vue'),
    },
    {
      path: '/san-pham/combo',
      name: 'combo',
      component: () => import('../views/ComboView.vue'),
    },
    // --- CÁC TRANG KHÁC ---
    {
      path: '/hot-deal',
      name: 'hot-deal',
      component: () => import('../views/HotDealView.vue'),
    },
    {
      path: '/tin-tuc',
      name: 'news',
      component: () => import('../views/NewsView.vue'),
    },
    {
      path: '/lien-he',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
    },
    {
      path: '/dang-nhap',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/gio-hang',
      name: 'cart',
      component: () => import('../views/CartView.vue'),
    },
    {
      path: '/he-thong-cua-hang',
      name: 'store-system',
      component: () => import('../views/StoreSystemView.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

export default router