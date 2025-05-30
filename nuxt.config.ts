import { nuxtDoctrineConfig } from '@christfirst/doctrine'
import type { NuxtConfig } from 'nuxt/schema'
import type { ModuleOptions as SitemapOptions } from '@nuxtjs/sitemap'
import type { ModuleOptions as RobotsOptions } from '@nuxtjs/robots'

export default defineNuxtConfig({
  ...nuxtDoctrineConfig,
  css: ['~/assets/css/transitions.css', ...nuxtDoctrineConfig.css],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
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
    '@nuxtjs/seo',
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
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://manage-my-debt.com',
      siteName: 'Manage My Debt',
      siteDescription: 'A powerful tool to help you pay off debt using the avalanche method',
      language: 'en',
      titleSeparator: '|',
      trailingSlash: false,
    },
  },
  sitemap: {
    enabled: true,
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://manage-my-debt.com',
    gzip: true,
    exclude: ['/login', '/create-account', '/one-time-code', '/confirm', '/logout'],
  } as unknown as SitemapOptions,
  robots: {
    enabled: true,
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/login', '/create-account', '/one-time-code', '/confirm', '/logout'],
    },
    sitemap: (_req: unknown) => `${process.env.NUXT_PUBLIC_SITE_URL || 'https://manage-my-debt.com'}/sitemap.xml`,
  } as unknown as RobotsOptions,
} as NuxtConfig)
