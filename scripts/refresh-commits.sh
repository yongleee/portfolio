#!/usr/bin/env bash
# Refreshes src/data/commit-activity.json and pushes it to main if it changed. Run it by hand
# (README → "Commit activity"): GitLab only lets this machine in, so it can't run in GitHub
# CI. It works in its own worktree on origin/main, so your checkout and branch are never
# touched. Pass --dry-run to do everything except the real push.
set -euo pipefail

repo=$(cd "$(dirname "$0")/.." && pwd)
work="${XDG_CACHE_HOME:-$HOME/.cache}/portfolio-commit-refresh"
json=src/data/commit-activity.json
push_flags=()
[[ ${1:-} == --dry-run ]] && push_flags=(--dry-run)

git -C "$repo" fetch --quiet origin main
[[ -d $work ]] || git -C "$repo" worktree add --quiet --detach "$work" origin/main
# --force drops anything left over from a run whose push failed; it's recomputed below.
git -C "$work" checkout --quiet --force --detach origin/main
cd "$work"

# A systemd service doesn't load nvm; `nvm use` picks the version pinned in .nvmrc.
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck source=/dev/null
. "$NVM_DIR/nvm.sh"
nvm use --silent

node --env-file="$repo/.env" scripts/fetch-commits.ts

if git diff --quiet -- "$json"; then
    exit 0
fi
git add "$json"
git commit --quiet -m 'chore: refresh commit activity'
git push --quiet "${push_flags[@]}" origin HEAD:main
echo "refresh-commits: pushed${push_flags:+ (dry run)}"
