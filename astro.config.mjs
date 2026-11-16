// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.youilsystem.com',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' }, // /about → about.html, trailingSlash: 'never'와 짝
  i18n: {
    locales: ['en', 'ko'],
    defaultLocale: 'en', // 해외 바이어 대상: 영어가 기본(/), 한국어는 /ko
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-US', ko: 'ko-KR' },
      },
    }),
  ],
});
