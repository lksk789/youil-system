#!/usr/bin/env bash
# 서드파티 스킬을 원본 저장소 최신본으로 갱신한다. (커스텀 스킬 project-bootstrap / astro-seo / gsap-astro 는 건드리지 않음)
set -euo pipefail
cd "$(dirname "$0")/.."
DEST=.agents/skills
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT

fetch() { # repo  src-path  skill-name  [license-path]
  local repo=$1 src=$2 name=$3 lic=${4:-}
  [ -d "$TMP/${repo//\//_}" ] || git clone -q --depth=1 "https://github.com/$repo" "$TMP/${repo//\//_}"
  rm -rf "$DEST/$name"; cp -r "$TMP/${repo//\//_}/$src" "$DEST/$name"
  rm -rf "$DEST/$name/evals"
  [ -n "$lic" ] && cp "$TMP/${repo//\//_}/$lic" "$DEST/$name/LICENSE"
  echo "updated $name  ($repo@$(git -C "$TMP/${repo//\//_}" rev-parse --short HEAD))"
}

fetch anthropics/skills            skills/frontend-design        frontend-design
fetch anthropics/skills            skills/webapp-testing         webapp-testing
fetch vercel-labs/agent-skills     skills/web-design-guidelines  web-design-guidelines
fetch astrolicious/agent-skills    skills/astro                  astro
fetch emilkowalski/skills          skills/animate                animate                LICENSE
fetch emilkowalski/skills          skills/animation-performance  animation-performance  LICENSE
fetch emilkowalski/skills          skills/review-animations      review-animations      LICENSE
fetch cloudflare/skills            skills/web-perf               web-perf               LICENSE
fetch coreyhaines31/marketingskills skills/seo-audit             seo-audit              LICENSE
fetch coreyhaines31/marketingskills skills/schema                schema                 LICENSE
echo "done. git diff .agents/skills 로 변경 내용을 꼭 확인하세요."
