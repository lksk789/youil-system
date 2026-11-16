---
name: astro-seo
description: This project's SEO implementation for Astro static pages — the Seo component, canonical/OG/Twitter tags, JSON-LD, sitemap, robots.txt, and Google/Naver verification. Use whenever creating a page or layout, touching <head>, adding meta tags, structured data, sitemap or robots, or when the user mentions 검색엔진, SEO, 네이버, 구글 서치콘솔, OG 이미지.
---

# Astro SEO (this project's conventions)

One rule above all: **every tag in `<head>` comes from `Seo.astro`.** Pages pass props; they never write meta tags themselves.

> **This project is bilingual (en default, ko at `/ko`).** The live `src/components/seo/Seo.astro` extends the template below with a required `lang` prop, per-locale `og:locale`, and hreflang alternates (`alternates` prop) using helpers in `src/i18n/ui.ts`. Treat the real file as the source of truth; the template below is the single-language baseline.

If an Astro API below looks out of date, search the `astro-docs` MCP and use the current form.

## Seo.astro

`src/components/seo/Seo.astro`

```astro
---
interface Props {
  title: string;
  description: string;
  image?: string;          // absolute path from /public or an imported asset's .src
  imageAlt?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  publishedTime?: string;  // ISO, articles only
}

const SITE_NAME = '사이트 이름'; // TODO: set during bootstrap
const {
  title,
  description,
  image = '/og-default.png',
  imageAlt = SITE_NAME,
  type = 'website',
  noindex = false,
  publishedTime,
} = Astro.props;

if (!Astro.site) throw new Error('astro.config의 site가 비어 있습니다.');

// trailingSlash: 'never' 기준 정규화. 'always'로 바꾸면 이 부분도 끝에 '/'를 붙이도록 수정.
const path =
  Astro.url.pathname.replace(/(\/index)?\.html$/, '').replace(/\/$/, '') || '/';
const canonical = new URL(path, Astro.site).href;
const ogImage = new URL(image, Astro.site).href;
const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;

const googleVerify = import.meta.env.PUBLIC_GOOGLE_SITE_VERIFICATION;
const naverVerify = import.meta.env.PUBLIC_NAVER_SITE_VERIFICATION;
---
<title>{fullTitle}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />
{noindex && <meta name="robots" content="noindex, nofollow" />}

<meta property="og:type" content={type} />
<meta property="og:site_name" content={SITE_NAME} />
<meta property="og:locale" content="ko_KR" />
<meta property="og:title" content={fullTitle} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta property="og:image" content={ogImage} />
<meta property="og:image:alt" content={imageAlt} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
{publishedTime && <meta property="article:published_time" content={publishedTime} />}

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={fullTitle} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImage} />

{googleVerify && <meta name="google-site-verification" content={googleVerify} />}
{naverVerify && <meta name="naver-site-verification" content={naverVerify} />}

<link rel="sitemap" href="/sitemap-index.xml" />
```

Rules for props:
- `title`: 30–60자 권장, 페이지마다 고유.
- `description`: 70–155자, 페이지마다 고유, 실제 내용 요약 (키워드 나열 금지).
- 404, 감사 페이지, 미리보기 페이지는 `noindex`.

## JsonLd.astro

`src/components/seo/JsonLd.astro`

```astro
---
interface Props { data: Record<string, unknown> | Record<string, unknown>[] }
const { data } = Astro.props;
---
<script type="application/ld+json" set:html={JSON.stringify(data)} />
```

Default in `BaseLayout` for the home page: `Organization` (name, url, logo, sameAs) + `WebSite`. Add `BreadcrumbList` on nested pages, `Article` on posts. Pick types with the `schema` skill; don't add FAQ markup just for rich results.

## BaseLayout head order

```astro
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script is:inline>document.documentElement.classList.add('js')</script>
    <Seo {...seo} />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <!-- font preload (body font only) -->
    <slot name="head" />
  </head>
```

The inline `js` class must stay first so CSS can hide reveal targets only when JS runs (see `gsap-astro`).

## robots.txt

`src/pages/robots.txt.ts`

```ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href;
  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
};
```

Don't block Yeti (Naver) or Googlebot. Don't block `/_astro/` (CSS/JS needed for rendering).

## Sitemap

`@astrojs/sitemap` in `astro.config`. Exclude noindex pages:

```js
sitemap({ filter: (page) => !page.includes('/404') })
```

## Korean search engines checklist (tell the user; these are manual)

1. Google Search Console: 도메인 등록 → 인증 메타 값을 `.env`의 `PUBLIC_GOOGLE_SITE_VERIFICATION` → 배포 → `sitemap-index.xml` 제출
2. 네이버 서치어드바이저: 사이트 등록 → HTML 태그 인증 값을 `PUBLIC_NAVER_SITE_VERIFICATION` → 배포 → 요청 > 사이트맵 제출, RSS가 있으면 RSS도 제출
3. 배포 후 실제 페이지 소스에서 canonical·og:image가 운영 도메인 절대 URL인지 확인
4. 카카오톡 공유 미리보기 캐시는 카카오 개발자 도구의 공유 디버거에서 초기화

## Pre-merge checks for any page

- [ ] `<h1>` 하나, heading 순서
- [ ] 고유 title/description
- [ ] 이미지 alt, `<Image />` 사용, width/height 지정 (CLS 방지)
- [ ] 내부 링크가 `trailingSlash` 규칙과 일치
- [ ] 텍스트가 빌드된 HTML에 그대로 있음 (`dist/*.html`을 열어 확인)
