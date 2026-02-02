import { createApp } from 'vue'
 // XÓA DÒNG NÀY ĐI: import './style.css'
import App from './App.vue'
import router from './router'

// Thêm Bootstrap Icons
import 'bootstrap-icons/font/bootstrap-icons.css'

// Thêm Bootstrap CSS và JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

const app = createApp(App)
app.use(router)
app.mount('#app')