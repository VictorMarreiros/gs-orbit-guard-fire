# OrbitGuard Fire MVP API Contracts

**Status:** Concluido para a task 3  
**Data:** 2026-06-07  
**Referencia:** `tasks/prd-orbitguard-fire-mvp.md`, `docs/mvp-technical-refinement.md`, `docs/mvp-data-model.md`

## 1. Objetivo

Definir os contratos de request, response, validacoes e erros da camada HTTP do MVP, alinhados a autenticacao demonstrativa/JWT, dados mockados com fallback e leitura clara pelo frontend.

## 2. Convencoes gerais

- Base path prevista: `/api`.
- Formato de resposta: `application/json`.
- Datas e horarios: ISO 8601 UTC.
- IDs: `uuid`.
- Autenticacao padrao dos endpoints protegidos: `Authorization: Bearer <token>`.
- No modo demonstrativo, o backend pode emitir token simplificado, mas o contrato externo permanece igual ao JWT.

## 3. Erro padrao

```json
{
  "statusCode": 422,
  "error": "Unprocessable Entity",
  "message": "Payload de area monitorada invalido.",
  "code": "MONITORED_AREA_VALIDATION_FAILED",
  "details": [
    {
      "field": "radiusKm",
      "message": "Informe um raio de monitoramento entre 0.1 km e 50 km.",
      "code": "INVALID_RADIUS"
    }
  ],
  "timestamp": "2026-06-07T14:05:00.000Z",
  "path": "/api/monitored-areas"
}
```

Codigos de erro esperados no MVP:

- `400` para parametro malformado.
- `401` para token ausente ou invalido.
- `403` para acesso negado a area privada.
- `404` para recurso inexistente.
- `409` para conflito de cadastro.
- `422` para violacao de regra de validacao.
- `500` para falha inesperada.

## 4. Autenticacao

### 4.1 `POST /auth/register`

Cria usuario do MVP com estrutura compativel com evolucao para JWT.

Request:

```json
{
  "name": "Maria Oliveira",
  "email": "maria@example.com",
  "password": "SenhaSegura123!"
}
```

Validacoes:

- `name`: `3` a `80` caracteres apos `trim`.
- `email`: formato de email valido.
- `password`: minimo de `8` caracteres.

Response `201`:

```json
{
  "id": "cb81a12d-9c0b-47bd-b0fd-32516f3d95d4",
  "name": "Maria Oliveira",
  "email": "maria@example.com",
  "role": "DEMO_USER",
  "authProvider": "DEMO",
  "createdAt": "2026-06-07T14:00:00.000Z"
}
```

Erros previstos: `400`, `409`, `422`, `500`.

### 4.2 `POST /auth/login`

Request:

```json
{
  "email": "maria@example.com",
  "password": "SenhaSegura123!"
}
```

Response `200`:

```json
{
  "accessToken": "jwt-or-demo-token",
  "expiresInSeconds": 3600,
  "tokenType": "Bearer",
  "user": {
    "id": "cb81a12d-9c0b-47bd-b0fd-32516f3d95d4",
    "name": "Maria Oliveira",
    "email": "maria@example.com",
    "role": "DEMO_USER",
    "authProvider": "DEMO",
    "isDemoUser": true
  }
}
```

Erros previstos: `400`, `401`, `422`, `500`.

### 4.3 `GET /auth/me`

Entrega o contexto do usuario autenticado ou demonstrativo para destravar o frontend do MVP.

Response `200`:

```json
{
  "user": {
    "id": "cb81a12d-9c0b-47bd-b0fd-32516f3d95d4",
    "name": "Maria Oliveira",
    "email": "maria@example.com",
    "role": "DEMO_USER",
    "authProvider": "DEMO",
    "isDemoUser": true
  },
  "permissions": {
    "canManageAreas": true,
    "canViewPrivateAreas": false,
    "canAcknowledgeAlerts": true
  },
  "session": {
    "isDemoSession": true,
    "authProvider": "DEMO",
    "expiresAt": "2026-06-07T15:00:00.000Z"
  }
}
```

Erros previstos: `401`, `500`.

## 5. Areas monitoradas

### 5.1 `POST /monitored-areas`

Request:

```json
{
  "name": "Fazenda Santa Luzia",
  "type": "RURAL_PROPERTY",
  "latitude": -15.7801,
  "longitude": -47.9292,
  "radiusKm": 10
}
```

Validacoes:

- `name`: `3` a `80` caracteres.
- `type`: `RURAL_PROPERTY`, `RURAL_COMMUNITY`, `SCHOOL`, `CONSERVATION_AREA`, `INDIGENOUS_TERRITORY`.
- `latitude`: entre `-90` e `90`.
- `longitude`: entre `-180` e `180`.
- `radiusKm`: entre `0.1` e `50`.

Response `201`:

```json
{
  "id": "95fb2c22-0e86-4038-8c43-a2d0e06ca91b",
  "userId": "cb81a12d-9c0b-47bd-b0fd-32516f3d95d4",
  "name": "Fazenda Santa Luzia",
  "type": "RURAL_PROPERTY",
  "latitude": -15.7801,
  "longitude": -47.9292,
  "radiusKm": 10,
  "operationalBufferKm": 5,
  "createdAt": "2026-06-07T14:02:00.000Z",
  "updatedAt": "2026-06-07T14:02:00.000Z"
}
```

Erros previstos: `400`, `401`, `422`, `500`.

### 5.2 `GET /monitored-areas/:id`

Entrega o contexto espacial suficiente para renderizacao do mapa e proximidade operacional.

Response `200`:

```json
{
  "area": {
    "id": "95fb2c22-0e86-4038-8c43-a2d0e06ca91b",
    "userId": "cb81a12d-9c0b-47bd-b0fd-32516f3d95d4",
    "name": "Fazenda Santa Luzia",
    "type": "RURAL_PROPERTY",
    "latitude": -15.7801,
    "longitude": -47.9292,
    "radiusKm": 10,
    "operationalBufferKm": 5,
    "createdAt": "2026-06-07T14:02:00.000Z",
    "updatedAt": "2026-06-07T14:02:00.000Z"
  },
  "mapContext": {
    "center": {
      "latitude": -15.7801,
      "longitude": -47.9292
    },
    "monitoredRadiusKm": 10,
    "operationalRadiusKm": 15,
    "legend": [
      { "key": "area-center", "label": "Centro da area" },
      { "key": "monitored-radius", "label": "Raio monitorado" },
      { "key": "operational-radius", "label": "Vizinhanca operacional" },
      { "key": "fire-inside", "label": "Foco dentro do raio" },
      { "key": "fire-nearby", "label": "Foco proximo ao raio" }
    ]
  }
}
```

Erros previstos: `401`, `403`, `404`, `500`.

## 6. Focos de calor

### `GET /monitored-areas/:id/fire-events`

Query params:

- `periodHours` opcional; default do MVP: `24`.

Response `200`:

```json
{
  "areaId": "95fb2c22-0e86-4038-8c43-a2d0e06ca91b",
  "periodHours": 24,
  "source": {
    "mode": "FALLBACK",
    "provider": "MOCK",
    "usedFallback": true
  },
  "summary": {
    "total": 4,
    "insideCount": 2,
    "nearbyCount": 2
  },
  "items": [
    {
      "id": "f8d6c560-6746-4ba0-b966-5afbf5c84498",
      "externalId": "mock-fire-001",
      "source": "MOCK",
      "dataOrigin": "FALLBACK",
      "latitude": -15.801,
      "longitude": -47.915,
      "detectedAt": "2026-06-07T13:00:00.000Z",
      "distanceKm": 4.2,
      "relevance": "INSIDE",
      "intensity": 92.4,
      "confidence": 88.1
    }
  ]
}
```

Erros previstos: `400`, `401`, `403`, `404`, `500`.

## 7. Clima

### `GET /monitored-areas/:id/weather/latest`

Response `200`:

```json
{
  "id": "f74c7db4-a6c5-4763-83af-b4579c10b6a0",
  "monitoredAreaId": "95fb2c22-0e86-4038-8c43-a2d0e06ca91b",
  "dataOrigin": "FALLBACK",
  "sourceLabel": "mock-scenario-a",
  "observedAt": "2026-06-07T13:00:00.000Z",
  "temperatureC": 33.2,
  "precipitationMm": 0,
  "humidityPercent": 28,
  "windSpeedMs": 4.1,
  "usedFallback": true
}
```

Erros previstos: `400`, `401`, `403`, `404`, `500`.

## 8. Risco

### `POST /monitored-areas/:id/risk/calculate`

Request opcional:

```json
{
  "periodHours": 24,
  "forceMock": false
}
```

Response `200`:

```json
{
  "id": "3ce65e1a-37ff-4dbe-9569-213ed4d0a2c5",
  "monitoredAreaId": "95fb2c22-0e86-4038-8c43-a2d0e06ca91b",
  "score": 95,
  "level": "CRITICAL",
  "severity": "DANGER",
  "summary": "Focos proximos e clima seco elevam fortemente o risco nas ultimas 24 horas.",
  "evaluatedAt": "2026-06-07T14:03:00.000Z",
  "periodHours": 24,
  "factors": [
    {
      "code": "NEAR_FIRE_CRITICAL",
      "label": "Foco criticamente proximo",
      "points": 25,
      "reason": "Ao menos um foco foi detectado a ate 5 km da area monitorada."
    },
    {
      "code": "FIRE_CLUSTER",
      "label": "Concentracao recente de focos",
      "points": 20,
      "reason": "Tres ou mais focos relevantes foram detectados na janela analisada."
    }
  ],
  "contributingSignals": {
    "fireEventsConsidered": 4,
    "insideFireEvents": 2,
    "nearbyFireEvents": 2
  },
  "dataSources": {
    "fireEvents": "FALLBACK",
    "weather": "FALLBACK"
  },
  "alertTriggered": true
}
```

Erros previstos: `400`, `401`, `403`, `404`, `500`.

## 9. Alertas

### `GET /alerts`

Query params opcionais:

- `status`: `ACTIVE`, `ACKNOWLEDGED`, `RESOLVED`
- `level`: `LOW`, `MODERATE`, `HIGH`, `CRITICAL`
- `monitoredAreaId`: `uuid`

Response `200`:

```json
{
  "items": [
    {
      "id": "f6cf43d6-8ad2-4b4b-963b-4de1fd52403c",
      "monitoredAreaId": "95fb2c22-0e86-4038-8c43-a2d0e06ca91b",
      "areaName": "Fazenda Santa Luzia",
      "status": "ACTIVE",
      "channel": "IN_APP",
      "level": "CRITICAL",
      "severity": "DANGER",
      "title": "Risco critico de queimada",
      "summary": "Focos proximos e clima seco nas ultimas 24h.",
      "triggeredAt": "2026-06-07T14:03:00.000Z"
    }
  ],
  "total": 1,
  "filters": {
    "status": "ACTIVE",
    "level": "CRITICAL"
  }
}
```

Estado vazio `200`:

```json
{
  "items": [],
  "total": 0,
  "filters": {},
  "emptyStateMessage": "Nenhum alerta ativo para as areas monitoradas no momento."
}
```

Erros previstos: `400`, `401`, `500`.

## 10. Dashboard

### `GET /dashboard/summary`

Response `200`:

```json
{
  "generatedAt": "2026-06-07T14:05:00.000Z",
  "monitoredAreasCount": 3,
  "activeAlertsCount": 1,
  "averageRiskScore": 67,
  "recentFireEventsCount": 8,
  "areasByRiskLevel": {
    "LOW": 1,
    "MODERATE": 0,
    "HIGH": 1,
    "CRITICAL": 1
  },
  "priorityAreas": [
    {
      "monitoredAreaId": "95fb2c22-0e86-4038-8c43-a2d0e06ca91b",
      "areaName": "Fazenda Santa Luzia",
      "level": "CRITICAL",
      "score": 95,
      "activeAlertCount": 1,
      "recentFireEvents": 4
    }
  ],
  "hasActiveAlerts": true
}
```

Erros previstos: `401`, `500`.

## 11. Arquivos de contrato em codigo

- `backend/src/common/api/api-error.ts`
- `backend/src/auth/contracts/auth.contracts.ts`
- `backend/src/monitored-areas/contracts/monitored-areas.contracts.ts`
- `backend/src/fire-events/contracts/fire-events.contracts.ts`
- `backend/src/weather/contracts/weather.contracts.ts`
- `backend/src/risk-engine/contracts/risk.contracts.ts`
- `backend/src/alerts/contracts/alerts.contracts.ts`
- `backend/src/dashboard/contracts/dashboard.contracts.ts`

## 12. Decisoes que destravam a task 4

- O frontend pode usar `GET /auth/me` como fonte unica de contexto de sessao.
- O backend deve manter contrato externo de Bearer token mesmo em modo demonstrativo.
- Endpoints de focos e clima precisam retornar `dataOrigin` e `usedFallback`.
- O calculo de risco retorna score, fatores e sinaliza se houve geracao de alerta sem exigir leitura separada imediata.
- A listagem de alertas e o dashboard ja estao moldados para estado vazio explicito.
