# Guia Funcional e Tecnico do MVP do OrbitGuard Fire

**Status:** Consolidado para a task 13.1  
**Data:** 2026-06-07  
**Referencia:** `tasks/prd-orbitguard-fire-mvp.md`, `tasks/tasks-orbitguard-fire-mvp.md`, `docs/mvp-foundation.md`, `docs/mvp-technical-refinement.md`, `docs/mvp-data-model.md`, `docs/api-contracts.md`

## 1. Objetivo

Consolidar a visao funcional e tecnica do MVP demonstrativo do OrbitGuard Fire com base no que ja esta implementado no repositorio, deixando claro o fluxo principal, os mocks controlados, os contratos de API, as regras de risco e as limitacoes atuais.

## 2. Estado atual do MVP

- O frontend demonstrativo continua no prototipo navegavel `prototypes/orbitguard-fire-prototipo-v2.html`, com HTML, CSS e JavaScript puro para a demonstracao do fluxo principal.
- O backend esta organizado em `backend/src` com NestJS + TypeScript, servicos de dominio, contratos, entidades, armazenamento em memoria e adaptadores mockados.
- A raiz do repositório expõe validacao minima e demo com `npm run check`, `npm run check:backend`, `npm run check:prototype` e `npm run demo:prototype`.
- O fluxo e os dados foram desenhados para permanecer coerentes com a evolucao futura para JWT, PostgreSQL e PostGIS, sem exigir essas dependencias como bloqueio do MVP.

## 3. Fluxo principal demonstrado

1. Usuario realiza login demonstrativo.
2. Usuario cadastra uma area monitorada com nome, tipo, latitude, longitude e raio.
3. O sistema retorna o contexto espacial da area e o mapa exibe raio, centro e vizinhanca operacional.
4. O backend entrega focos de calor relevantes com fallback controlado quando necessario.
5. O backend entrega snapshot climatico com fallback controlado quando necessario.
6. O motor de risco calcula score, nivel, severidade e fatores explicaveis.
7. Quando o risco atinge o limiar definido, um alerta preventivo e gerado.
8. O dashboard consolida a visao operacional e a notificacao in-app demonstra a comunicacao final.

## 4. Mocks, fallback e cenarios controlados

O MVP usa mocks controlados como fonte primaria da demonstracao.

- `FireEvent`, `WeatherSnapshot`, `RiskScore`, `Alert` e `DashboardSummary` sao cobertos por cenarios coerentes entre si.
- O fluxo contempla tres cenarios basicos: `CRITICAL`, `MODERATE` e `LOW`.
- O backend registra a origem do dado e sinaliza quando o resultado veio de `FALLBACK`.
- A demo deve continuar funcional mesmo quando a fonte externa simulada falhar.

### 4.1 Cenarios esperados

- `CRITICAL`: varios focos relevantes, clima seco e alerta ativo.
- `MODERATE`: focos proximos com impacto parcial no score.
- `LOW`: ausencia de focos relevantes, sem alerta ativo.

## 5. Contratos de API relevantes

Os contratos documentados em `docs/api-contracts.md` representam a superfice HTTP do MVP.

### Autenticacao

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### Areas monitoradas

- `POST /monitored-areas`
- `GET /monitored-areas/:id`
- `GET /monitored-areas/:id/fire-events`
- `GET /monitored-areas/:id/weather/latest`
- `POST /monitored-areas/:id/risk/calculate`

### Alertas e dashboard

- `GET /alerts`
- `GET /dashboard/summary`

## 6. Regras do motor de risco

- Janela padrao de analise: `24 horas`.
- Score final limitado a `100`.
- Classificacao por faixa:
  - `0` a `30`: `LOW`
  - `31` a `60`: `MODERATE`
  - `61` a `85`: `HIGH`
  - `86` a `100`: `CRITICAL`
- Fatores explicaveis retornam `code`, `label`, `points` e `reason`.
- O motor soma proximidade, concentracao de focos e condicoes climaticas adversas de forma deterministica.

## 7. Limitacoes atuais do MVP

- A entrega continua demonstrativa, nao operacional.
- O envio real de notificacoes por push, SMS, WhatsApp ou e-mail segue fora de escopo.
- A dependencia obrigatoria de APIs externas nao existe nesta fase.
- O historico persistido de longo prazo ainda nao e requisito do MVP.
- PostGIS e JWT seguem como evolucao arquitetural, nao como bloqueio do fluxo atual.

## 8. Documentos relacionados

- `README.md` - entrada principal do repositorio e panorama do produto.
- `docs/mvp-foundation.md` - baseline de stack e estrategia.
- `docs/mvp-technical-refinement.md` - regras tecnicas do fluxo e do risco.
- `docs/mvp-data-model.md` - modelagem de dados.
- `docs/api-contracts.md` - contratos HTTP e formatos de resposta.
- `docs/mvp-scope-alignment.md` - delimitacao de escopo e fora de escopo.
