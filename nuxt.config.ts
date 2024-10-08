// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { WMFPreset } from './utils/wmfpreset'

export default defineNuxtConfig({
  compatibilityDate: '2024-08-28',
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/apollo',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxt/devtools',
    '@nuxt/test-utils/module',
    '@vee-validate/nuxt',
    '@vueuse/nuxt',
    'nuxt-headlessui',
    '@nuxtjs/device',
    '@primevue/nuxt-module',
    '@nuxt/icon',
  ],
  devServer: {
    port: 3001,
  },
  devtools: {
    enabled: true,
  },
  debug: false,
  alias: {
    '@': resolve(__dirname, './'),
    images: fileURLToPath(new URL('./public/images', import.meta.url)),
  },
  apollo: {
    autoImports: true,
    proxyCookies: true,
    tokenStorage: 'cookie',
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
      },
    },
    clients: {
      default: {
        // httpEndpoint: 'https://wmfapi.diatonic.ca/graphql',
        httpEndpoint: 'http://localhost:3000/graphql',
        tokenName: 'diatonicToken',
        authHeader: 'Authorization',
        authType: 'Bearer',
        connectToDevTools: true,
        httpLinkOptions: {
          credentials: 'include',
        },
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
  pinia: {
    storesDirs: ['./stores'],
  },
  piniaPersistedstate: {
    storage: 'sessionStorage',
  },
  primevue: {
    autoImport: true,
    options: {
      ripple: true,
      theme: {
        preset: WMFPreset,
        options: {
          darkModeSelector: '.fake-dark-selector',
          prefix: 'p',
          cssLayer: {
            name: 'primevue',
            order: 'tailwind-base, primevue, tailwind-utilities',
          },
          // cssLayer: false
        },
      },
    },
    components: {
      prefix: 'Prime',
    },
  },
  runtimeConfig: {
    graphqlServer: '',
    apiBase: '',
    sendingEmailServer: '',
    sendingEmailAddress: '',
    sendingEmailPassword: '',
    sendingSmtpPort: '',
    emailServerUserAccount: '',
    bccEmailAddress: '',

    public: {
      serverAddress: '',
      apiBase: '',
      emailConfirmation: '',
      resendConfirmation: '',
      resendPasswordReset: '',
      stripePubKey: '',
    },
  },
  sourcemap: {
    server: true,
    client: true,
  },
  spaLoadingTemplate: true,
  ssr: false,
  tailwindcss: {
    cssPath: ['@/assets/css/tailwind.css', { injectPosition: 'first' }],
    configPath: 'tailwind.config',
  },
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
    build: {
      target: 'es6',
    },
    vue: {
      script: {
        propsDestructure: true,
      },
    },
  },
})
