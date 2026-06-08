# Convenções de Git

Este repositório segue um conjunto simples de convenções de git que deve ser aplicado por padrão.

## Nomes De Branch

- Use um prefixo que corresponda ao tipo de trabalho.
- Prefixo padrão para funcionalidades: `feat/`
- Outros prefixos permitidos: `fix/`, `docs/`, `test/`, `chore/`
- Mantenha o sufixo curto, em minúsculas e com `kebab-case`

Exemplos:

- `feat/git-conventions`
- `fix/alert-message`
- `docs/api-contracts`

## Mensagens De Commit

- Use apenas um assunto em uma linha.
- Não adicione corpo, quebras de parágrafo, bullets ou explicações extras.
- Prefira o formato Conventional Commits.
- Não use parênteses vazios de escopo como `feat()`: use `feat(scope): ...` quando houver escopo, ou `feat: ...` quando não houver.
- Mantenha o assunto conciso e focado na mudança.
- O subject deve idealmente ter até 60 caracteres; até 72 ainda costuma ser aceitável.

Exemplos:

- `feat(git): add branch naming rule`
- `docs(git): define commit format`
- `chore(ci): simplify validation step`

## Regra Prática

Se o nome de branch ou a mensagem de commit ficar difícil de ler em um histórico rápido, encurte.

## Fonte De Verdade

Esta regra deve ser usada junto com [AGENTS.md](../AGENTS.md) e [docs/language-conventions.md](language-conventions.md).
