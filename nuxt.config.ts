import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  target: 'static',
  router: {
    base: '/nuxt3-notion/'
  },
  modules: [
    '@unocss/nuxt',
  ],
  unocss: {
    // presets
    uno: true, // enabled `@unocss/preset-uno`
    icons: true, // enabled `@unocss/preset-icons`
    wind:true, 
    attributify: false, // enabled `@unocss/preset-attributify`,

    // core options
    shortcuts: [],
    rules: [],
  },
})
