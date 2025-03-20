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

const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(dateString))
}
function formatDateHour(dateString) {
  const date = new Date(dateString)

  const format = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

  return format.format(date)
}

const app = createApp(App)

app.config.globalProperties.$formatDate = formatDate
app.config.globalProperties.$formatDateHour = formatDateHour

// Prevents toasts of the same type from appearing simultaneously, discarding duplicates
const filterBeforeCreate = (toast, toasts) => {
  if (toasts.filter((t) => t.type === toast.type).length !== 0) {
    // Returning false discards the toast
    return false
  }
  // You can modify the toast if you want
  return toast
}

// Register a global custom directive called `v-focus`
app.directive('focus', {
  // Called when the directive is mounted to the element
  mounted(el, binding) {
    // Check if the binding value is not explicitly set to false
    if (binding.value !== false) {
      el.focus()
    }
  },

  // Handle updates to the directive
  updated(el, binding) {
    // Refocus if the binding value changes and is not false
    if (binding.value !== false) {
      el.focus()
    }
  },
})

app.use(Toast, { position: POSITION.BOTTOM_RIGHT, filterBeforeCreate })
app.use(createPinia())
app.use(router)

app.mount('#app')
