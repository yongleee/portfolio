#!/usr/bin/env bash
# Print the git-history facts a portfolio case file needs, for each repo given.
#
# Usage: repo_facts.sh [-a AUTHOR_REGEX]... REPO [REPO...]
#   -a  author pattern(s) identifying the user; repeatable, OR-ed together.
#       Defaults to the user's known identities: "yongle" and "Lee Yong Le".
# No pipefail: output is piped into head throughout, and SIGPIPE must not abort the run.
set -eu

authors=()
while getopts a: opt; do
    case $opt in
        a) authors+=("--author=$OPTARG") ;;
        *) echo "usage: $0 [-a AUTHOR_REGEX]... REPO [REPO...]" >&2; exit 2 ;;
    esac
done
shift $((OPTIND - 1))
[ ${#authors[@]} -eq 0 ] && authors=(--author=yongle "--author=Lee Yong Le")
[ $# -eq 0 ] && { echo "usage: $0 [-a AUTHOR_REGEX]... REPO [REPO...]" >&2; exit 2; }

for repo in "$@"; do
    echo "=================================================================="
    echo "REPO: $repo"
    if ! git -C "$repo" rev-parse --git-dir >/dev/null 2>&1; then
        echo "(not a git repository)"
        continue
    fi
    g() { git -C "$repo" "$@"; }

    total=$(g rev-list --all --no-merges --count)
    mine=$(g rev-list --all --no-merges "${authors[@]}" --count)
    echo "commits (no merges): $mine yours of $total"
    echo "repo span:  $(g log --all --reverse --format=%ad --date=short | head -1) .. $(g log --all -1 --format=%ad --date=short)"
    if [ "$mine" -gt 0 ]; then
        echo "your span:  $(g log --all --no-merges "${authors[@]}" --reverse --format=%ad --date=short | head -1) .. $(g log --all --no-merges "${authors[@]}" -1 --format=%ad --date=short)"
    fi

    echo
    echo "-- top contributors, all time (aliases are not merged)"
    g shortlog -sn --all --no-merges | head -12

    if [ "$mine" -gt 0 ]; then
        first=$(g log --all --no-merges "${authors[@]}" --reverse --format=%ad --date=short | head -1)
        last=$(g log --all --no-merges "${authors[@]}" -1 --format=%ad --date=short)
        echo
        echo "-- contributors active during your span (a better team-size starting point)"
        g shortlog -sn --all --no-merges --since="$first" --until="$last 23:59" | head -12

        # Gaps show up here: a lone commit months after the rest (side branch,
        # cherry-pick) stretches the span and should not count toward duration.
        echo
        echo "-- your commits per month"
        g log --all --no-merges "${authors[@]}" --format=%ad --date=format:%Y-%m | sort | uniq -c
    fi

    echo
    echo "-- stack manifests"
    find "$repo" -maxdepth 4 \
        \( -name node_modules -o -name vendor -o -name .next -o -name dist -o -name .venv -o -name .git \) -prune -o \
        \( -name package.json -o -name composer.json -o -name pyproject.toml -o -name go.mod \
           -o -name Cargo.toml -o -name requirements.txt \) -print

    echo
    echo "-- docs"
    for f in CLAUDE.md AGENTS.md README.md docs; do
        [ -e "$repo/$f" ] && echo "$f"
    done
    find "$repo" -maxdepth 3 \( -name node_modules -o -name vendor -o -name .git \) -prune -o \
        \( -name CLAUDE.md -o -name AGENTS.md \) -print | grep -v "^$repo/\(CLAUDE\|AGENTS\).md$" || true

    echo
    echo "-- CI / runtime"
    find "$repo" -maxdepth 3 \( -name node_modules -o -name vendor -o -name .git \) -prune -o \
        \( -name 'azure-pipeline*.yml' -o -name '.gitlab-ci.yml' -o -path '*/.github/workflows/*' \
           -o -name 'Dockerfile*' -o -name 'docker-compose*' -o -name '*.cron' -o -path '*/supervisor/*' \) -print

    if [ "$mine" -gt 0 ]; then
        echo
        echo "-- your commit subjects, oldest first (repeated subjects dropped)"
        g log --all --no-merges "${authors[@]}" --reverse --format='%ad %s' --date=short |
            awk '!seen[substr($0, 12)]++'
    fi
    echo
done
