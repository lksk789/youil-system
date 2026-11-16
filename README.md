# Youil System

유일시스템의 Astro 정적 웹사이트. 영어(`/`)와 한국어(`/ko`)를 지원합니다.

## 시작하기

`.nvmrc`의 Node.js 버전과 npm을 사용합니다.

```bash
nvm install
nvm use
npm ci
cp .env.example .env
npm run dev
```

개발 서버: `http://localhost:4321`. 검색엔진 인증값은 `.env.example`의 환경변수로 설정합니다.

## 명령어

| 명령어 | 용도 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run check` | 타입·템플릿 검사 |
| `npm run build` | 검사 후 정적 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run format` | 코드 포맷 |

## 구조

- `src/`: 페이지, 컴포넌트, 레이아웃, 번역, 스타일, 스크립트
- `public/`: 정적 파일
- `scripts/`: 개발 보조 도구
- `.agents/skills/`: 공유 스킬 및 원본 라이선스
- `.github/workflows/ci.yml`: push·PR 빌드 검사
- `AGENTS.md`: 공통 작업 규칙

`node_modules/`, `dist/`, `.astro/`, 실제 `.env`와 개인 설정은 제외합니다. `package-lock.json`은 커밋합니다.

## Git 작업 흐름

`main`은 배포 기준 브랜치입니다. 이후에는 `feat/작업명` 또는 `fix/작업명`에서 작업하고 PR의 빌드 검사 통과 후 병합합니다. 커밋 메시지는 Conventional Commits 형식을 사용합니다.

## 배포

`npm ci` 후 `npm run build`를 실행하고 `dist/`를 정적 호스팅에 배포합니다. 운영 환경에 Node.js는 필요하지 않습니다. 도메인은 `astro.config.mjs`의 `site`에서 관리합니다. CI는 빌드만 검사하며 배포는 별도로 설정합니다.
