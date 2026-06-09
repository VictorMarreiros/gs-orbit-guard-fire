# AGENTS.md

## Propósito

Este arquivo é o guia operacional para agentes e contribuidores técnicos neste repositório.
Use-o para implementar mudanças de forma consistente com as decisões de MVP já documentadas em outros arquivos.

## Estado Do Projeto

- Este repositório está na fase inicial de implementação do MVP do OrbitGuard Fire.
- Escopo do produto, refinamento técnico, modelo de dados e contratos de API já estão definidos.
- O trabalho atual deve preservar o fluxo demonstrativo do MVP e, ao mesmo tempo, manter a base pronta para evoluir para comportamentos apoiados por JWT, PostgreSQL e PostGIS.

## Fonte De Verdade

Leia os documentos relevantes antes de alterar código:

- `README.md`
- `tasks/prd-orbitguard-fire-mvp.md`
- `tasks/tasks-orbitguard-fire-mvp.md`
- `docs/mvp-foundation.md`
- `docs/mvp-technical-refinement.md`
- `docs/mvp-data-model.md`
- `docs/api-contracts.md`
- `docs/language-conventions.md`
- `docs/git-conventions.md`

Se a implementação entrar em conflito com algum desses documentos, alinhe o código à decisão documentada ou atualize o documento afetado na mesma alteração.

## Direção Técnica Atual

- Backend: NestJS + TypeScript
- Modelo de persistência: Prisma com PostgreSQL
- Estratégia do MVP: mocks controlados primeiro, com fallback coerente
- Superfície de API: contratos HTTP documentados devem permanecer estáveis e explícitos
- Restrição de arquitetura: não bloquear a evolução futura para autenticação JWT e workflows espaciais com PostGIS

## Responsabilidades Do Repositório

- `backend/`: módulos de domínio, contratos, entities, services, tests e adaptadores de integração
- `database/`: schema Prisma e assets relacionados ao banco de dados
- `docs/`: decisões técnicas, contratos e artefatos de refinamento
- `tasks/`: PRD, decomposição de execução e acompanhamento de entrega

## Regras De Implementação

- Prefira entrega incremental alinhada ao fluxo do MVP, e não expansão especulativa de produção.
- Comece por mocks documentados e cenários de fallback antes de introduzir integrações externas reais.
- Mantenha conceitos de domínio, schema Prisma e contratos HTTP consistentes entre si.
- Não invente arquitetura paralela, módulos duplicados ou formas alternativas de contrato fora da direção documentada.

## Regras De Atualização

- Se você alterar entidades ou estruturas de domínio, revise o schema Prisma e a documentação técnica relacionada.
- Se você alterar request ou response shapes HTTP, atualize os contracts TypeScript e `docs/api-contracts.md` na mesma alteração.
- Se o status de uma task mudar, atualize `tasks/tasks-orbitguard-fire-mvp.md` na mesma alteração.
- Não marque uma task como concluída sem evidência de validação: cobertura automatizada de testes ou uma nota explícita de verificação manual.

## Estratégia De Commit

Prefira commits semânticos com um único assunto por commit:

- `docs(...)` para planejamento, PRD e documentação técnica
- `feat(domain)` para entities, enums e mudanças no schema Prisma
- `feat(api)` para contracts, endpoints e shared API shapes
- `test(...)` para cobertura unitária, integração ou E2E
- `chore(...)` para setup, tooling e trabalho não funcional do repositório

Evite misturar documentação, modelagem de domínio e trabalho de contratos de API no mesmo commit quando isso puder ser separado com clareza.

## Convenções De Git

- Branches devem usar um prefixo claro de tipo, com `feat/` como padrão para trabalho de funcionalidade.
- Outros prefixes aceitos são `fix/`, `docs/`, `test/` e `chore/` quando descreverem melhor o escopo da branch.
- Nomes de branch devem ser curtos, em lowercase e com `kebab-case` depois do prefixo, por exemplo `feat/git-conventions`.
- Mensagens de commit devem ser apenas subjects de uma linha.
- Não adicione corpo de commit, parágrafos, bullets ou explicações em múltiplas linhas.
- Prefira subjects no estilo Conventional Commits, por exemplo `feat(git): add branch naming rule` ou `docs(git): define commit format`.
- Não use parênteses vazios como `feat()`: use `feat(scope): ...` quando houver scope, ou `feat: ...` quando não houver.
- Mantenha o subject no imperativo, conciso e limitado à mudança em si.
- O subject deve idealmente ter até 60 caracteres; até 72 ainda costuma ser aceitável.
- Quando uma alteração for pequena e não precisar de scope, use o subject mais curto possível que ainda comunique a intenção.

Fonte: `docs/git-conventions.md`.

## Convenções De Idioma

- Documentação deve ser escrita em `pt-BR`.
- Código deve permanecer em `en-US`.
- Consulte `docs/language-conventions.md` para a regra completa.

## Critérios Mínimos De Conclusão

Antes de considerar o trabalho concluído:

- o código corresponde à direção documentada do MVP
- a documentação e as tasks afetadas foram atualizadas
- contracts e domínio continuam consistentes internamente
- a validação foi executada ou foi registrada explicitamente
