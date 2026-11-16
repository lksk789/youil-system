#!/usr/bin/env bash
# .claude/skills 가 .agents/skills 를 가리키도록 다시 연결한다.
# (Windows에서 git이 심볼릭 링크를 일반 파일로 체크아웃했을 때 등)
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p .claude
rm -rf .claude/skills
if ln -s ../.agents/skills .claude/skills 2>/dev/null; then
  echo "linked .claude/skills -> ../.agents/skills"
else
  cp -r .agents/skills .claude/skills
  echo "symlink 불가 → 복사본 생성. .agents/skills 를 수정했다면 이 스크립트를 다시 실행하세요."
fi
