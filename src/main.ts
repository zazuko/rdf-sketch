import { createApp } from 'vue'
import App from './App.vue'
import './styles/index.css'
import './registerServiceWorker'

const app = createApp(App)

app.directive('focus', {
  mounted(el) {
    el.focus()
  },
})

app.mount('#app')
