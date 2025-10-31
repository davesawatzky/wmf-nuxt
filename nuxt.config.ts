// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import { WMFPreset } from './app/utils/wmfpreset'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxt/eslint',
    '@nuxtjs/apollo',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxt/devtools',
    '@nuxt/test-utils/module',
    '@vee-validate/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/device',
    '@primevue/nuxt-module',
    '@nuxt/icon',
    '@nuxt/image',
    '@formkit/auto-animate/nuxt',
    'nuxt-security',
    '@sentry/nuxt/module',
  ],

  devServer: {
    port: 3001,
    host: '0.0.0.0',
  },

  devtools: {
    enabled: true,
  },

  debug: false,

  alias: {
    '@': './',
    images: './public/images',
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
        httpEndpoint:
          process.env.NUXT_GRAPHQL_SERVER || 'http://localhost:3000/graphql',
        tokenName: 'diatonicToken',
        authHeader: 'Authorization',
        authType: 'Bearer',
        httpLinkOptions: {
          credentials: 'include',
        },
      },
    },
  },

  app: {
    head: {
      script: [
        {
          src: 'https://cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js?version=4.8.0&features=globalThis',
        },
      ],
    },
  },

  experimental: {
    typedPages: true,
    componentIslands: true,
  },
  image: {
    format: ['webp'],
  },

  pinia: {
    storesDirs: ['./app/stores/**'],
  },

  piniaPluginPersistedstate: {
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
            order: 'theme, base, primevue',
          },
          // cssLayer: false
        },
      },
    },
    components: {
      prefix: 'PV',
      exclude: ['Editor', 'Form', 'FormField'],
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
      sentryDsn: '',
    },
  },

  security: {
    corsHandler: {
      origin: '*',
    },
    headers: {
      contentSecurityPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: false,
      // contentSecurityPolicy: {
      //   'default-src': ["'self'"],
      //   'script-src': [
      //     "'self'",
      //     "'unsafe-inline'",
      //     "'unsafe-eval'",
      //     'https://js.stripe.com',
      //   ],
      //   'frame-src': [
      //     "'self'",
      //     'https://js.stripe.com',
      //     'https://hooks.stripe.com',
      //   ],
      //   'connect-src': [
      //     "'self'",
      //     'https://api.stripe.com',
      //     'http://localhost:3000', // Your GraphQL backend
      //     'https://iconify.design',
      //   ],
      //   'img-src': ["'self'", 'data:', 'https:', 'https://api.iconify.design'],
      //   'style-src': ["'self'", "'unsafe-inline'"],
      //   'font-src': ["'self'", 'data:'],
      // },
      crossOriginEmbedderPolicy: false, // Disable COEP for Stripe compatibility
    },
  },
  sentry: {
    sourceMapsUploadOptions: {
      org: 'diatonic-web-design-and-develo',
      project: 'wmf-nuxt',
      authToken: process.env.SENTRY_AUTH_TOKEN,
    },
  },
  sourcemap: { client: 'hidden' },

  spaLoadingTemplate: true,
  ssr: false,
  css: ['~/assets/css/tailwind.css'],
  // tiptap: {
  //   prefix: 'Tiptap', //prefix for Tiptap imports, composables not included
  // },
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
    esbuild: {
      pure:
        process.env.NODE_ENV === 'production'
          ? ['console.log', 'console.debug']
          : [],
    },
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        // Include all PrimeVue packages with patterns
        'primevue/**',
        '@primevue/**',
        '@primeuix/**',
        'luxon',

        // Other dependencies
        '@vueuse/core',
        'pinia',
        '@pinia/colada',
      ],
      exclude: ['@nuxt/test-utils'],
    },
    vue: {
      script: {
        propsDestructure: true,
      },
    },
  },

  compatibilityDate: '2025-04-12',
})
