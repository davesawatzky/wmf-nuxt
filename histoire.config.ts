import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'
import { HstNuxt } from '@histoire/plugin-Nuxt'

export default defineConfig({
  plugins: [
    HstVue(),
    HstNuxt(),
    {
      name: 'histoire-patch',
      config(config) {
        if (typeof config.vite === 'object' && config?.vite?.define) {
          delete config.vite.define.__NUXT_VERSION__
        }
      },
    },
  ],
  setupFile: './histoire.setup.ts',
})
