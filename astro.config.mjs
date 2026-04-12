import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://mobula.no',
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  integrations: [sitemap()],
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
