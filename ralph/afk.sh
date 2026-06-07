#!/bin/bash
set -eo pipefail

if [ -z "$1" ]; then
  echo "Uso: $0 <iteracoes>"
  exit 1
fi

for ((i=1; i<=$1; i++)); do
  result_file=$(mktemp)
  trap "rm -f $result_file" EXIT

  commits=$(git log -n 5 --format="%H%n%ad%n%B---" --date=short 2>/dev/null || echo "Nenhum commit encontrado")
  tasks=$(cat tasks/tasks*.md 2>/dev/null || echo "Nenhum arquivo de tasks encontrado")
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
    --output-last-message "$result_file" \
    -

  result=$(cat "$result_file")
  rm -f "$result_file"

  if [[ "$result" == *"<promise>NO MORE TASKS</promise>"* ]]; then
    echo "Ralph concluido apos $i iteracoes."
    exit 0
  fi
done
