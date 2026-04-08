import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mobula.no',
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
