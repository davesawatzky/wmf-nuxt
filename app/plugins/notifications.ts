import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin({
  name: 'toast-plugin',
  parallel: true,
  async setup(nuxtApp) {
    nuxtApp.vueApp.use(Toast, {
      position: POSITION.BOTTOM_CENTER,
      timeout: 4500,
      transition: 'Vue-Toastification__fade',
      newestOnTop: false,
    })
  },
  env: {
    islands: false,
  },
})
