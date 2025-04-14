import { nuxtDoctrineConfig } from '@christfirst/doctrine'

// @ts-ignore
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
    ...nuxtDoctrineConfig.modules,
  ],
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/one-time-code', '/create-account'],
    },
  },
})
