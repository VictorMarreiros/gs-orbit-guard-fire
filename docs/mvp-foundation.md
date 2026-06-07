# OrbitGuard Fire MVP Foundation

**Status:** Baseline definida para implementacao  
**Data:** 2026-06-07  
**Referencia:** `tasks/prd-orbitguard-fire-mvp.md`, `tasks/tasks-orbitguard-fire-mvp.md`

## 1. Objetivo deste documento

Definir a stack, a estrutura inicial do repositorio e a estrategia de entrega do MVP para permitir a implementacao sem conflito com o PRD.

## 2. Decisoes de stack

### 2.1 Frontend

- **Framework:** React com TypeScript e Vite.
- **Roteamento:** React Router.
- **Estilizacao:** Tailwind CSS.
- **Mapa:** Leaflet com OpenStreetMap.
- **Estado de servidor:** Fetch API encapsulada em servicos locais.
- **Testes:** Vitest + Testing Library para unitarios e Playwright para E2E.

**Justificativa:** Vite reduz friccao de setup no MVP, React atende o fluxo navegavel do prototipo e Leaflet cobre o requisito de mapa interativo com baixo custo de integracao.

### 2.2 Backend

- **Framework:** NestJS com TypeScript.
- **Validacao:** class-validator + class-transformer.
- **Documentacao de API:** Swagger/OpenAPI.
- **Autenticacao do MVP:** contexto demonstrativo simples no inicio, com estrutura preparada para JWT.
- **Testes:** Jest para unitarios e integracao.

**Justificativa:** NestJS ja esta previsto no README/PRD, organiza bem modulos de dominio e facilita a evolucao do contrato demonstrativo para APIs reais.

### 2.3 Persistencia

- **Banco alvo do MVP funcional:** PostgreSQL.
- **Extensao geoespacial alvo:** PostGIS.
- **ORM:** Prisma.
- **Fase inicial:** seed e mock controlado podem preceder a dependencia obrigatoria de banco em todas as telas.

**Justificativa:** Prisma acelera modelagem e seed do MVP; PostgreSQL/PostGIS preserva aderencia ao PRD sem exigir sofisticacao geoespacial completa no primeiro incremento.

### 2.4 Dados simulados e integracoes

- **Fonte primaria do MVP:** dados simulados/controlados versionados no repositorio.
- **Adaptadores previstos:** `NASA FIRMS`, `NASA POWER` e `INPE BDQueimadas`.
- **Politica:** toda integracao externa deve ter fallback local explicito.

### 2.5 Observabilidade e qualidade

- **Logs:** estruturados em JSON no backend para eventos de coleta, calculo e alerta.
- **Lint/format:** ESLint + Prettier em frontend e backend.
- **Qualidade minima de entrega:** testes unitarios do motor de risco e validacao de area, mais um fluxo E2E principal.

## 3. Estrutura inicial do repositorio

```text
gs-orbit-guard-fire/
|-- frontend/
|   |-- src/
|   |   |-- app/
|   |   |-- pages/
|   |   |-- components/
|   |   |-- features/
|   |   |   |-- auth/
|   |   |   |-- monitored-areas/
|   |   |   |-- risk/
|   |   |   |-- alerts/
|   |   |   `-- dashboard/
|   |   |-- services/
|   |   |-- maps/
|   |   |-- mocks/
|   |   |-- test/
|   |   `-- styles/
|   |-- public/
|   `-- e2e/
|-- backend/
|   |-- src/
|   |   |-- auth/
|   |   |-- users/
|   |   |-- monitored-areas/
|   |   |-- fire-events/
|   |   |-- weather/
|   |   |-- risk-engine/
|   |   |-- alerts/
|   |   |-- dashboard/
|   |   |-- integrations/
|   |   |   |-- providers/
|   |   |   `-- mocks/
|   |   |-- common/
|   |   `-- config/
|   `-- test/
|-- database/
|   |-- prisma/
|   `-- seeds/
|-- docs/
|   |-- mvp-foundation.md
|   `-- mvp-scope-alignment.md
|-- tasks/
`-- README.md
```

## 4. Estrategia de entrega do MVP

### 4.1 Fase de implementacao

1. Estruturar monorepo leve com `frontend`, `backend`, `database` e `docs`.
2. Implementar fluxo demonstrativo ponta a ponta com mocks locais primeiro.
3. Introduzir persistencia e contratos reais de API em seguida.
4. Preparar adaptadores externos sem torna-los dependencias obrigatorias da demo.

### 4.2 Estrategia funcional

- O fluxo principal deve funcionar offline ou com rede instavel.
- O mapa deve renderizar a area, o raio e focos mockados antes de qualquer integracao real.
- O motor de risco deve ser deterministico e explicavel.
- O dashboard pode iniciar semi-dinamico com dados agregados mockados e evoluir para backend real.

### 4.3 Estrategia de testes

- **Frontend unitario:** validacao de formulario, estados de UI e renderizacao do resultado de risco.
- **Backend unitario:** regras de pontuacao, classificacao e construcao do alerta.
- **Integracao API:** contratos de auth, area, clima, focos, risco, alertas e dashboard.
- **E2E:** cadastro de area -> mapa -> calculo -> alerta -> dashboard.

## 5. Decisoes de escopo tecnico para destravar o MVP

- O login inicial sera demonstrativo, mas o contrato e o backend devem nascer preparados para JWT.
- O MVP nao depende de notificacao real; a notificacao sera visual/in-app.
- PostGIS permanece como alvo arquitetural, mas calculos espaciais iniciais podem usar formula simplificada por distancia em km.
- Historico pode ser mockado no primeiro incremento desde que o dashboard mantenha coerencia com o fluxo principal.

## 6. Pendencias abertas

- Confirmar a janela temporal padrao para focos recentes no calculo de risco.
- Confirmar a lista inicial de tipos de area monitorada.
- Confirmar se o primeiro incremento ja deve subir PostgreSQL local ou se pode iniciar em memoria com seed versionado.

## 7. Resultado esperado da task 0.1

Com esta baseline, o projeto passa a ter:

- stack definida para frontend, backend, persistencia, mocks e testes;
- estrutura-alvo de repositorio clara;
- estrategia incremental coerente com o PRD;
- pontos em aberto explicitados sem bloquear o inicio das proximas tasks.
