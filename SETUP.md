# 시작 가이드 (사람용)

Astro 정적 사이트 + SEO + GSAP/Lenis 애니메이션 프로젝트를 **Claude Code와 Codex 둘 다**에서 처음부터 셋업하기 위한 키트입니다. 규칙과 스킬은 한 벌만 두고 두 도구가 같이 읽습니다.

## 구조

```
AGENTS.md                 ★ 프로젝트 규칙 원본 (Codex가 읽음, Claude는 import)
CLAUDE.md                 @AGENTS.md 한 줄 + Claude 전용 메모
.agents/skills/           ★ 스킬 원본 (Codex가 읽음)
.claude/skills  ──symlink──▶ ../.agents/skills (Claude Code가 읽음)
.mcp.json                 Claude Code용 MCP (astro-docs)
.claude/settings.json     Claude Code 권한
.codex/config.toml        Codex용 MCP (astro-docs) + 승인/샌드박스 설정
scripts/update-skills.sh  서드파티 스킬 최신화 (.agents/skills 갱신)
scripts/link-skills.sh    .claude/skills 링크 재생성
```

스킬 목록과 출처·라이선스는 `.agents/skills/THIRD_PARTY.md` 참고.
커스텀: `project-bootstrap`, `astro-seo`, `gsap-astro` / 서드파티: frontend-design, webapp-testing (Anthropic), web-design-guidelines (Vercel), astro, animate·animation-performance·review-animations (Emil Kowalski), web-perf (Cloudflare), seo-audit·schema (Corey Haines)

## 사용 순서

1. Node 22.23 이상 (`node -v`).
2. 빈 폴더에 키트 압축 해제. 숨김 폴더(`.agents`, `.claude`, `.codex`)까지 다 옮겨졌는지 확인.
3. `ls -la .claude` 로 `skills -> ../.agents/skills` 링크 확인. 깨졌으면 `./scripts/link-skills.sh`.
4. 도구 실행
   - **Claude Code**: `claude` → astro-docs MCP 사용 승인
   - **Codex**: `codex` → 이 폴더를 trusted 프로젝트로 등록해야 `.codex/config.toml`(MCP 포함)이 로드됨
5. 첫 프롬프트: **"프로젝트 셋업해줘"**
   도메인·사이트명·배포처를 물은 뒤 `project-bootstrap` 절차대로 생성 → 설치 → 빌드 검증.
6. 이후 예시
   - "메인 페이지 디자인 방향부터 잡아줘"
   - "히어로 아래 섹션들 스크롤 애니메이션 넣어줘"
   - 모션 리뷰: Claude Code `/review-animations`, Codex는 "review-animations 스킬로 리뷰해줘"
   - "배포 전에 SEO랑 성능 점검해줘"

## 규칙 수정할 때

- 규칙은 **AGENTS.md에만** 쓰세요. CLAUDE.md에 쓰면 Codex가 못 봅니다.
- 스킬 추가는 `.agents/skills/<이름>/SKILL.md`. 링크 덕분에 Claude Code도 바로 인식합니다 (복사본 모드면 `link-skills.sh` 재실행).
- MCP를 추가하면 `.mcp.json`과 `.codex/config.toml` **두 곳 모두** 넣어야 합니다.

## 참고

- Windows: git이 심볼릭 링크를 텍스트 파일로 체크아웃할 수 있습니다. `git config core.symlinks true`(개발자 모드 필요) 또는 Git Bash에서 `./scripts/link-skills.sh`(복사본 생성).
- webapp-testing 스킬은 Python Playwright 필요: `pip install playwright && playwright install chromium`. Codex 샌드박스에서는 브라우저 실행이 막힐 수 있습니다.
- GSAP는 무료지만 MIT가 아닌 자체 Standard License입니다. 배포 전 조건 확인.
