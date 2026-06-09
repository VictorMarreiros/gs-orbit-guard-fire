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

## Estratégia De Commit

- Prefira um commit por assunto lógico, com o menor recorte que ainda deixe o histórico legível.
- Quando a mudança atingir áreas diferentes, separe em commits distintos se cada parte puder ser validada sozinha.
- Evite misturar documentação, domínio, contratos de API, testes e tooling no mesmo commit quando a separação for clara.
- Se a alteração precisar ser atômica para preservar coerência, use um único commit com escopo representativo da parte dominante.
- Mantenha a sequência natural do trabalho: primeiro documentação e decisões, depois contratos e domínio, depois implementação e por fim testes e ajustes de qualidade.
- Use `docs` para documentação e rastreabilidade, `feat` para comportamento novo, `test` para validação e `chore` para setup, tooling e manutenção.
- Prefira subjects curtos que indiquem o resultado final da mudança, não a lista de arquivos alterados.

Exemplos de recorte:

- `docs(git): define commit format`
- `feat(domain): add monitored area model`
- `feat(api): add risk calculation contract`
- `test(risk): cover critical scenario`
- `chore(ci): simplify validation pipeline`

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
