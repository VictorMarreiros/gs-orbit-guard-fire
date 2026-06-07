# OrbitGuard Fire MVP Data Model

**Status:** Concluido para a task 2  
**Data:** 2026-06-07  
**Referencia:** `tasks/tasks-orbitguard-fire-mvp.md`, `docs/mvp-foundation.md`, `docs/mvp-technical-refinement.md`

## 1. Objetivo

Materializar a trilha `2.x` de modelagem e persistencia do MVP em uma estrutura de dominio consistente com NestJS + Prisma + PostgreSQL, preservando a evolucao futura para JWT e PostGIS.

## 2. Decisoes executadas

### 2.1 Usuario e autenticacao

- Foi definido um modelo `User` com suporte a autenticacao demonstrativa (`DEMO`) e evolucao para `JWT`.
- O contexto minimo de sessao foi mantido no dominio com `accessToken`, `refreshToken`, expiracao e `lastLoginAt`.
- `passwordHash` permanece obrigatorio para evitar acoplamento do dominio a senha em texto claro, mesmo no modo demonstrativo.

### 2.2 Area monitorada

- `MonitoredArea` cobre `name`, `type`, `latitude`, `longitude`, `radiusKm` e auditoria minima.
- Coordenadas persistem com precisao de `6` casas (`Decimal(9,6)`).
- `operationalBufferKm` foi incluido para registrar a regra operacional de `+5 km` definida no refinamento tecnico.

### 2.3 Focos de calor

- `FireEvent` armazena origem, localizacao, horario de deteccao e sinais opcionais como intensidade e confianca.
- A relacao `AreaFireEvent` resolve o vinculo N:N entre area e foco e guarda `distanceKm` e `relevance` (`INSIDE`, `NEARBY`, `OUTSIDE`).
- Essa decisao evita recalculo cego e prepara a transicao para consultas espaciais futuras.

### 2.4 Clima

- `WeatherSnapshot` armazena temperatura, precipitacao, umidade, vento, origem do dado e momento da observacao.
- O modelo suporta dado mockado, vivo ou fallback sem mudar o contrato principal.

### 2.5 Score e fatores de risco

- `RiskScore` registra score final, classificacao, severidade, resumo explicavel, janela temporal e contadores de focos considerados.
- `RiskFactor` separa os fatores explicaveis obrigatorios por `code`, `label`, `points` e `reason`.

### 2.6 Alertas

- `Alert` referencia simultaneamente a area e o `RiskScore` que originou o alerta.
- O modelo contempla `status`, `channel`, `level`, `severity`, `message`, `summary` e `recommendedActions`.

### 2.7 Dashboard agregado

- O dashboard do MVP foi modelado como estrutura agregada de leitura, nao como tabela persistida.
- `DashboardSummaryEntity` cobre alertas ativos, score medio, focos recentes, distribuicao por nivel e areas prioritarias.
- Essa escolha e coerente com o MVP, que precisa de agregacao confiavel sem obrigar materializacao antecipada.

## 3. Arquivos gerados

- `database/prisma/schema.prisma`
- `backend/src/common/domain/enums.ts`
- `backend/src/auth/entities/user.entity.ts`
- `backend/src/monitored-areas/entities/monitored-area.entity.ts`
- `backend/src/fire-events/entities/fire-event.entity.ts`
- `backend/src/weather/entities/weather-snapshot.entity.ts`
- `backend/src/risk-engine/entities/risk-score.entity.ts`
- `backend/src/alerts/entities/alert.entity.ts`
- `backend/src/dashboard/entities/dashboard-summary.entity.ts`

## 4. Observacoes de persistencia

- O schema foi mantido em PostgreSQL puro, sem dependencia imediata de PostGIS.
- A precisao geoespacial inicial usa latitude/longitude decimal e distancia calculada em camada de servico.
- O modelo ja preserva os relacionamentos descritos no README e no PRD, sem bloquear migracoes futuras.
