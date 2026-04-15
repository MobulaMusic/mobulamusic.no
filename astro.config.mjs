import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://mobula.no',
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  security: {
    checkOrigin: false,
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'no',
        locales: {
          no: 'nb-NO',
          en: 'en-US',
        },
      },
      filter: (page) => !page.includes('/admin'),
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    '/studiolokaler/vokal': '/innspilling#vokal',
    '/studiolokaler/lydbokinnspilling': '/innspilling#lydbok',
    '/bulkinnspilling': '/innspilling#ensemble',
    '/innspillinger/fellesinnspilling': '/innspilling#ensemble',
    '/innspillinger': '/innspilling',
    '/podkaststudio': '/podkast',
    '/studiolokaler': '/om-oss#studio',
    '/utleiestudio': '/om-oss#studio',
    '/fasttrack': '/innspilling',
    '/teamet': '/om-oss',
    '/vårt-studio': '/om-oss#studio',
    '/blog': '/nyheter',
  },
});
