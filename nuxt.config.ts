// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'

export default defineNuxtConfig({
  devServer: {
    port: 3001,
  },
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
  experimental: {
    typedPages: true,
    componentIslands: true,
  },
  headlessui: {
    prefix: 'UI',
  },
  modules: [
    '@nuxtjs/tailwindcss',
    // '@nuxtjs/eslint-module',
    '@nuxtjs/apollo',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxt/devtools',
    'nuxt-vitest',
    '@vee-validate/nuxt',
    '@vueuse/nuxt',
    '@nuxt/image-edge',
    'nuxt-icon',
    'nuxt-headlessui',
  ],
  pinia: {
    autoImports: ['defineStore'],
  },
  piniaPersistedstate: {
    storage: 'sessionStorage',
  },
  runtimeConfig: {
    apiBase: process.env.NUXT_API_BASE,
    public: {
      apiBase: process.env.NUXT_API_BASE,
    },
  },
  spaLoadingTemplate: true,
  ssr: false,
  typescript: {
    strict: true,
    typeCheck: true,
    tsConfig: {
      compilerOptions: {
        moduleResolution: 'bundler',
        types: [],
      },
    },
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
