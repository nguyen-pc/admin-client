import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { authentication } from './plugins/authetication'
import App from './App.vue'
import './index.css'
import router from './router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap'
import Vue3Toasity, { type ToastContainerOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const app = createApp(App).use(Vue3Toasity, {
  autoClose: 3000
} as ToastContainerOptions)

app.use(createPinia())

authentication.install().then(() => {
  app.use(router)
  app.mount('#app')
})
