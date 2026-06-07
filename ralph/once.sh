#!/bin/bash
set -eo pipefail

tasks=$(cat tasks/tasks*.md 2>/dev/null || echo "Nenhum arquivo de tasks encontrado")
commits=$(git log -n 5 --format="%H%n%ad%n%B---" --date=short 2>/dev/null || echo "Nenhum commit encontrado")
prompt=$(cat ralph/prompt.md)
payload="Commits anteriores:
$commits

Arquivos de tasks:
$tasks

$prompt"

printf '%s\n' "$payload" | codex \
  --ask-for-approval never \
  exec \
  --cd . \
  --sandbox workspace-write \
  -
