import 'bootstrap/dist/css/bootstrap.css'
import './styles/custom.scss'
import './assets/main.css'
import Toast, { POSITION } from 'vue-toastification'
// Import the CSS or use your own!
import 'vue-toastification/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// Prevents toasts of the same type from appearing simultaneously, discarding duplicates
const filterBeforeCreate = (toast, toasts) => {
  if (toasts.filter((t) => t.type === toast.type).length !== 0) {
    // Returning false discards the toast
    return false
  }
  // You can modify the toast if you want
  return toast
}

app.use(Toast, { position: POSITION.BOTTOM_RIGHT, filterBeforeCreate })
app.use(createPinia())
app.use(router)

app.mount('#app')
