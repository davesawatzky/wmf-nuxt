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
        httpEndpoint: process.env.GRAPHQL_SERVER!,
        tokenName: 'diatonicToken',
        authHeader: 'Authorization',
        authType: 'Bearer',
        connectToDevTools: true,
        httpLinkOptions: {
          credentials: 'include',
        },
      },
      //     // cookieAttributes: {
      //     //   sameSite: 'none',
      //     //   domain: 'localhost:3000',
      //     //   path: '/graphql',
      //     //   maxAge: 1000 * 60 * 1, // 1 hour
      //     // },
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
    '@nuxtjs/apollo',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxt/devtools',
    'nuxt-vitest',
    '@vee-validate/nuxt',
    '@vueuse/nuxt',
    'nuxt-icon',
    'nuxt-headlessui',
    '@nuxtjs/device',
  ],
  pinia: {
    storesDirs: ['stores'],
  },
  piniaPersistedstate: {
    storage: 'sessionStorage',
  },
  runtimeConfig: {
    graphqlServer: process.env.GRAPHQL_SERVER,
    apiBase: process.env.NUXT_API_BASE,
    sendingEmailServer: process.env.SENDING_EMAIL_SERVER,
    sendingEmailAddress: process.env.SENDING_EMAIL_ADDRESS,
    sendingEmailPassword: process.env.SENDING_EMAIL_PASSWORD,
    sendingSmtpPort: process.env.SENDING_SMTP_PORT,
    emailServerUserAccount: process.env.EMAIL_SERVER_USER_ACCOUNT,
    bccEmailAddress: process.env.BCC_EMAIL_ADDRESS,

    public: {
      serverAddress: process.env.SERVER_ADDRESS,
      apiBase: process.env.NUXT_API_BASE,
      emailConfirmation: process.env.EMAIL_CONFIRMATION,
      resendConfirmation: process.env.RESEND_CONFIRMATION,
      stripeKey: process.env.STRIPE_PUB_KEY,
    },
  },
  sourcemap: true,
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
        propsDestructure: true,
      },
    },
  },
})
