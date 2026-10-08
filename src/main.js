import { createApp } from 'vue'
 // XÓA DÒNG NÀY ĐI: import './style.css'
import App from './App.vue'
import router from './router'

// Thêm Bootstrap Icons
import 'bootstrap-icons/font/bootstrap-icons.css'

// Thêm Bootstrap CSS và JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css"; // Đừng quên dòng CSS này

const app = createApp(App)
app.use(Toast)
app.use(router)
app.mount('#app')