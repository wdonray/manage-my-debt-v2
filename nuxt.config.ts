import { nuxtDoctrineConfig } from '@christfirst/doctrine'

// @ts-expect-error - This is a workaround for the fact that the nuxtDoctrineConfig is not typed
export default defineNuxtConfig({
  ...nuxtDoctrineConfig,
  css: ['~/assets/css/transitions.css', ...nuxtDoctrineConfig.css],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxtjs/turnstile',
    'motion-v/nuxt',
    '@nuxt/scripts',
    '@nuxt/fonts',
    '@nuxt/eslint',
    ...nuxtDoctrineConfig.modules,
  ],
  imports: {
    dirs: ['constants.ts'],
  },
  icon: {
    ...nuxtDoctrineConfig.icon,
    clientBundle: {
      scan: true,
    },
  },
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/one-time-code', '/create-account'],
    },
  },

  turnstile: {
    siteKey: '0x4AAAAAABE7Erd3V_T0mZM6',
  },

  runtimeConfig: {
    turnstile: {
      secretKey: '0x4AAAAAABE7EkOrJ7UPKOmUWO_FVA18FMo',
    },
  },
})
