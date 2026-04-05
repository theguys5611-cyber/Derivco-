import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import App from './App.vue'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')

// Init auth listener after pinia is ready
import { useAuthStore } from './stores/auth.js'
const authStore = useAuthStore()
authStore.init()
