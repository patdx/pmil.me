import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import Icons from 'unplugin-icons/vite';
import tailwind from '@astrojs/tailwind';
import robotsTxt from 'astro-robots-txt';

// https://astro.build/config
// import solidJs from './src/solid-integration/index';
import solidJs from '@astrojs/solid-js';

// https://astro.build/config
// import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
// import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://pmil.me/',
  build: {
    format: 'file',
  },
  integrations: [
    mdx(),
    solidJs(),
    sitemap(),
    tailwind(),
    robotsTxt(),
    solidJs(),
  ],
  vite: {
    plugins: [
      Icons({
        compiler: 'astro',
        scale: 1.5,
      }),
    ],
  },
});
