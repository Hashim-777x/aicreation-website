import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://aicreation.pro',
  output: 'static',
  trailingSlash: 'never',
  integrations: [sitemap({ filter: (page) => !new URL(page).pathname.startsWith('/404') })],
});
