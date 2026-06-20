// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

const site = process.env.PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://astro-studio-utopo4ek.amvera.io';

export default defineConfig({
  site,
  redirects: {
    '/portfolio/portofino': '/portfolio/piccolino',
  },
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [react(), sitemap()],
});
