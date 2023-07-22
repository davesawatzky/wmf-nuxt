// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  alias: {
    '@': resolve(__dirname, './'),
    images: fileURLToPath(new URL('./public/images', import.meta.url)),
  },
  apollo: {
    autoImports: true,
    proxyCookies: true,
    tokenStorage: 'cookie',
    clients: {
      default: {
        httpEndpoint: 'http://localhost:3000/graphql',
        tokenName: 'diatonicToken',
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
  eslint: {
    lintOnStart: false,
    emitWarning: false,
  },
  experimental: {
    typedPages: true,
    watcher: 'chokidar',
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
    'nuxt-icon',
  ],
  pinia: {
    autoImports: ['defineStore'],
  },
  piniaPersistedstate: {
    storage: 'sessionStorage',
  },
  runtimeConfig: {
    baseUrl: process.env.BASE_URL_SERVER,
    public: {
      baseUrl: process.env.BASE_URL_CLIENT,
    },
  },
  typescript: {
    strict: true,
    typeCheck: true,
    // tsConfig: {
    //   compilerOptions: {
    //     moduleResolution: 'bundler'
    //   }
    // }
  },
  veeValidate: {
    autoImports: true,
  },
  vite: {
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    },
  },
})
