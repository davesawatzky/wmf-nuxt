// cypress.config.ts
import process from 'node:process'
import { defineConfig } from 'cypress'
import { buildNuxt, loadNuxt } from '@nuxt/kit'
import type { InlineConfig } from 'vite'

async function getNuxtViteConfig() {
  const nuxt = await loadNuxt({
    cwd: process.cwd(),
    dev: true,
    overrides: {
      ssr: false,
    },
  })
  return new Promise<InlineConfig>((resolve, reject) => {
    nuxt.hook('vite:extendConfig', (config) => {
      resolve(config)
      throw new Error('_stop_')
    })
    buildNuxt(nuxt).catch((err) => {
      if (!err.toString().includes('_stop_'))
        reject(err)
    })
  }).finally(() => nuxt.close())
}

export default defineConfig({
  // ...
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
      async viteConfig() {
        const config = await getNuxtViteConfig()

        config.plugins = config?.plugins?.filter(
          // @ts-expect-error
          item => !['replace', 'vite-plugin-eslint'].includes(item.name),
        )

        if (config.server)
          config.server.middlewareMode = false

        return config
      },
    },
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
