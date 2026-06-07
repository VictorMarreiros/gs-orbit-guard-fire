# Tasks

Os arquivos locais de tasks em `tasks/tasks*.md` foram fornecidos no início do contexto.
Leia esses arquivos para entender as tasks abertas do MVP.

Trabalhe apenas em tasks não concluídas marcadas com `- [ ]`.

Se todas as tasks estiverem concluídas, responda exatamente com:

```text
<promise>NO MORE TASKS</promise>
```

## Seleção Da Task

Escolha a próxima task não concluída em `tasks/tasks*.md`.

Priorize nesta ordem:

1. Correções críticas de bugs.
2. Infraestrutura de desenvolvimento, testes, typecheck e scripts de apoio.
3. Fatias pequenas de funcionalidade ponta a ponta do MVP.
4. Polimentos e ganhos rápidos.
5. Refatorações.

Respeite o `AGENTS.md` e os documentos definidos como fonte de verdade do projeto.

## Exploração

Antes de alterar código, explore o repositório e leia os documentos relevantes listados no `AGENTS.md`.

Use o estado atual do código, dos contratos, do Prisma e da documentação para evitar decisões paralelas ou formatos divergentes.

## Implementação

Conclua apenas uma task por execução.

Use `/tdd` para completar a task.

Preserve o fluxo demonstrativo do MVP, os mocks controlados e a evolução futura para JWT, PostgreSQL e PostGIS.

Mantenha backend, entities, contracts TypeScript, schema Prisma, documentação e arquivo de tasks consistentes quando qualquer um deles for afetado.

## Ciclos De Validação

Antes de commitar, rode a validação relevante para a área alterada.

Para backend, prefira:

- `cd backend && npm run check`
- testes direcionados em `backend/test` quando aplicável

Se uma validação não puder ser executada, registre explicitamente o motivo na evidência da task.

## Atualização Da Task

Quando a task estiver completa:

1. Altere o checkbox da task de `- [ ]` para `- [x]`.
2. Adicione ou atualize a linha `Evidencia de validacao`.
3. Não marque uma task principal como concluída enquanto houver subtasks abertas relacionadas.

Se a task não estiver completa:

1. Mantenha o checkbox como `- [ ]`.
2. Adicione uma nota curta de progresso sob a task com o que foi feito e o que falta.

Não mova arquivos de task.
Não crie nem use `issues/done/`.

## Commit

Faça um commit semântico para a única task trabalhada.

A mensagem do commit deve mencionar:

1. Decisões principais tomadas.
2. Arquivos alterados.
3. Bloqueios ou notas para a próxima iteração.

## Regras Finais

Trabalhe em apenas uma task.

Não altere tasks já concluídas sem necessidade clara.
