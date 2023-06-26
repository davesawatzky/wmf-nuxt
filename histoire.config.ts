import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'
import { HstNuxt } from '@histoire/plugin-Nuxt'

export default defineConfig({
  plugins: [HstVue(), HstNuxt()],
  // setupFile: './histoire.setup.ts',
})
