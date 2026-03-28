export default defineNuxtConfig({
  modules: ['@element-plus/nuxt', '@nuxtjs/i18n'],
  ssr: true,
  i18n: {
    strategy: 'prefix',
    locales: [
      { code: 'en', name: 'English' },
      { code: 'de', name: 'Deutsch' }
    ],
    defaultLocale: 'en'
  }
})
