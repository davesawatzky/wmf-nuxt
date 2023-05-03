// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  alias: {
    '@': resolve(__dirname, './'),
    images: fileURLToPath(new URL('./public/images', import.meta.url)),
  },
  typescript: {
    strict: true,
    typeCheck: true,
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/eslint-module',
    '@nuxtjs/apollo',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    // '@nuxt/devtools',
    'nuxt-vitest',
    '@vee-validate/nuxt',
    '@vueuse/nuxt',
    '@nuxt/image-edge',
  ],
  apollo: {
    autoImports: true,
    clients: {
      default: {
        httpEndpoint: 'http://localhost:3000/graphql',
        authType: 'Bearer',
        authHeader: 'Authorization',
        tokenStorage: 'cookie',
        tokenName: 'diatonicToken',
        connectToDevTools: true,
      },
    },
  },
  pinia: {
    autoImports: ['defineStore'],
  },
  piniaPersistedstate: {
    cookieOptions: {
      sameSite: 'strict',
    },
    storage: 'sessionStorage',
  },
  veeValidate: {
    autoImports: true,
  },
  eslint: {
    lintOnStart: false,
  },
})
