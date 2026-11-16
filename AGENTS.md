# AGENTS.md

> Claude Code와 Codex가 함께 읽는 단일 규칙 파일이다. `CLAUDE.md`는 이 파일을 import만 한다. 규칙은 여기서만 고친다.

이 저장소는 **SEO가 중요한 순수 정적 웹사이트**다. Astro로 빌드해서 `dist/`의 HTML/CSS/JS만 배포하고, 운영 환경에는 서버나 Node가 없다.

## 0. 처음 열었을 때 (부트스트랩)

`package.json`이 없으면 아직 프로젝트가 생성되지 않은 상태다. 다른 작업보다 먼저
`.agents/skills/project-bootstrap/SKILL.md`를 읽고 그 순서대로 셋업을 끝낸 뒤 사용자에게 보고한다.
`package.json`이 있으면 이 단계는 건너뛴다.

## 1. 스택 (임의로 바꾸지 말 것)

| 영역 | 선택 | 비고 |
|---|---|---|
| 프레임워크 | Astro (최신 stable), `output: 'static'` | SSR 어댑터 추가 금지 |
| 언어 | TypeScript strict | |
| 스타일 | 컴포넌트 스코프 `<style>` + `src/styles/tokens.css` 전역 토큰 | Tailwind는 사용자가 요청할 때만 |
| 애니메이션 | GSAP(+ScrollTrigger), Lenis | 가벼운 효과는 CSS 우선 |
| SEO | `@astrojs/sitemap`, 자체 `<Seo />` 컴포넌트, JSON-LD | |
| 패키지 매니저 | npm | lockfile 커밋 |
| Node | 22 LTS 이상 (Astro `engines` 기준을 따름) | `.nvmrc` 유지 |

UI 프레임워크(React/Vue/Svelte) 아일랜드는 **꼭 필요한 인터랙션이 있을 때만** 추가하고, 추가 전에 사용자에게 이유를 말한다. 기본은 `.astro` + 바닐라 `<script>`.

## 2. 명령어

에이전트는 개발 서버를 **백그라운드로** 띄운다 (터미널을 막지 않도록):

```bash
npx astro dev --background   # 개발 서버 (localhost:4321), 이미 떠 있으면 status로 확인
npx astro dev status         # 상태 확인 (logs, stop도 같은 형식)
npm run dev        # 사람이 직접 띄울 때
npm run build      # astro check && astro build → dist/
npm run preview    # 빌드 결과 미리보기
npm run check      # 타입/템플릿 검사
```

작업을 끝냈다고 말하기 전에 **반드시 `npm run build`가 통과**해야 한다.

### Astro 공식 안내 (create-astro 템플릿의 AGENTS.md에서 병합)

- 개발 서버는 `astro dev --background`로 띄우고 `astro dev stop | status | logs`로 관리한다.
- 관련 작업 전에 해당 공식 가이드를 확인한다: [라우팅](https://docs.astro.build/en/guides/routing/), [컴포넌트](https://docs.astro.build/en/basics/astro-components/), [프레임워크 컴포넌트](https://docs.astro.build/en/guides/framework-components/), [콘텐츠 컬렉션](https://docs.astro.build/en/guides/content-collections/), [스타일링](https://docs.astro.build/en/guides/styling/), [i18n](https://docs.astro.build/en/guides/internationalization/)

## 3. 디렉터리 규칙

```
src/
  pages/            # 라우트. 파일명 = URL (kebab-case)
  layouts/          # BaseLayout.astro 하나가 <html>, <head>, <Seo/>를 소유
  components/       # PascalCase.astro
    seo/Seo.astro   # 모든 메타 태그의 단일 출처
  scripts/          # 애니메이션 등 클라이언트 JS (motion.ts 등)
  styles/           # tokens.css, global.css
  content/          # 마크다운 콘텐츠가 생기면 content collections로
  assets/           # astro:assets로 최적화할 이미지
public/             # 그대로 복사되는 파일 (favicon, og 기본 이미지, 폰트)
```

## 4. SEO 규칙 (위반 시 작업 미완료로 간주)

- 모든 페이지는 `BaseLayout`을 거쳐 `<Seo title description />`를 받는다. title·description 없는 페이지 금지.
- `astro.config`의 `site`는 실제 배포 도메인. canonical, sitemap, OG URL이 전부 여기서 나온다.
- 다국어: 영어가 기본(`/`), 한국어는 `/ko` (Astro `i18n`, `prefixDefaultLocale: false`). 페이지는 `BaseLayout`에 `lang`을 넘기고, `<html lang>`·`og:locale`·hreflang은 `Seo`가 만든다. 한쪽 언어에만 있는 페이지는 `alternates: false`. 로케일 문자열·경로 헬퍼는 `src/i18n/ui.ts`.
- 페이지당 `<h1>` 정확히 하나, heading 레벨 건너뛰지 않기.
- 콘텐츠는 **빌드된 HTML에 텍스트로 존재**해야 한다. JS로 텍스트를 생성·주입하지 않는다.
- 이미지는 `astro:assets`의 `<Image />`, 모든 `alt` 필수(장식이면 `alt=""`). 첫 화면 대표 이미지는 `loading="eager"`, 나머지는 lazy.
- `trailingSlash` 정책을 config에 명시하고 내부 링크도 그 규칙에 맞춘다.
- 구글 서치 콘솔 + **네이버 서치어드바이저** 인증 메타는 환경변수로 받는다 (`PUBLIC_GOOGLE_SITE_VERIFICATION`, `PUBLIC_NAVER_SITE_VERIFICATION`).
- 상세 구현은 `astro-seo` 스킬. 감사는 `seo-audit`, 구조화 데이터는 `schema` 스킬.

## 5. 애니메이션 규칙

- 먼저 "애니메이션이 필요한가"를 판단한다(`animate` 스킬의 게이트).
- 스크롤 등장 연출은 클라이언트 요청으로 사이트 전반에 쓴다: 첫 화면 아래의 섹션 제목·행·카드·연혁 항목에 `data-reveal`을 붙이고, 같은 묶음 안에서는 순차(stagger, 약 90ms)로 등장시킨다. 이동은 `translateY` 약 48px + opacity, 약 0.8–0.9s `--ease-out`. 첫 화면에 보이는 요소는 대상이 아니다.
- `transform`, `opacity`만 애니메이트한다. `top/left/width/height/margin` 금지.
- 모든 모션은 `prefers-reduced-motion: reduce`에서 꺼지거나 즉시 최종 상태가 된다 (`gsap.matchMedia()` 사용).
- **첫 화면(LCP 요소)을 `opacity: 0`으로 숨기지 않는다.** 히어로 연출은 짧게, 콘텐츠는 처음부터 보이게.
- 초기 숨김 상태는 CSS가 아니라 JS가 붙인 클래스(`html.js`)를 기준으로 한다 → JS 실패해도 콘텐츠가 보인다.
- GSAP/Lenis 연결 방식과 정리(cleanup) 패턴은 `gsap-astro` 스킬을 그대로 따른다.
- 페이지 전환은 기본적으로 CSS `@view-transition { navigation: auto; }`(JS 없음). Astro `<ClientRouter />`는 사용자 요청 시에만.

## 6. 디자인

- 새 페이지나 섹션 디자인 전에는 `frontend-design` 스킬을 읽고 토큰(색·타입·레이아웃)을 먼저 제안한다.
- 색·간격·폰트·이징·duration은 `src/styles/tokens.css`의 CSS 변수만 사용한다. 하드코딩한 값을 발견하면 토큰으로 옮긴다.
- 한글 웹폰트는 woff2 + 서브셋, `font-display: swap`, 본문 폰트만 `<link rel="preload">`.

## 7. 작업 흐름

1. Astro API가 조금이라도 불확실하면 **`astro-docs` MCP로 최신 문서를 먼저 검색**한다 (MCP가 연결되지 않았다면 https://docs.astro.build/llms.txt 를 참고). 학습 데이터 속 Astro 2~4 시절 API(`Astro.glob`, 구 content config 경로 등)를 쓰지 않는다.
2. 구현 → `npm run build` → 필요하면 `webapp-testing` 스킬로 `npm run preview` 화면을 스크린샷 확인(모바일 375px, 데스크톱 1440px).
3. UI를 크게 바꿨으면 출시 전 `web-design-guidelines`(접근성/UX) → `web-perf`(Core Web Vitals) → `seo-audit` 순으로 점검하고 결과를 요약한다.
4. 커밋 메시지는 Conventional Commits (`feat:`, `fix:`, `chore:` …).

## 8. 하지 말 것

- SSR 어댑터, API 라우트, 서버 전용 기능 추가
- `localStorage` 등에 콘텐츠 의존
- 사용자 확인 없이 새 의존성 추가 (GSAP, Lenis, sitemap 외)
- 불필요한 클라이언트 JS (`client:load` 남발 금지, 필요하면 `client:visible`/`client:idle`)
- `.agents/skills/` 안의 서드파티 스킬 수정 (커스터마이즈는 별도 스킬로)
- `CLAUDE.md`에 규칙 추가 (규칙은 이 파일에만 둔다)

## 9. 스킬 지도

스킬은 `.agents/skills/<이름>/SKILL.md`에 있다 (Claude Code는 `.claude/skills` 심볼릭 링크로 같은 폴더를 읽는다). 표의 상황이 오면 해당 SKILL.md를 먼저 읽는다.

| 상황 | 스킬 |
|---|---|
| 최초 셋업 | `project-bootstrap` |
| Astro 일반 | `astro` + `astro-docs` MCP |
| 메타/사이트맵/robots/JSON-LD | `astro-seo`, `schema` |
| SEO 점검 | `seo-audit` |
| 디자인 방향 | `frontend-design` |
| UI/접근성 리뷰 | `web-design-guidelines` |
| 모션 설계·구현 | `animate`, `gsap-astro` |
| 모션 버벅임 | `animation-performance` |
| 모션 리뷰 (자동 실행 안 됨, 이름으로 직접 호출) | `review-animations` |
| 성능/Lighthouse | `web-perf` |
| 브라우저로 결과 확인 | `webapp-testing` |
