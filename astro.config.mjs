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
    // Eksisterende (spisset: studiolokaler-undersider peker nå til konkrete innspillings-sider)
    '/studiolokaler/vokal': '/innspilling/vokal',
    '/studiolokaler/lydbokinnspilling': '/innspilling/lydbok-og-voice-over',
    '/bulkinnspilling': '/innspilling/band-og-ensemble',
    '/innspillinger/fellesinnspilling': '/innspilling/strykere-og-klassisk',
    '/innspillinger': '/innspilling',
    '/podkaststudio': '/podkast',
    '/studiolokaler': '/om-oss#studio',
    '/utleiestudio': '/om-oss#studio',
    '/fasttrack': '/innspilling',
    '/teamet': '/om-oss',
    '/vårt-studio': '/om-oss#studio',
    '/blog': '/nyheter',
    '/komposisjon': '/musikk',

    // Norske landingssider fra gamle siden
    '/vokalinnspilling': '/innspilling/vokal',
    '/plateinnspilling': '/innspilling',
    '/innspilling-av-album': '/innspilling',
    '/innspilling-av-demo': '/innspilling/singer-songwriter',
    '/innspillingsrom': '/innspilling',
    '/spille-inn-podcast': '/podkast',

    // Kurs og pris-til-søknad
    '/kurs-i-arrangering': '/musikk',
    '/service-page/kurs-i-arrangering-for-strykere': '/musikk',
    '/pris-til-søknad': '/priser',
    '/pricing-plans/plans-pricing': '/priser',

    // Wix service-pages
    '/service-page/øverommet-1': '/timeleie',
    '/service-page/øverommet-timeleie': '/timeleie',
    '/service-page/musikkrommet-1': '/timeleie',
    '/service-page/musikkrommet-timeleie-2': '/timeleie',
    '/service-page/produsentrommet-1': '/timeleie',
    '/service-page/produsentrommet-timeleie': '/timeleie',
    '/service-page/podkaststudio-timeleie': '/podkast',
    '/service-page/vokalinnspilling': '/innspilling/vokal',

    // Gavekort / produkt-sider → ekstern shop
    '/gavekort': 'https://booking.mobulamusic.no/shop',
    '/category/gavekort': 'https://booking.mobulamusic.no/shop',
    '/category/all-products': 'https://booking.mobulamusic.no/shop',
    '/product-page/digitalt-gavekort-5-timer-innspilling': 'https://booking.mobulamusic.no/shop',
    '/product-page/gavekort-5-timer-innspilling': 'https://booking.mobulamusic.no/shop',
    '/product-page/digitalt-gavekort-3-timer-innspilling': 'https://booking.mobulamusic.no/shop',
    '/product-page/digitalt-gavelkort-3-timer-innspilling': 'https://booking.mobulamusic.no/shop',
    '/product-page/gavekort-3-timer-innspilling': 'https://booking.mobulamusic.no/shop',
    '/product-page/digitalt-gavekort-2-timer-innspilling-enkel-miks': 'https://booking.mobulamusic.no/shop',
    '/product-page/digitalt-gavekort-på-2-timer-innspilling': 'https://booking.mobulamusic.no/shop',
    '/product-page/fysisk-gavekort-2-timer-innspilling-enkel-miks': 'https://booking.mobulamusic.no/shop',

    // Booking
    '/book-online': 'https://booking.mobulamusic.no/',

    // Bloggposter som skal beholdes (slug-mapping til nye poster)
    '/post/spill-inn-strykearrangement-13-april': '/nyheter/fellesinnspilling-april',
    '/post/spill-inn-strykearrangement-23-februar': '/nyheter/fellesinnspilling-april',
    '/post/hvordan-vi-gjør-voice-over-til-tv-produksjon': '/nyheter/voice-over-studio',
    '/post/korpsinnspilling-i-studio': '/nyheter/korpsinnspilling',

    // Øvrige bloggposter → /nyheter
    '/post/det-er-i-studio-magien-skjer': '/nyheter',
    '/post/låtskriving-med-artist': '/nyheter',
    '/post/lær-å-arrangere-for-strykere': '/nyheter',
    '/post/timeleie-av-studiorom': '/nyheter',

    // Blogg-kategorier og tags → /nyheter
    '/blog/categories/aktiviteter': '/nyheter',
    '/blog/categories/innspillinger': '/nyheter',
    '/blog/tags/regissør': '/nyheter',
    '/blog/tags/voicingstudio': '/nyheter',
    '/blog/tags/viaplay': '/nyheter',
    '/blog/tags/dokudrama': '/nyheter',
    '/blog/tags/tv-produksjon': '/nyheter',
    '/blog/tags/innspilling-av-voice-over': '/nyheter',
    '/blog/tags/voice-over': '/nyheter',
    '/blog/tags/vo': '/nyheter',

    // Diverse Wix-rester → forside
    '/profile/mail/profile': '/',
    '/skjema-fellesinnspilling': '/',

    // Engelske varianter
    '/en/book-online': '/',
    '/en/podkaststudio': '/en/podcast',
    '/en/podkast': '/en/podcast',
    '/en/utleiestudio': '/en/about#studio',
    '/en/innspillingsrom': '/en/recording',
    '/en/vokalinnspilling': '/en/recording/vocal',
    '/en/plateinnspilling': '/en/recording',
    '/en/bulkinnspilling': '/en/recording/band-and-ensemble',
    '/en/spille-inn-podcast': '/en/podcast',
    '/en/kurs-i-arrangering': '/en/music',
    '/en/service-page/musikkrommet-1': '/en/recording/band-and-ensemble',
    '/en/service-page/podkaststudio-timeleie': '/en/podcast',
    '/en/music/composition-for-theatre': '/en/music/stage-and-theatre',
    '/en/product-page/digitalt-gavekort-5-timer-innspilling': 'https://booking.mobulamusic.no/shop',
    '/en/product-page/fysisk-gavekort-2-timer-innspilling-enkel-miks': 'https://booking.mobulamusic.no/shop',

    // Tyske varianter → tilsvarende engelske
    '/de/komposisjon': '/en/music',
    '/de/kopi-av-lei-ditt-eget-studio': '/en/about#studio',
    '/de/kurs-i-arrangering': '/en/music',
    '/de/general-8': '/en',
    '/de/podkast': '/en/podcast',
    '/de/service-page/musikkrommet-timeleie-2': '/en/recording',
    '/de/product-page/fysisk-gavekort-2-timer-innspilling-enkel-miks': 'https://booking.mobulamusic.no/shop',
    '/de/product-page/digitalt-gavekort-5-timer-innspilling': 'https://booking.mobulamusic.no/shop',
  },
});
