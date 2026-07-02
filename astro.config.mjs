// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // IMPORTANT: Replace this with your exact live domain for SEO (e.g. 'https://app.bandhannova.in')
  site: 'https://sentinel.bandhannova.in',
  output: 'server',
  adapter: cloudflare(),
  integrations: [react(), tailwind(), sitemap()]
});