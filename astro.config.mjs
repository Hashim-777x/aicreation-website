import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://aicreation.pro',
  output: 'static',
  trailingSlash: 'never',
  i18n: { defaultLocale: 'en', locales: ['en', 'ar'], routing: { prefixDefaultLocale: false } },
  integrations: [sitemap({ filter: (page) => !new URL(page).pathname.startsWith('/404') })],
});
