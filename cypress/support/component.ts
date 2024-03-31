// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

import { mount } from 'cypress/vue'
import { Suspense, h } from 'vue'
import { getContext } from 'unctx'
import {
  RouterLink,
  createRouter,
  createWebHistory,
  routeLocationKey,
  routerKey,
} from 'vue-router'

type MountParams = Parameters<typeof mount<any>>
type OptionsParam = MountParams[1]
type Router = ReturnType<typeof createRouter>

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  namespace Cypress {
    interface Chainable {
      mount(component: any, options?: OptionsParam): Chainable<any>
      stubNuxtInject(key: string, value: unknown): void
      stubNuxtRouter(callback: ($rotuer: Router) => void): void
      resetNuxt(): void
    }
  }
}

const nuxtAppCtx = getContext('nuxt-app')
const $router = createRouter({
  routes: [],
  history: createWebHistory(),
})
function generateNuxtCTX(): Record<string, any> {
  return {
    static: { data: {} },
    payload: { data: {}, _errors: {} },
    hook: () => () => ({}),
    hooks: {
      callHook: () => Promise.resolve(),
    },
    _asyncData: {},
    _asyncDataPromises: {},
    _useHead: () => ({}),
    $router,
    _route: $router.currentRoute,
  }
}
let nuxtCTX = generateNuxtCTX()

nuxtAppCtx.set(nuxtCTX)

Cypress.Commands.add('mount', (component, options = {}) => {
  options.global = options.global || {}
  options.global.components = { RouterLink }
  options.global.provide = {
    [routerKey as symbol]: $router,
    [routeLocationKey as symbol]: $router.currentRoute.value,
  }

  return mount(
    () => h(Suspense, h(component, options?.props, options?.slots)),
    options,
  )
})

Cypress.Commands.add('stubNuxtInject', (key, value) => {
  nuxtCTX[`$${key}`] = value
})

Cypress.Commands.add('stubNuxtRouter', (callback) => {
  callback($router)
})

Cypress.Commands.add('resetNuxt', () => {
  nuxtCTX = generateNuxtCTX()
  nuxtAppCtx.unset()
  nuxtAppCtx.set(nuxtCTX)

  $router.push('/')
})

// Example use:
// cy.mount(MyComponent)
