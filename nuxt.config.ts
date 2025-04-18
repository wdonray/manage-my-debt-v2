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
})
