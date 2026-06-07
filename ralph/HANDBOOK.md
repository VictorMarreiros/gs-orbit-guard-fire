# Handbook do Ralph

## Objetivo

Ralph é o fluxo local para executar uma task por vez do OrbitGuard Fire usando o contexto do repositório, os arquivos `tasks/tasks*.md`, o prompt em `ralph/prompt.md` e a skill `/tdd`.

Ele substitui o fluxo antigo baseado em `issues/`: a fila de trabalho agora vem dos checkboxes `- [ ]` nos arquivos de tasks.

## Arquivos principais

- `ralph/once.sh`: executa uma única iteração com `codex --ask-for-approval never exec`.
- `ralph/afk.sh`: executa várias iterações com `codex --ask-for-approval never exec`.
- `ralph/prompt.md`: define as regras operacionais que o agente deve seguir.
- `.codex/skills/tdd/`: define como aplicar TDD neste projeto.
- `tasks/tasks*.md`: fonte da fila de tasks abertas e local onde a evidência deve ser registrada.
- `AGENTS.md`: regras técnicas e critérios mínimos de done do repositório.

## Pré-requisitos

Para `ralph/once.sh`:

- Bash disponível.
- CLI `codex` configurado e autenticado.
- Repositório com acesso ao histórico Git.

Para `ralph/afk.sh`:

- Bash disponível.
- CLI `codex` configurado e autenticado.
- `mktemp` disponível no ambiente Bash.

No Windows, prefira executar via Git Bash, WSL ou outro shell compatível. Se o Git Bash falhar com erro de permissão/MSYS, use WSL.

Para diagnosticar a instalação do Codex:

```bash
codex doctor
```

## Como preparar uma execução

Antes de rodar Ralph:

1. Garanta que `tasks/tasks*.md` tenha pelo menos uma task aberta marcada como `- [ ]`.
2. Confirme que a task tem critério de pronto claro.
3. Revise se há mudanças locais importantes que você não quer misturar.
4. Se a task envolver contrato, entidade ou persistência, confira se os documentos correspondentes estão atualizados ou prontos para serem atualizados.

Ralph lê automaticamente:

- os últimos 5 commits;
- o conteúdo de `tasks/tasks*.md`;
- as regras de `ralph/prompt.md`.

## Execução única

Use quando quiser acompanhar uma única rodada:

```bash
./ralph/once.sh
```

Comportamento esperado:

- o agente escolhe uma task `- [ ]`;
- usa `/tdd` para trabalhar;
- altera somente uma task por execução;
- roda validações relevantes;
- atualiza `tasks/tasks*.md` com `- [x]` e `Evidencia de validacao` se concluir;
- cria um commit semântico.

## Execução AFK

Use quando quiser permitir várias iterações:

```bash
./ralph/afk.sh 3
```

O número indica o limite de iterações.

O script para antes do limite se o agente responder:

```text
<promise>NO MORE TASKS</promise>
```

Esse marcador significa que Ralph não encontrou mais tasks abertas em `tasks/tasks*.md`.

## Critérios de uma boa task para Ralph

Uma task boa para execução automatizada deve:

- ter escopo pequeno;
- ter critério de pronto verificável;
- indicar referências de PRD/docs quando relevante;
- poder ser validada por teste, typecheck, smoke test ou evidência manual objetiva;
- não depender de decisão de produto ainda aberta.

Evite rodar Ralph em tasks que exigem julgamento humano amplo, como redefinir escopo, aprovar UX final ou escolher estratégia de produto.

## Validação esperada

Para backend, Ralph deve preferir:

```bash
cd backend && npm run check
```

E testes direcionados no padrão atual:

```bash
cd backend && node -r ts-node/register test\\nome-do-teste.test.ts
```

Para protótipo HTML/JS, Ralph pode usar validação sintática com `node --check` ou registrar evidência manual objetiva.

O projeto não possui scripts raiz `npm run test` ou `npm run typecheck`; Ralph não deve usá-los.

## Como revisar uma rodada

Depois da execução, confira:

1. `git status --short`
2. `git show --stat --oneline HEAD`
3. a task alterada em `tasks/tasks*.md`
4. as evidências registradas na task
5. arquivos de contrato/docs quando a mudança afetar API, domínio ou persistência

Se a rodada criou commit, revise também:

```bash
git show --name-only HEAD
```

## Regras de segurança

Ralph deve:

- trabalhar em apenas uma task por execução;
- preservar o MVP demonstrativo;
- manter mocks controlados quando documentados;
- atualizar docs e contracts quando alterar shapes públicas;
- não mover arquivos de task;
- não usar `issues/` nem `issues/done/`;
- não marcar task como concluída sem evidência;
- não introduzir integrações reais sem task e documentação que as justifiquem.

## Quando interromper

Interrompa e revise manualmente se Ralph:

- escolher uma task já concluída;
- tentar trabalhar em mais de uma task;
- alterar contrato público sem atualizar `docs/api-contracts.md`;
- alterar entidade sem revisar Prisma e docs de modelo;
- tentar usar comandos inexistentes como `npm run test` na raiz;
- fizer refatoração ampla sem relação direta com a task;
- não conseguir executar validação e não registrar justificativa.

## Troubleshooting

### `No task files found`

Confirme que existem arquivos no padrão:

```text
tasks/tasks*.md
```

### `Usage: ./ralph/afk.sh <iterations>`

O modo AFK exige o número de iterações:

```bash
./ralph/afk.sh 1
```

### Erro de Bash no Windows

Se o Git Bash falhar com erro MSYS ou de permissão, rode via WSL.

### Ralph não para mesmo sem tasks

Confira se o agente retornou exatamente:

```text
<promise>NO MORE TASKS</promise>
```

O `afk.sh` procura esse texto no resultado final.

## Checklist rápido

Antes:

```text
[ ] Existe task aberta em tasks/tasks*.md
[ ] Mudanças locais foram revisadas
[ ] Ambiente tem codex autenticado
```

Depois:

```text
[ ] Apenas uma task foi trabalhada
[ ] Validação foi executada ou justificada
[ ] tasks/tasks*.md tem evidência
[ ] Commit semântico foi criado quando a task foi concluída
```
