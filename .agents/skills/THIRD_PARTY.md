# 서드파티 스킬 출처

2026-11-16에 각 저장소의 main 브랜치에서 가져옴. 갱신은 `scripts/update-skills.sh`.
직접 수정하지 말고, 프로젝트 규칙은 커스텀 스킬(`project-bootstrap`, `astro-seo`, `gsap-astro`)이나 AGENTS.md에 둘 것.

| 스킬 | 저장소 (커밋) | 라이선스 | 용도 |
|---|---|---|---|
| frontend-design | anthropics/skills (1780c5e) | Apache-2.0 | 템플릿 같지 않은 디자인 방향 |
| webapp-testing | anthropics/skills (1780c5e) | Apache-2.0 | Playwright로 로컬 화면 확인·스크린샷 |
| web-design-guidelines | vercel-labs/agent-skills (1a2c79d) | MIT | UI/접근성 리뷰 (실행 시 최신 가이드라인을 fetch) |
| astro | astrolicious/agent-skills (cb4839f) | MIT | Astro 기본 사용법 |
| animate | emilkowalski/skills (64eb3de) | MIT | 모션 설계·구현 판단 순서 |
| animation-performance | emilkowalski/skills (64eb3de) | MIT | 프레임 드랍 진단 |
| review-animations | emilkowalski/skills (64eb3de) | MIT | 모션 코드 리뷰 (자동 실행 안 됨 — Claude Code는 `/review-animations`, Codex는 스킬 이름으로 직접 호출) |
| web-perf | cloudflare/skills (cbf893b) | Apache-2.0 | Core Web Vitals / Lighthouse |
| seo-audit | coreyhaines31/marketingskills (1f83744) | MIT | 기술 SEO 점검 (evals 폴더 제외) |
| schema | coreyhaines31/marketingskills (1f83744) | MIT | JSON-LD 선택·검증 (evals 폴더 제외) |

webapp-testing은 Python + Playwright가 필요하다: `pip install playwright && playwright install chromium`
