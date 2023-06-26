// src/histoire.setup.ts

import { createPinia } from 'pinia'
import { defineSetupVue3 } from '@histoire/plugin-vue'
import './assets/css/tailwind.css'

export const setupVue3 = defineSetupVue3(({ app, story }) => {
  const pinia = createPinia()
  app.use(pinia) // Add Pinia store
})
