---
name: project-bootstrap
description: First-time setup of this repository as an Astro static site with SEO and GSAP/Lenis animation wired in. Use when package.json does not exist yet, or when the user says "셋업해줘", "초기 세팅", "bootstrap", "프로젝트 생성". Do not use once the project already builds.
---

# Project bootstrap (Astro static + SEO + motion)

Run the steps in order. Stop and report to the user if any step fails; don't improvise a different stack.

## 0. Ask only what you can't infer

Before touching files, ask the user in ONE message (Korean) for:
- 배포 도메인 (예: `https://example.co.kr`) — needed for `site`, canonical, sitemap. If unknown, use `https://example.com` and leave a `TODO(domain)` comment.
- 사이트 이름 / 한 줄 설명 (기본 title·description)
- 배포처 (Cloudflare Pages / S3+CloudFront / Netlify / Vercel / 미정)

## 1. Check the environment

```bash
node -v   # must satisfy astro's engines field (check with: npm view astro engines)
npm -v
```
If Node is too old, tell the user to upgrade (nvm/fnm) and stop.

## 2. Scaffold into a temp dir, then merge

The repo already contains AGENTS.md, CLAUDE.md, .agents/, .claude/, .codex/, so don't scaffold into `.` directly.

```bash
npm create astro@latest .astro-tmp -- --template minimal --no-install --no-git --yes
```
If the flags were rejected, run `npm create astro@latest -- --help` and adapt. Then move everything from `.astro-tmp/` into the repo root without overwriting existing files, and delete `.astro-tmp`:

```bash
cat .astro-tmp/AGENTS.md        # 템플릿 안내를 읽고 우리 AGENTS.md의 'Astro 공식 안내' 섹션과 비교
rm .astro-tmp/AGENTS.md          # 우리 AGENTS.md가 원본. 절대 덮어쓰지 않는다
cp -rn .astro-tmp/. . && rm -rf .astro-tmp
```

The template's `AGENTS.md` holds Astro's own agent notes. Its content is already merged into the "Astro 공식 안내" section of our AGENTS.md; if the template's version has new guidance (read it above), update only that section. Set `"name"` in package.json to the repo/site slug (the template leaves `astro-tmp`).

## 3. Install

```bash
npm install
npx astro add sitemap --yes
npm install gsap lenis
npm install -D @astrojs/check typescript prettier prettier-plugin-astro
node -v | sed 's/v//' > .nvmrc
```

Confirm `tsconfig.json` extends `astro/tsconfigs/strict`.

## 4. Config

`astro.config.mjs` — keep whatever the sitemap integration added, and make sure it ends up like:

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://example.com', // TODO(domain)
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },   // /about → about.html, matches trailingSlash: 'never'
  integrations: [sitemap()],
});
```

If the deploy target is S3+CloudFront and the user prefers directory URLs, use `trailingSlash: 'always'` + `build.format: 'directory'` instead. Pick one pair; never mix.

`package.json` scripts:

```json
{
  "dev": "astro dev",
  "build": "astro check && astro build",
  "preview": "astro preview",
  "check": "astro check",
  "format": "prettier --write ."
}
```

`.prettierrc`: `{ "plugins": ["prettier-plugin-astro"], "singleQuote": true }`

## 5. Create the skeleton

Follow the `astro-seo` and `gsap-astro` skills for the exact contents. Files to create:

- `src/styles/tokens.css` — color, type scale, spacing, `--ease-out`, `--dur-*` variables (placeholder values; real ones come from the design step)
- `src/styles/global.css` — reset, imports tokens, `@view-transition { navigation: auto; }`, reduced-motion fallback
- `src/components/seo/Seo.astro` — from `astro-seo`
- `src/components/seo/JsonLd.astro` — from `astro-seo`
- `src/layouts/BaseLayout.astro` — `<html lang="ko">`, `html.js` class script, `<Seo />`, global css, `<slot />`, motion script
- `src/scripts/motion.ts` — from `gsap-astro`
- `src/pages/index.astro` — one `<h1>`, uses BaseLayout, one `[data-reveal]` example
- `src/pages/404.astro` — uses BaseLayout with `noindex`
- `src/pages/robots.txt.ts` — from `astro-seo`
- `public/og-default.png` — placeholder 1200×630 (note it as TODO)
- `.env.example` with `PUBLIC_GOOGLE_SITE_VERIFICATION=` and `PUBLIC_NAVER_SITE_VERIFICATION=`
- `.gitignore` must include `dist/`, `.astro/`, `node_modules/`, `.env` (do NOT ignore `.agents/`, `.claude/`, `.codex/`)
- Confirm `.claude/skills` is still a symlink to `../.agents/skills`

## 6. Verify

```bash
npm run build
ls dist/
```
Check that `dist/` contains `index.html`, `404.html`, `robots.txt`, `sitemap-index.xml`, and that `index.html` has canonical, og:*, and `lang="ko"`. If the `webapp-testing` skill's dependencies are available, screenshot `npm run preview` at 375px and 1440px.

## 7. Report

Tell the user (Korean, short):
- what was created
- remaining TODOs (domain, OG image, verification codes, real design tokens)
- next step suggestion: "디자인 방향부터 잡을까요?" → `frontend-design`

Then `git init` only if the user asks; otherwise suggest it.
