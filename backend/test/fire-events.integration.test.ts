import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createOrbitGuardFireBackend } from '../src/app/orbitguard-fire-backend';
import { DataOrigin, FireEventRelevance, FireEventSource, MonitoredAreaType } from '../src/common/domain/enums';
import { FireEventsResponseDto } from '../src/fire-events/contracts/fire-events.contracts';

function assertExactKeys(actual: object, expectedKeys: string[]): void {
  assert.deepEqual(Object.keys(actual).sort(), [...expectedKeys].sort());
}

function createAuthenticatedBackend(): {
  backend: ReturnType<typeof createOrbitGuardFireBackend>;
  accessToken: string;
} {
  const backend = createOrbitGuardFireBackend();
  const email = 'focos.integracao@example.com';

  backend.register({
    name: 'Focos Integracao',
    email,
    password: 'SenhaSegura123!',
  });

  const loginResponse = backend.login({
    email,
    password: 'SenhaSegura123!',
  });

  return {
    backend,
    accessToken: loginResponse.accessToken,
  };
}

function assertFireEventsResponseShape(response: FireEventsResponseDto): void {
  assertExactKeys(response, ['areaId', 'periodHours', 'source', 'summary', 'items']);
  assertExactKeys(response.source, ['mode', 'provider', 'usedFallback']);
  assertExactKeys(response.summary, ['total', 'insideCount', 'nearbyCount']);
}

function runSuccessScenario(): void {
  const { backend, accessToken } = createAuthenticatedBackend();

  const area = backend.createMonitoredArea(
    {
      name: 'Fazenda Santa Luzia',
      type: MonitoredAreaType.RURAL_PROPERTY,
      latitude: -15.7801,
      longitude: -47.9292,
      radiusKm: 10,
    },
    accessToken,
  );

  const response = backend.getFireEvents(area.id, { periodHours: 24 }, accessToken);

  assertFireEventsResponseShape(response);
  assert.equal(response.areaId, area.id);
  assert.equal(response.periodHours, 24);
  assert.deepEqual(response.source, {
    mode: DataOrigin.FALLBACK,
    provider: FireEventSource.MOCK,
    usedFallback: true,
  });
  assert.equal(response.summary.total, 4);
  assert.equal(response.summary.insideCount, 2);
  assert.equal(response.summary.nearbyCount, 2);
  assert.equal(response.items.length, 4);
  assert.ok(response.items.every((item) => item.dataOrigin === DataOrigin.FALLBACK));
  assert.ok(response.items.every((item) => item.source === FireEventSource.MOCK));
  assert.ok(response.items.some((item) => item.relevance === FireEventRelevance.INSIDE));
  assert.ok(response.items.some((item) => item.relevance === FireEventRelevance.NEARBY));
}

function runEmptyScenario(): void {
  const { backend, accessToken } = createAuthenticatedBackend();

  const area = backend.createMonitoredArea(
    {
      name: 'Area sem focos relevantes',
      type: MonitoredAreaType.RURAL_PROPERTY,
      latitude: -15.5,
      longitude: -47.5,
      radiusKm: 3,
    },
    accessToken,
  );

  const now = new Date();
  backend.store.upsertFireEvent({
    id: randomUUID(),
    externalId: 'outside-001',
    source: FireEventSource.MOCK,
    dataOrigin: DataOrigin.FALLBACK,
    latitude: -15.1,
    longitude: -47.1,
    detectedAt: now,
    recordedAt: now,
    distanceKm: 18,
    relevance: FireEventRelevance.OUTSIDE,
    createdAt: now,
    updatedAt: now,
  });

  backend.store.upsertAreaFireEvent({
    id: randomUUID(),
    monitoredAreaId: area.id,
    fireEventId: randomUUID(),
    distanceKm: 18,
    relevance: FireEventRelevance.OUTSIDE,
    consideredAt: now,
  });

  const response = backend.getFireEvents(area.id, { periodHours: 24 }, accessToken);

  assertFireEventsResponseShape(response);
  assert.equal(response.summary.total, 0);
  assert.equal(response.summary.insideCount, 0);
  assert.equal(response.summary.nearbyCount, 0);
  assert.equal(response.items.length, 0);
}

function runExternalFallbackScenario(): void {
  const { backend, accessToken } = createAuthenticatedBackend();

  const area = backend.createMonitoredArea(
    {
      name: 'Area com fallback externo',
      type: MonitoredAreaType.RURAL_PROPERTY,
      latitude: -15.7801,
      longitude: -47.9292,
      radiusKm: 10,
    },
    accessToken,
  );

  const originalUpsertFireEvent = backend.store.upsertFireEvent.bind(backend.store);

  backend.store.upsertFireEvent = (() => {
    throw new Error('NASA FIRMS timeout');
  }) as typeof backend.store.upsertFireEvent;

  const response = (() => {
    try {
      return backend.getFireEvents(area.id, { periodHours: 24 }, accessToken);
    } finally {
      backend.store.upsertFireEvent = originalUpsertFireEvent;
    }
  })();

  assertFireEventsResponseShape(response);
  assert.deepEqual(response.source, {
    mode: DataOrigin.FALLBACK,
    provider: FireEventSource.MOCK,
    usedFallback: true,
  });
  assert.equal(response.summary.total, 4);
  assert.equal(response.summary.insideCount, 2);
  assert.equal(response.summary.nearbyCount, 2);
  assert.equal(response.items.length, 4);
}

function runSimulatedFallbackScenario(): void {
  const { backend, accessToken } = createAuthenticatedBackend();

  const area = backend.createMonitoredArea(
    {
      name: 'Area mock moderada',
      type: MonitoredAreaType.RURAL_PROPERTY,
      latitude: -15.6854,
      longitude: -47.8123,
      radiusKm: 6,
    },
    accessToken,
  );

  const response = backend.getFireEvents(area.id, { periodHours: 24 }, accessToken);

  assertFireEventsResponseShape(response);
  assert.deepEqual(response.source, {
    mode: DataOrigin.FALLBACK,
    provider: FireEventSource.MOCK,
    usedFallback: true,
  });
  assert.equal(response.summary.total, 2);
  assert.equal(response.summary.insideCount, 0);
  assert.equal(response.summary.nearbyCount, 2);
  assert.equal(response.items.length, 2);
  assert.ok(response.items.every((item) => item.relevance === FireEventRelevance.NEARBY));
}

runSuccessScenario();
runEmptyScenario();
runExternalFallbackScenario();
runSimulatedFallbackScenario();

console.log('fire events integration checks passed');
