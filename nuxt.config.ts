// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  runtimeConfig: {
    baseUrl: process.env.BASE_URL_SERVER,
    public: {
      baseUrl: process.env.BASE_URL_CLIENT,
    },
  },
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
    '@nuxt/devtools',
    'nuxt-vitest',
    '@vee-validate/nuxt',
    '@vueuse/nuxt',
    '@nuxt/image-edge',
    'nuxt-quasar-ui',
  ],
  apollo: {
    autoImports: true,
    proxyCookies: true,
    clients: {
      default: {
        httpEndpoint: 'http://localhost:3000/graphql',
        // tokenName: 'access_token',
        authHeader: 'Authorization',
        authType: 'Bearer',
        connectToDevTools: true,
        httpLinkOptions: {
          credentials: 'include',
        },
        // cookieAttributes: {
        //   sameSite: 'none',
        //   domain: 'localhost:3000',
        //   path: '/graphql',
        //   maxAge: 1000 * 60 * 1, // 1 hour
        // },
      },
    },
  },
  pinia: {
    autoImports: ['defineStore'],
  },
  piniaPersistedstate: {
    storage: 'sessionStorage',
  },
  veeValidate: {
    autoImports: true,
  },
  eslint: {
    lintOnStart: false,
  },
  quasar: {},
})
