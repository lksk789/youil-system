# CLAUDE.md

프로젝트 규칙은 모두 AGENTS.md에 있다 (Codex와 공용). 이 파일에는 규칙을 추가하지 않는다.

@AGENTS.md

## Claude Code 전용 메모

- 스킬: `.claude/skills` → `.agents/skills` 심볼릭 링크. 링크가 깨져 있으면(`ls -la .claude`) `./scripts/link-skills.sh` 실행을 사용자에게 제안한다.
- 모션 리뷰는 `/review-animations`로 호출한다.
- MCP: `.mcp.json`의 `astro-docs`. 권한: `.claude/settings.json`.
